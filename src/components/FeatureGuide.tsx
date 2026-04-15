import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { easeDefault } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ...easeDefault, staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface FeatureGuideCta {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
  icon?: LucideIcon;
}

interface FeatureGuideProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  onCtaClick: () => void;
  secondaryCta?: FeatureGuideCta;
  /** Tailwind classes for icon container background, e.g. "bg-yellow-100 dark:bg-yellow-900/30" */
  iconBgClass?: string;
  /** Tailwind class for icon color, e.g. "text-yellow-600" */
  iconColorClass?: string;
  /** Tailwind class for bullet dot color, e.g. "bg-yellow-600". Defaults to bg-primary. */
  bulletDotClass?: string;
  /** Tailwind class for top accent border, e.g. "border-t-blue-500". Omit for no accent border. */
  accentBorderClass?: string;
}

const FeatureGuide = ({
  icon: Icon,
  title,
  description,
  bullets,
  ctaLabel,
  onCtaClick,
  secondaryCta,
  iconBgClass = "bg-primary/10",
  iconColorClass = "text-primary",
  bulletDotClass = "bg-primary",
  accentBorderClass,
}: FeatureGuideProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={containerVariants}
      className={cn("card-luxury p-8 sm:p-12 text-center", accentBorderClass && `border-t-2 ${accentBorderClass}`)}
    >
      <motion.div variants={itemVariants} className={`w-16 h-16 rounded-2xl ${iconBgClass} flex items-center justify-center mx-auto mb-5`}>
        <Icon className={`w-8 h-8 ${iconColorClass}`} />
      </motion.div>

      <motion.h3 variants={itemVariants} className="text-heading-xl text-foreground mb-2 break-words">{title}</motion.h3>
      <motion.p variants={itemVariants} className="text-body-luxury text-muted-foreground max-w-md mx-auto mb-6 break-words">
        {description}
      </motion.p>

      <motion.ul variants={itemVariants} className="text-sm text-muted-foreground max-w-sm mx-auto space-y-2 mb-8 text-left">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${bulletDotClass} shrink-0`} />
            <span className="break-words min-w-0">{bullet}</span>
          </li>
        ))}
      </motion.ul>

      <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 flex-wrap">
        <Button className="btn-primary-luxury" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
        {secondaryCta && (
          <Button
            variant={secondaryCta.variant || "outline"}
            className="btn-secondary-luxury"
            onClick={secondaryCta.onClick}
          >
            {secondaryCta.icon && <secondaryCta.icon className="w-4 h-4 mr-2" />}
            {secondaryCta.label}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FeatureGuide;
