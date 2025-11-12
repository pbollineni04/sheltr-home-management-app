import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Questions You Might Have
          </h2>
          <p className="text-xl text-muted-foreground">
            Honest answers to common concerns
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="security" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Is my financial data secure?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
              <p>
                Yes. We use Plaid for bank connections—the same technology used by Venmo,
                Robinhood, Chime, and thousands of financial apps. Your credentials are
                encrypted with bank-level 256-bit encryption.
              </p>
              <p>
                We have <strong className="text-foreground">read-only access</strong>. We can see your transactions
                but cannot move money, make payments, or initiate transfers.
              </p>
              <p>
                Your data is stored on Supabase with row-level security, meaning only you
                can access your home's information.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="free-plan" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Is the Free plan really free?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
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

          <AccordionItem value="bank-required" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Do I have to connect my bank account?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
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

          <AccordionItem value="ai-agent" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              How does the AI agent work?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
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

          <AccordionItem value="cancel" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Can I cancel anytime?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
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

          <AccordionItem value="mobile-app" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Is there a mobile app?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
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

          <AccordionItem value="data-export" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Can I export my data?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
              <p>
                Yes. You can export all your data to CSV files anytime—expenses,
                tasks, documents metadata, timeline events. It's your data.
              </p>
              <p>
                No lock-in. If you decide Sheltr isn't for you, take everything with you.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="users" className="card-luxury px-6 border-0">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              How many people use Sheltr?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-3 pt-4">
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
  );
};
