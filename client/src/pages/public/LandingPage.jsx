import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import TrustedBy from '../../components/public/TrustedBy';
import Features from '../../components/public/Features';
import DashboardShowcase from '../../components/public/DashboardShowcase';
import Stats from '../../components/public/Stats';
import HowItWorks from '../../components/public/HowItWorks';
import Comparison from '../../components/public/Comparison';
import Testimonials from '../../components/public/Testimonials';
import Pricing from '../../components/public/Pricing';
import FAQ from '../../components/public/FAQ';
import CTA from '../../components/public/CTA';
import Footer from '../../components/public/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <DashboardShowcase />
      <Stats />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
