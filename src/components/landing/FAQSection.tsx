import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-8 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Questions You Might Have
          </h2>
          <p className="text-xl text-muted-foreground">
            Honest answers to common concerns
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="security" className="card-luxury px-6 border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Is my financial data secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                <p>Yes. We use Plaid for bank connections—the same technology used by Venmo, Robinhood, Chime, and thousands of financial apps. Your credentials are encrypted with bank-level 256-bit encryption.</p>
                <p>We have <strong className="text-foreground">read-only access</strong>. We can see your transactions but cannot move money, make payments, or initiate transfers.</p>
                <p>Your data is stored on Supabase with row-level security, meaning only you can access your home's information.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="free-plan" className="card-luxury px-6 border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Is the Free plan really free?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                <p>Yes, genuinely free forever. No credit card required to sign up. No hidden "trial period" that converts to paid.</p>
                <p>The Free plan gives you manual expense tracking, 3 active tasks, and document storage. You can upgrade to Pro anytime or stay on Free forever.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bank-required" className="card-luxury px-6 border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Do I have to connect my bank account?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                <p>No, it's completely optional. You can use Sheltr without ever connecting a bank account. The Free plan supports manual expense entry.</p>
                <p>That said, automatic bank sync (Pro plan) saves hours per month and ensures nothing slips through the cracks.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancel" className="card-luxury px-6 border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Can I cancel anytime?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                <p>Yes. Cancel your subscription anytime from your account settings. No phone calls, no hassle.</p>
                <p>You keep all your data. You can export everything to CSV before you leave.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mobile-app" className="card-luxury px-6 border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Is there a mobile app?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                <p>Not yet, but it's coming. Right now, Sheltr is fully mobile-responsive—works perfectly in your phone's browser.</p>
                <p>Native iOS and Android apps are on our roadmap for Q2 2026.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-export" className="card-luxury px-6 border-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Can I export my data?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3 pt-4">
                <p>Yes. You can export all your data to CSV files anytime. No lock-in. It's your data.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
