import { Navbar } from "@features/landing/ui/components/Navbar";
import { Hero } from "@features/landing/ui/components/Hero";
import { Features } from "@features/landing/ui/components/Features";
import { Pricing } from "@features/landing/ui/components/Pricing";
import { Testimonials } from "@features/landing/ui/components/Testimonials";
import { CTA } from "@features/landing/ui/components/CTA";
import { Footer } from "@features/landing/ui/components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
