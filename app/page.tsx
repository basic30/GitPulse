import { ParticleBackground } from "@/components/landing/particle-background"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { ComparisonTable } from "@/components/landing/comparison-table"
import { PricingSection } from "@/components/landing/pricing-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <ComparisonTable />
        <PricingSection />
        <Footer />
      </div>
    </main>
  )
}
