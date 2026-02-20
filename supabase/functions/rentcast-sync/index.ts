import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RENTCAST_API_KEY = Deno.env.get("RENTCAST_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const rcHeaders = {
  "X-Api-Key": RENTCAST_API_KEY || "",
  "Accept": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { propertyId } = await req.json();
    if (!propertyId) {
      return new Response(JSON.stringify({ error: "Missing propertyId" }), {
        status: 400, headers: corsHeaders,
      });
    }

    // 1. Fetch the property from our DB
    const { data: property, error: propErr } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (propErr || !property) {
      return new Response(JSON.stringify({ error: "Property not found", details: propErr }), {
        status: 404, headers: corsHeaders,
      });
    }

    const { address_line1, city, state, zip_code, user_id } = property;
    const address = `${address_line1}, ${city}, ${state} ${zip_code}`;
    const encodedAddress = encodeURIComponent(address);

    // ──────────────────────────────────────────────
    // 2. Fetch Property Records (auto-populate details)
    //    GET /v1/properties?address=...
    //    Returns: [{ squareFootage, yearBuilt, lotSize, bedrooms, bathrooms,
    //               propertyType, taxAssessments: [{ year, value }],
    //               lastSalePrice, lastSaleDate, ... }]
    // ──────────────────────────────────────────────
    let propertyDetails: Record<string, any> = {};
    try {
      const recordRes = await fetch(
        `https://api.rentcast.io/v1/properties?address=${encodedAddress}`,
        { headers: rcHeaders }
      );
      if (recordRes.ok) {
        const records = await recordRes.json();
        // API returns an array; take the first match
        if (Array.isArray(records) && records.length > 0) {
          propertyDetails = records[0];
          console.log("Property record found:", JSON.stringify(propertyDetails).slice(0, 200));
        }
      } else {
        console.warn("Property records fetch returned", recordRes.status);
      }
    } catch (e) {
      console.warn("Property records fetch failed, continuing:", e);
    }

    // ──────────────────────────────────────────────
    // 3. Fetch Value Estimate (AVM)
    //    GET /v1/avm/value?address=...
    // ──────────────────────────────────────────────
    const valueRes = await fetch(
      `https://api.rentcast.io/v1/avm/value?address=${encodedAddress}`,
      { headers: rcHeaders }
    );

    if (!valueRes.ok) {
      const errBody = await valueRes.text();
      console.error("RentCast Value Estimate error:", valueRes.status, errBody);
      return new Response(
        JSON.stringify({ error: "RentCast Value Estimate failed", status: valueRes.status, details: errBody }),
        { status: 502, headers: corsHeaders }
      );
    }
    const valueData = await valueRes.json();

    // ──────────────────────────────────────────────
    // 4. Fetch Rent Estimate
    //    GET /v1/avm/rent/longTerm?address=...
    // ──────────────────────────────────────────────
    let rentEstimate: number | null = null;
    try {
      const rentRes = await fetch(
        `https://api.rentcast.io/v1/avm/rent/longTerm?address=${encodedAddress}`,
        { headers: rcHeaders }
      );
      if (rentRes.ok) {
        const rentData = await rentRes.json();
        rentEstimate = rentData.rent ?? null;
      }
    } catch (e) {
      console.warn("Rent estimate fetch failed, continuing without it:", e);
    }

    // ──────────────────────────────────────────────
    // 5. Build the updates object
    // ──────────────────────────────────────────────
    const estimatedValue = valueData.price;
    if (!estimatedValue) {
      return new Response(
        JSON.stringify({ error: "No value estimate returned", details: valueData }),
        { status: 404, headers: corsHeaders }
      );
    }

    const updates: Record<string, any> = {
      current_value: estimatedValue,
      last_avm_sync: new Date().toISOString(),
    };

    // Rent estimate
    if (rentEstimate !== null) {
      updates.monthly_rental_income = rentEstimate;
    }

    // Auto-populate from property records (only fill in fields the user hasn't set)
    if (propertyDetails.squareFootage && !property.sqft) {
      updates.sqft = propertyDetails.squareFootage;
    }
    if (propertyDetails.yearBuilt && !property.year_built) {
      updates.year_built = propertyDetails.yearBuilt;
    }
    if (propertyDetails.bedrooms && !property.bedrooms) {
      updates.bedrooms = propertyDetails.bedrooms;
    }
    if (propertyDetails.bathrooms && !property.bathrooms) {
      updates.bathrooms = propertyDetails.bathrooms;
    }
    if (propertyDetails.lotSize && !property.lot_size) {
      updates.lot_size = propertyDetails.lotSize;
    }
    if (propertyDetails.propertyType && !property.property_type) {
      updates.property_type = propertyDetails.propertyType;
    }

    // Tax assessment — get the most recent year
    if (Array.isArray(propertyDetails.taxAssessments) && propertyDetails.taxAssessments.length > 0) {
      // Sort by year descending to get the latest
      const sorted = propertyDetails.taxAssessments.sort((a: any, b: any) => (b.year ?? 0) - (a.year ?? 0));
      const latest = sorted[0];
      if (latest.value) {
        updates.property_taxes = latest.value;
        updates.tax_year = latest.year ?? null;
      }
    }

    // Last sale info
    if (propertyDetails.lastSalePrice && !property.purchase_price) {
      updates.purchase_price = propertyDetails.lastSalePrice;
      updates.last_sale_price = propertyDetails.lastSalePrice;
    }
    if (propertyDetails.lastSaleDate) {
      updates.last_sale_date = propertyDetails.lastSaleDate;
      if (!property.purchase_date) {
        updates.purchase_date = propertyDetails.lastSaleDate;
      }
    }

    // ──────────────────────────────────────────────
    // 6. Update the property record
    // ──────────────────────────────────────────────
    const { error: updateErr } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", propertyId);

    if (updateErr) {
      console.error("Failed to update property:", updateErr);
      throw updateErr;
    }

    // ──────────────────────────────────────────────
    // 7. Save snapshot to value history
    // ──────────────────────────────────────────────
    await supabase.from("property_value_history").insert({
      property_id: propertyId,
      user_id,
      recorded_date: new Date().toISOString().split("T")[0],
      property_value: estimatedValue,
      mortgage_debt: property.current_mortgage_debt ?? null,
      equity: estimatedValue - (property.current_mortgage_debt ?? 0),
      source: "rentcast_api",
    });

    // ──────────────────────────────────────────────
    // 8. Save comparable sales
    // ──────────────────────────────────────────────
    const comparables = valueData.comparables ?? [];
    if (comparables.length > 0) {
      await supabase
        .from("comparable_sales")
        .delete()
        .eq("property_id", propertyId);

      const compsToInsert = comparables.slice(0, 10).map((comp: any) => ({
        property_id: propertyId,
        user_id,
        address: comp.formattedAddress || comp.addressLine1 || "Unknown",
        sold_price: comp.price ?? comp.lastSalePrice ?? 0,
        sold_date: comp.listedDate || comp.lastSaleDate || new Date().toISOString().split("T")[0],
        sqft: comp.squareFootage ?? null,
        price_per_sqft: comp.squareFootage && comp.price
          ? Math.round(comp.price / comp.squareFootage)
          : null,
        distance_miles: comp.distance ?? null,
        similarity_score: comp.correlation ? Math.round(comp.correlation * 100) : null,
        source: "rentcast_api",
      }));

      const { error: compErr } = await supabase
        .from("comparable_sales")
        .insert(compsToInsert);

      if (compErr) {
        console.warn("Failed to insert comparables:", compErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        new_value: estimatedValue,
        rent_estimate: rentEstimate,
        comps_saved: comparables.length,
        auto_populated: Object.keys(updates).filter(k => !["current_value", "last_avm_sync", "monthly_rental_income"].includes(k)),
      }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: corsHeaders,
    });
  }
});
