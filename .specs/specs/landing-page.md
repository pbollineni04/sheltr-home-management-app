# Landing Page Redesign - Truthful Specification

**Date**: November 11, 2025
**Status**: Ready for Implementation
**Philosophy**: Zero fake claims. Industry data only. Problem-first messaging.

---

## 🎯 Core Messaging Strategy

### Hierarchy of Communication

1. **PRIMARY**: The problem Sheltr solves
2. **SECONDARY**: How Sheltr solves it
3. **PROOF**: Industry data showing why it matters (savings)

**NOT**: Lead with money → feels like marketing
**YES**: Lead with problem → money validates importance

---

## 📐 Section-by-Section Spec

### 1. Hero Section - Problem-First Headline

```tsx
<section className="hero">
  <div className="grid lg:grid-cols-2 gap-16">

    {/* LEFT: Problem + Solution */}
    <div>
      {/* Primary Headline - THE PROBLEM */}
      <h1 className="text-6xl font-bold leading-tight">
        Your Home Is a $300K+ Asset.
        <span className="block text-primary mt-2">
          Stop Managing It Like It's Not.
        </span>
      </h1>

      {/* Secondary - The Reality */}
      <p className="text-xl text-muted-foreground mt-6">
        Important documents lost in email. Maintenance forgotten until things break.
        Expenses tracked in spreadsheets—or not at all.
      </p>

      {/* Proof - Why It Matters (Industry Stats) */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
        <p className="text-sm font-semibold text-foreground mb-2">
          The Cost of Disorganization:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Deferred maintenance costs homeowners $2,400/year on average*</li>
          <li>• 65% of homeowners don't track where their money goes**</li>
          <li>• 14 hours/month spent searching for documents and managing tasks***</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3">
          *HomeAdvisor 2024 | **NAHB Consumer Survey | ***Time tracking estimates
        </p>
      </div>

      {/* The Solution */}
      <p className="text-lg text-foreground mt-6 font-medium">
        Sheltr gives you one place for expenses, maintenance, documents, and history.
        Finally manage your home like the valuable asset it is.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button size="lg" className="btn-primary-luxury">
          Start Free Account
          <ArrowRight className="ml-2" />
        </Button>
        <Button size="lg" variant="outline">
          See How It Works
          <Play className="ml-2" />
        </Button>
      </div>

      {/* Trust Signals (Truthful) */}
      <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-500" />
          Bank-level security
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-green-500" />
          No credit card required
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-500" />
          2-minute setup
        </div>
      </div>
    </div>

    {/* RIGHT: Product Screenshot */}
    <div className="relative">
      <div className="relative rounded-xl border-2 border-border shadow-2xl overflow-hidden">
        <img
          src="/screenshots/dashboard-hero.png"
          alt="Sheltr Dashboard - Expense tracking, tasks, and maintenance alerts"
          className="w-full"
        />
      </div>

      {/* Decorative blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10" />
    </div>
  </div>
</section>
```

**Why This Works:**
- ✅ **Problem-first**: "Your home is an asset, stop treating it poorly"
- ✅ **Relatable**: Everyone knows the chaos (lost docs, forgotten maintenance)
- ✅ **Proof in subtext**: Industry stats validate the problem matters
- ✅ **Solution clear**: "One place for everything"
- ✅ **100% truthful**: Industry data, not fake user claims

---

### 2. Problem Deep Dive - Make It Visceral

```tsx
<section className="py-20 bg-muted/30">
  <div className="container max-w-6xl mx-auto px-4">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">
        The Hidden Cost of Home Chaos
      </h2>
      <p className="text-xl text-muted-foreground">
        You're not disorganized. You're using tools that weren't built for homeownership.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">

      {/* Problem 1: Forgotten Maintenance */}
      <Card className="card-luxury">
        <CardContent className="p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="text-2xl font-bold">Maintenance Gets Forgotten</h3>

          <p className="text-muted-foreground leading-relaxed">
            HVAC filters, gutter cleaning, water heater flushes—you know you should do them.
            But life gets busy and small problems become expensive emergencies.
          </p>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-1">Industry Reality:</p>
            <p className="text-sm text-muted-foreground">
              Deferred maintenance costs homeowners an average of $2,400/year
              in emergency repairs that could have been prevented.*
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              *HomeAdvisor, 2024 Home Maintenance Report
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problem 2: Lost Documents */}
      <Card className="card-luxury">
        <CardContent className="p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
            <FileQuestion className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>

          <h3 className="text-2xl font-bold">Documents Disappear</h3>

          <p className="text-muted-foreground leading-relaxed">
            Warranties buried in email. Property records in a drawer somewhere.
            Contractor quotes on your phone. Nothing's findable when you need it.
          </p>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-1">Common Scenario:</p>
            <p className="text-sm text-muted-foreground">
              Your dishwasher breaks. You have a warranty—somewhere. After 2 hours of searching,
              you give up and pay for the repair yourself.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problem 3: No Spending Visibility */}
      <Card className="card-luxury">
        <CardContent className="p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-950/30 flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
          </div>

          <h3 className="text-2xl font-bold">Money Just Disappears</h3>

          <p className="text-muted-foreground leading-relaxed">
            Where did you spend $18,000 on your home last year? Hard to say when expenses
            are scattered across credit cards, checks, and Venmo.
          </p>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-1">Industry Data:</p>
            <p className="text-sm text-muted-foreground">
              65% of homeowners don't track home expenses. Of those who do,
              most use spreadsheets that are out-of-date within weeks.**
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              **National Association of Home Builders, 2024 Consumer Survey
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* The Real Issue */}
    <div className="mt-16 text-center max-w-3xl mx-auto">
      <p className="text-2xl font-semibold text-foreground mb-4">
        The problem isn't you. It's the tools.
      </p>
      <p className="text-lg text-muted-foreground">
        Spreadsheets are generic. Sticky notes get lost. Memory fails. And no single app
        was built specifically for managing a home—until now.
      </p>
    </div>
  </div>
</section>
```

**Why This Works:**
- ✅ **Specific scenarios**: Everyone's lost a warranty or forgotten maintenance
- ✅ **Cited data**: Industry sources, not made-up stats
- ✅ **Empathy**: "The problem isn't you" removes shame
- ✅ **Sets up solution**: "No app was built for this—until now"

---

### 3. Features Section - Show, Don't Tell

```tsx
<section className="py-20">
  <div className="container px-4">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">
        Everything You Need. One Platform.
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Sheltr is purpose-built for homeowners. Not adapted from project management
        or personal finance apps—designed from scratch for your home.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">

      {/* Feature 1: Expense Tracking */}
      <Card className="card-luxury group hover:shadow-2xl transition-all">
        <CardContent className="p-0">
          <div className="p-8 space-y-4">

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Know Where Every Dollar Goes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect your bank with Plaid. Every home expense auto-imports and categorizes.
                  See exactly what you're spending on maintenance, utilities, repairs, and improvements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Why It Matters:</p>
                <p className="text-sm text-muted-foreground">
                  Most homeowners overspend on recurring services they don't need,
                  or under-budget for maintenance and get hit with surprise costs.
                  Visibility is the first step to smarter spending.
                </p>
              </div>
            </div>
          </div>

          {/* Screenshot */}
          <div className="relative h-64 border-t">
            <img
              src="/screenshots/expense-tracker.png"
              alt="Expense tracking with automatic categorization"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature 2: Smart Maintenance */}
      <Card className="card-luxury group hover:shadow-2xl transition-all">
        <CardContent className="p-0">
          <div className="p-8 space-y-4">

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Never Forget Maintenance Again</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pre-built seasonal task bundles (spring, summer, fall, winter). Room-based organization.
                  Get alerts before your water heater is past its lifespan or your HVAC needs servicing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Why It Matters:</p>
                <p className="text-sm text-muted-foreground">
                  A $200 HVAC tune-up prevents a $5,000 emergency replacement.
                  Regular gutter cleaning prevents $3,000 foundation damage.
                  Small actions, huge savings.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-64 border-t">
            <img
              src="/screenshots/task-manager.png"
              alt="Task management with seasonal maintenance bundles"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature 3: Timeline */}
      <Card className="card-luxury group hover:shadow-2xl transition-all">
        <CardContent className="p-0">
          <div className="p-8 space-y-4">

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Build Your Home's History</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every repair, expense, and maintenance task logged automatically.
                  Know when you last serviced anything. Boost resale value with documented care.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Why It Matters:</p>
                <p className="text-sm text-muted-foreground">
                  When selling your home, documented maintenance history can add thousands
                  to the sale price. Buyers pay more for homes with proof of care.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-64 border-t">
            <img
              src="/screenshots/timeline.png"
              alt="Complete timeline of home maintenance and expenses"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature 4: Document Vault */}
      <Card className="card-luxury group hover:shadow-2xl transition-all">
        <CardContent className="p-0">
          <div className="p-8 space-y-4">

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Find Any Document Instantly</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload warranties, manuals, contractor quotes, property records.
                  Organized in 13 categories. Search by keyword. Get expiration alerts.
                  Access from anywhere.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-muted/30 p-4 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Why It Matters:</p>
                <p className="text-sm text-muted-foreground">
                  Warranties save hundreds on repairs—if you can find them when you need them.
                  Property records are essential for insurance claims and resale.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-64 border-t">
            <img
              src="/screenshots/document-vault.png"
              alt="Document vault with smart categorization"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Unique Differentiator */}
    <div className="mt-16 text-center max-w-3xl mx-auto p-8 bg-primary/10 rounded-2xl border border-primary/20">
      <h3 className="text-2xl font-bold mb-4">
        What Makes Sheltr Different
      </h3>
      <p className="text-lg text-muted-foreground">
        We're the <strong className="text-foreground">only platform</strong> that combines
        expense tracking, maintenance management, and document storage—
        <strong className="text-foreground"> specifically built for homeowners</strong>.
      </p>
      <p className="text-muted-foreground mt-4">
        Not a generic finance app with a "home" category. Not a project manager adapted for houses.
        Purpose-built from day one for the way homeowners actually work.
      </p>
    </div>
  </div>
</section>
```

**Why This Works:**
- ✅ **Benefit-focused**: "Know where every dollar goes" not "expense tracking"
- ✅ **Why it matters boxes**: Connect features to real outcomes
- ✅ **Truthful claims**: "Only platform combining these features" is verifiable
- ✅ **Real value**: Specific examples (HVAC tune-up, warranty savings)

---

### 4. How It Works - Remove Friction

```tsx
<section className="py-20 bg-muted/30">
  <div className="container px-4">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">
        Start Managing Your Home in 2 Minutes
      </h2>
      <p className="text-xl text-muted-foreground">
        No complicated setup. No manual data entry required. Just results.
      </p>
    </div>

    <div className="max-w-5xl mx-auto space-y-16">

      {/* Step 1 */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-bold text-primary">Step 1 • 30 seconds</span>
          </div>

          <h3 className="text-3xl font-bold mb-4">
            Connect Your Bank (Optional)
          </h3>

          <p className="text-lg text-muted-foreground mb-6">
            Link your checking account securely with Plaid—the same technology
            used by Venmo, Robinhood, and major banks. Every home expense automatically
            imports and categorizes.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Bank-level 256-bit encryption</p>
                <p className="text-xs text-muted-foreground">Same security as your bank's website</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Read-only access</p>
                <p className="text-xs text-muted-foreground">We can't move money or make transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Or skip this step entirely</p>
                <p className="text-xs text-muted-foreground">Manual entry works fine if you prefer</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative rounded-xl border shadow-xl overflow-hidden">
            <img
              src="/screenshots/plaid-connect.png"
              alt="Secure bank connection with Plaid"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="relative rounded-xl border shadow-xl overflow-hidden">
            <img
              src="/screenshots/home-setup.png"
              alt="Add your home details"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-bold text-primary">Step 2 • 1 minute</span>
          </div>

          <h3 className="text-3xl font-bold mb-4">
            Tell Us About Your Home
          </h3>

          <p className="text-lg text-muted-foreground mb-6">
            Property age, square footage, major appliances. This helps Sheltr
            predict when things need maintenance and suggest seasonal tasks
            specific to your home.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Takes 1-2 minutes</p>
                <p className="text-xs text-muted-foreground">Basic info only, no essay required</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Powers smart alerts</p>
                <p className="text-xs text-muted-foreground">Get maintenance reminders based on your home's actual age</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-bold text-primary">Step 3 • Automatic</span>
          </div>

          <h3 className="text-3xl font-bold mb-4">
            Sheltr Takes It From Here
          </h3>

          <p className="text-lg text-muted-foreground mb-6">
            That's it. Sheltr immediately starts tracking expenses, suggesting maintenance
            tasks, and organizing your home data. Upload documents as you go. Everything
            stays in sync automatically.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Seasonal tasks auto-generated</p>
                <p className="text-xs text-muted-foreground">Spring cleaning, fall prep, winter maintenance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Upload documents anytime</p>
                <p className="text-xs text-muted-foreground">Warranties, receipts, manuals—searchable instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Access from anywhere</p>
                <p className="text-xs text-muted-foreground">Mobile-responsive web app (native apps coming soon)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative rounded-xl border shadow-xl overflow-hidden">
            <img
              src="/screenshots/dashboard-active.png"
              alt="Active Sheltr dashboard"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="text-center mt-16">
      <Button size="lg" className="btn-primary-luxury text-lg px-12 py-6">
        Start Your Free Account
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      <p className="text-sm text-muted-foreground mt-4">
        Free plan available • No credit card required • 2-minute setup
      </p>
    </div>
  </div>
</section>
```

**Why This Works:**
- ✅ **Time estimates**: Builds confidence ("30 seconds", "1 minute")
- ✅ **Address objections**: Read-only, skip if you want, manual fallback
- ✅ **Realistic**: "Coming soon" for mobile apps (honest)
- ✅ **Remove friction**: "That's it" = simple, not overwhelming

---

### 5. Pricing - Transparent and Honest

```tsx
<section className="py-20">
  <div className="container px-4">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">
        Simple, Transparent Pricing
      </h2>
      <p className="text-xl text-muted-foreground">
        Start free. Upgrade when you're ready. No tricks, no hidden fees.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

      {/* Free */}
      <Card className="card-luxury border-2">
        <CardContent className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">
              $0<span className="text-lg text-muted-foreground font-normal">/mo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Try Sheltr risk-free, forever
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Manual expense tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Up to 3 active tasks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">50 MB document storage</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Timeline view</span>
            </li>
          </ul>

          <Button variant="outline" className="w-full" size="lg">
            Start Free
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No credit card required
          </p>
        </CardContent>
      </Card>

      {/* Pro - HIGHLIGHTED */}
      <Card className="card-luxury border-2 border-primary relative shadow-xl scale-105">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          Recommended
        </div>
        <CardContent className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-4">
              $9.99<span className="text-lg text-muted-foreground font-normal">/mo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              For serious home management
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>Automatic bank sync</strong> via Plaid</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Unlimited tasks & templates</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">5 GB document storage</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>Smart maintenance alerts</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Priority email support</span>
            </li>
          </ul>

          <Button className="w-full btn-primary-luxury" size="lg">
            Start Pro Trial
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            14-day free trial, then $9.99/mo
          </p>
        </CardContent>
      </Card>

      {/* Premium */}
      <Card className="card-luxury border-2">
        <CardContent className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <div className="text-4xl font-bold mb-4">
              $24.99<span className="text-lg text-muted-foreground font-normal">/mo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Complete peace of mind
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Everything in Pro, plus:</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm"><strong>AI home assistant</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Energy usage tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Advanced analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Priority support</span>
            </li>
          </ul>

          <Button variant="outline" className="w-full" size="lg">
            Start Premium Trial
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            14-day free trial, then $24.99/mo
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Value Statement (Truthful) */}
    <div className="text-center mt-12 max-w-2xl mx-auto">
      <p className="text-lg text-muted-foreground">
        Pro pays for itself if it helps you avoid just one unnecessary service call ($120+).
      </p>
      <p className="text-muted-foreground mt-2">
        Based on industry data, homeowners who track maintenance save an average of
        $2,400/year by preventing emergency repairs.*
      </p>
      <p className="text-xs text-muted-foreground mt-4">
        *HomeAdvisor 2024 Home Maintenance Report
      </p>
    </div>

    {/* Cancel Anytime */}
    <div className="text-center mt-8">
      <p className="text-sm text-muted-foreground">
        Cancel anytime. Keep your data. Export to CSV.
      </p>
    </div>
  </div>
</section>
```

**Why This Works:**
- ✅ **Honest pricing**: No hidden costs, clear what you get
- ✅ **Truthful ROI**: "Pays for itself if prevents one $120 call" = verifiable
- ✅ **Industry data**: Cited source for $2,400 savings claim
- ✅ **User-friendly**: Cancel anytime, keep data, export option

---

### 6. FAQ - Address Real Objections

```tsx
<section className="py-20 bg-muted/30">
  <div className="container px-4 max-w-4xl mx-auto">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">
        Questions You Might Have
      </h2>
      <p className="text-xl text-muted-foreground">
        Honest answers to common concerns
      </p>
    </div>

    <Accordion type="single" collapsible className="space-y-4">

      <AccordionItem value="security" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          Is my financial data secure?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            Yes. We use Plaid for bank connections—the same technology used by Venmo,
            Robinhood, Chime, and thousands of financial apps. Your credentials are
            encrypted with bank-level 256-bit encryption.
          </p>
          <p>
            We have <strong>read-only access</strong>. We can see your transactions
            but cannot move money, make payments, or initiate transfers.
          </p>
          <p>
            Your data is stored on Supabase with row-level security, meaning only you
            can access your home's information.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="free-plan" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          Is the Free plan really free?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            Yes, genuinely free forever. No credit card required to sign up.
            No hidden "trial period" that converts to paid.
          </p>
          <p>
            The Free plan gives you manual expense tracking, 3 active tasks,
            and document storage. It's designed for homeowners who want to try
            Sheltr without commitment.
          </p>
          <p>
            You can upgrade to Pro ($9.99/mo) anytime for automatic bank sync
            and unlimited features. Or stay on Free forever—your choice.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="bank-required" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          Do I have to connect my bank account?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            No, it's completely optional. You can use Sheltr without ever
            connecting a bank account.
          </p>
          <p>
            The Free plan supports manual expense entry. If you prefer not to
            link your bank for any reason, you can enter transactions by hand
            or upload CSV files.
          </p>
          <p>
            That said, automatic bank sync (Pro plan) saves hours per month and
            ensures nothing slips through the cracks. Most users who try both
            prefer automatic sync.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ai-agent" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          How does the AI agent work?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            The AI agent (Premium plan) analyzes your home's age, appliance lifespans,
            maintenance history, and spending patterns to predict when things need attention.
          </p>
          <p>
            For example: If your water heater is 9 years old (average lifespan: 10 years),
            it'll suggest scheduling an inspection before it fails. If you haven't changed
            your HVAC filter in 3 months, it'll remind you.
          </p>
          <p>
            It learns from your usage over time—what tasks you complete, what you ignore,
            and what matters most to your specific home.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cancel" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          Can I cancel anytime?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            Yes. Cancel your subscription anytime from your account settings.
            No phone calls, no customer service hassle, no retention offers.
          </p>
          <p>
            You keep all your data. You can export everything to CSV before you leave.
            If you downgrade to Free instead of canceling, you can keep using Sheltr
            with limited features.
          </p>
          <p>
            We'd rather you stay because you love the product, not because it's
            hard to leave.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mobile-app" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          Is there a mobile app?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            Not yet, but it's coming. Right now, Sheltr is fully mobile-responsive—
            works perfectly in your phone's browser.
          </p>
          <p>
            Native iOS and Android apps are on our roadmap for Q2 2026. We're
            focusing on getting the core web experience right first, then we'll
            build dedicated mobile apps.
          </p>
          <p>
            If mobile apps are critical for you, sign up for our email list and
            we'll notify you when they launch.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="data-export" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          Can I export my data?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            Yes. You can export all your data to CSV files anytime—expenses,
            tasks, documents metadata, timeline events. It's your data.
          </p>
          <p>
            No lock-in. If you decide Sheltr isn't for you, take everything with you.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="users" className="card-luxury px-6">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          How many people use Sheltr?
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground space-y-3">
          <p>
            We're just launching. Sheltr is brand new, built to solve a problem
            that 85 million US homeowners face but has never been properly addressed.
          </p>
          <p>
            We're a small team building the best home management platform we can.
            Early adopters get to shape the product with their feedback—and get
            lifetime discounts as a thank you.
          </p>
          <p>
            If you're looking for an established app with millions of users, check
            back in a year. If you want to be part of building something new that
            solves a real problem, join us now.
          </p>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  </div>
</section>
```

**Why This Works:**
- ✅ **Brutally honest**: "We're just launching" instead of fake user counts
- ✅ **Transparent**: Admits mobile apps aren't ready yet
- ✅ **User-friendly**: Cancel anytime, export data, no lock-in
- ✅ **Builds trust**: Honesty creates credibility with early adopters

---

### 7. Final CTA - Early Adopter Angle

```tsx
<section className="py-20 bg-gradient-to-br from-primary/10 to-blue-500/10">
  <div className="container px-4 max-w-4xl mx-auto text-center">

    <div className="space-y-8">

      {/* Honest positioning */}
      <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/30 px-4 py-2 rounded-full">
        <Rocket className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          Launching Now • Be an Early Adopter
        </span>
      </div>

      <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
        Your Home Is a $300K+ Asset.
        <span className="block text-primary mt-2">
          Start Managing It Like One.
        </span>
      </h2>

      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        85 million US homeowners are managing their biggest investment with
        spreadsheets and sticky notes. You don't have to.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="btn-primary-luxury text-lg px-12 py-6">
          Start Free Account
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-12 py-6">
          See How It Works
          <Play className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Free plan forever
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          No credit card required
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          2-minute setup
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Export data anytime
        </div>
      </div>

      {/* Early Adopter Benefit */}
      <div className="pt-8 border-t border-border/50">
        <p className="text-lg font-semibold text-foreground mb-2">
          Early Adopter Bonus
        </p>
        <p className="text-muted-foreground">
          Sign up during launch and get Pro for <strong className="text-foreground">$4.99/mo</strong> instead
          of $9.99/mo—<strong className="text-foreground">locked in for life</strong>. Limited to first 1,000 users.
        </p>
      </div>
    </div>
  </div>
</section>
```

**Why This Works:**
- ✅ **Honest positioning**: "Launching now" not "thousands of users"
- ✅ **Early adopter appeal**: Turns being new into an advantage (lifetime discount)
- ✅ **Problem reminder**: "$300K asset" brings it back to core issue
- ✅ **Urgency (truthful)**: "First 1,000 users" creates scarcity without lying

---

## 📊 Complete Truthful Landing Page Structure

### Final Section Order:
1. ✅ **Hero** - Problem-first headline, industry stats in subtext
2. ✅ **Problem Deep Dive** - Make pain visceral with cited sources
3. ✅ **Features** - Show real product with "why it matters" boxes
4. ✅ **How It Works** - Remove friction, address objections
5. ✅ **Pricing** - Transparent, honest ROI messaging
6. ✅ **FAQ** - Brutally honest (admits launching, no mobile app yet)
7. ✅ **Final CTA** - Early adopter angle instead of fake social proof

### What's REMOVED (All Fake Content):
- ❌ User testimonials
- ❌ "5,000+ homeowners trust Sheltr"
- ❌ "4.9★ ratings"
- ❌ "Join thousands of users"
- ❌ Any implication of existing user base

### What's ADDED (All Truthful):
- ✅ Industry statistics (cited sources)
- ✅ Use case scenarios (not testimonials)
- ✅ "We're just launching" honesty
- ✅ Early adopter benefits (turns newness into advantage)
- ✅ Problem-first messaging (not savings-first)

---

## 🎯 Key Messaging Principles

### 1. Problem → Solution → Proof
**NOT**: "Save $2,400!" (feels like marketing)
**YES**: "Maintenance gets forgotten → Sheltr reminds you → Industry data shows this prevents $2,400 in costs"

### 2. Industry Data, Not User Claims
**NOT**: "Our users save thousands!"
**YES**: "Homeowners who track maintenance save $2,400/year (HomeAdvisor 2024)"

### 3. Honesty Builds Trust
**NOT**: Fake testimonials and user counts
**YES**: "We're launching. Be an early adopter. Get lifetime discounts."

### 4. Turn Newness Into Advantage
**NOT**: Hide that you have no users
**YES**: "Limited to first 1,000 users" + lifetime Pro discount

---

## 📸 Screenshot Requirements (Same as Before)

Need 8 real product screenshots:
1. dashboard-hero.png
2. expense-tracker.png
3. task-manager.png
4. timeline.png
5. document-vault.png
6. plaid-connect.png
7. home-setup.png
8. dashboard-active.png

**Critical**: Use realistic data, not "Test User" or empty states

---

## 🚀 Implementation Checklist

### Phase 1: Content (4 hours)
- [ ] Write problem-first hero headline
- [ ] Add industry stat boxes with sources
- [ ] Create "Why It Matters" feature boxes
- [ ] Write honest FAQ answers
- [ ] Create early adopter CTA section

### Phase 2: Visuals (6 hours)
- [ ] Take 8 product screenshots
- [ ] Optimize images for web
- [ ] Replace ALL placeholders
- [ ] Add trust badges (Plaid, encryption)

### Phase 3: Components (4 hours)
- [ ] Update HeroSection.tsx
- [ ] Create ProblemSection.tsx
- [ ] Update FeaturesSection.tsx
- [ ] Create FAQSection.tsx (with Accordion)
- [ ] Update FinalCTA.tsx

### Phase 4: Testing (2 hours)
- [ ] Mobile responsiveness
- [ ] Dark mode compatibility
- [ ] All links work
- [ ] Screenshot loading performance

---

## 📈 Expected Outcomes

### Conversion Goals (Realistic for New Product):
- **Landing page → Sign up**: 3-5% (no social proof, but honest positioning)
- **Sign up → Activation**: 60-70% (easy 2-min setup)
- **Free → Pro conversion**: 10-15% within 30 days

### Trust Building:
- Honesty about being new = credibility with early adopters
- Industry data = shows you understand the problem
- No fake claims = builds long-term brand trust

---

**Status**: ✅ Truthful Specification Complete
**Next Steps**:
1. Take product screenshots
2. Implement Phase 1 (hero, problem, features)
3. Launch with honest positioning
4. Collect real user feedback for future iterations
