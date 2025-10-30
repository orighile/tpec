import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NigeriaEventPlanners from "@/components/planners/NigeriaEventPlanners";
import JaraBot from "@/components/jarabot";

const PlannersPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <NigeriaEventPlanners />
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default PlannersPage;
