import React from "react";
import HeroSection from "../../../components/home/HeroSection";
import TrustBadges from "../../../components/home/TrustBadges";
import FeaturedCourses from "../../../components/home/FeaturedCourses";
import BenefitsSection from "../../../components/home/BenefitsSection";
import RegistrationSteps from "../../../components/home/RegistrationSteps";
import TeachersSection from "../../../components/home/TeachersSection";
import TestimonialsSection from "../../../components/home/TestimonialsSection";
import FinalCTA from "../../../components/home/FinalCTA";
import LandingFooter from "../../../components/home/LandingFooter";

const HomePage: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <TrustBadges />
      <FeaturedCourses />
      <BenefitsSection />
      <RegistrationSteps />
      <TeachersSection />
      <TestimonialsSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
};

export default HomePage;
