import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ProgrammeQuiz from "@/components/ProgrammeQuiz";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <Features />
      <ProgrammeQuiz />
      <UseCases />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
