import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import ProductDemo from '../../components/home/ProductDemo';
import DashboardPreview from '../../components/home/DashboardPreview';
import DarkCTASection from '../../components/home/DarkCTASection';
import AnalyticsSection from '../../components/home/AnalyticsSection';
import CustomerStory from '../../components/home/CustomerStory';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import SetupSteps from '../../components/home/SetupSteps';
import FinalCTA from '../../components/home/FinalCTA';
import HomeFooter from '../../components/home/HomeFooter';

const Home = () => {
  return (
    <div className="min-h-screen font-[Inter,sans-serif]">
      <HeroSection />
      <FeaturesSection />
      <ProductDemo />
      <DashboardPreview />
      <DarkCTASection />
      <AnalyticsSection />
      <CustomerStory />
      <TestimonialsSection />
      <SetupSteps />
      <FinalCTA />
      {/* <HomeFooter /> */}
    </div>
  );
};

export default Home;
