import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Manual expense tracking",
      "Up to 3 active tasks",
      "Document storage (10 docs)",
      "Home timeline",
      "CSV export",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    originalPrice: "$9.99",
    period: "/mo",
    badge: "Early Adopter Price",
    description: "Everything you need, automated",
    features: [
      "Automatic bank sync via Plaid",
      "Unlimited tasks & documents",
      "Budget tracking & alerts",
      "Energy tracking",
      "Priority support",
      "All future features included",
    ],
    cta: "Start Free, Upgrade Anytime",
    highlighted: true,
  },
];

export const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container px-4 sm:px-8 max-w-5xl mx-auto">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Simple, Honest Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you're ready. No surprises.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                className={`card-luxury relative overflow-hidden transition-all duration-300 hover:shadow-xl h-full ${plan.highlighted ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {plan.badge}
                  </div>
                )}
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                    {plan.originalPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {plan.originalPrice}/mo
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-5 ${plan.highlighted ? "btn-primary-luxury" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => navigate("/auth?mode=signup")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
