import { Navbar } from "@features/landing/ui/components/Navbar";
import { Hero } from "@features/landing/ui/components/Hero";
import { SocialProof } from "@features/landing/ui/components/SocialProof";
import { Features } from "@features/landing/ui/components/Features";
import { Pricing } from "@features/landing/ui/components/Pricing";
import { Testimonials } from "@features/landing/ui/components/Testimonials";
import { CTA } from "@features/landing/ui/components/CTA";
import { Footer } from "@features/landing/ui/components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cabe-500 selection:text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
