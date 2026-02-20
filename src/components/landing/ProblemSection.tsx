import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, FileQuestion, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const ProblemSection = () => {
  return (
    <section id="problems" className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4 sm:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            The Hidden Cost of Home Chaos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You're not disorganized. You're using tools that weren't built for homeownership.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Problem 1 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="card-luxury h-full">
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
                  <p className="text-xs text-muted-foreground mt-2">*HomeAdvisor, 2024</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Problem 2 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="card-luxury h-full">
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
          </motion.div>

          {/* Problem 3 */}
          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="card-luxury h-full">
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
                  <p className="text-xs text-muted-foreground mt-2">**NAHB, 2024</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* The Real Issue */}
        <motion.div
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-2xl font-semibold text-foreground mb-4">
            The problem isn't you. It's the tools.
          </p>
          <p className="text-lg text-muted-foreground">
            Spreadsheets are generic. Sticky notes get lost. Memory fails. And no single app
            was built specifically for managing a home—until now.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
