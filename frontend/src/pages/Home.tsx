import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { LogoStrip } from "@/sections/LogoStrip";
import { Features } from "@/sections/Features";
import { HowItWorks } from "@/sections/HowItWorks";
import { Pricing } from "@/sections/Pricing";
import { Testimonials } from "@/sections/Testimonials";
import { FAQ } from "@/sections/FAQ";
import { FinalCTA } from "@/sections/FinalCTA";
import { Footer } from "@/sections/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Home() {
  // if user is already authenticated, redirect to dashboard
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  // otherwise, show the landing page / public home page
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
