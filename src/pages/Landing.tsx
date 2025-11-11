import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
