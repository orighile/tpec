
import Navbar from "../components/Navbar";
import PlanningTools from "../components/PlanningTools";
import Footer from "../components/Footer";

const PlanningToolsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Planning Tools</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools to help you plan and manage every aspect of your event
            </p>
          </div>
        </div>
        <PlanningTools />
      </main>
      <Footer />
    </div>
  );
};

export default PlanningToolsPage;
