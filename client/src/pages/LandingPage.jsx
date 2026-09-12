import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { KanbanPreview } from '../components/landing/KanbanPreview';
import { LogosBanner } from '../components/landing/LogosBanner';
import { ValuePropsSection } from '../components/landing/ValuePropsSection';
import { AISpecsSection } from '../components/landing/AISpecsSection';
import { WIPLimitsSection } from '../components/landing/WIPLimitsSection';
import { RoleViewsSection } from '../components/landing/RoleViewsSection';
import { MetricsSection } from '../components/landing/MetricsSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { BottomCTASection } from '../components/landing/BottomCTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-lato selection:bg-zinc-800 selection:text-white overflow-x-hidden">
      <LandingNavbar />
      <main>
        <HeroSection />
        <KanbanPreview />
        <LogosBanner />
        <ValuePropsSection />
        <AISpecsSection />
        <WIPLimitsSection />
        <RoleViewsSection />
        <MetricsSection />
        <TestimonialsSection />
        <ComparisonSection />
        <BottomCTASection />
      </main>
      <LandingFooter />
    </div>
  );
};
