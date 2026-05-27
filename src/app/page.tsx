import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import TrustSection from '@/components/home/TrustSection';
import HowItWorks from '@/components/home/HowItWorks';
import EarlyCommunity from '@/components/home/EarlyCommunity';
import BecomeProviderBanner from '@/components/home/BecomeProviderBanner';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServiceCards />
<TrustSection />
        <HowItWorks />
        <EarlyCommunity />
        <BecomeProviderBanner />
      </main>
      <Footer />
    </>
  );
}
