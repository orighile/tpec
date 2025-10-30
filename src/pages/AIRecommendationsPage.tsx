
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIRecommendationEngine from "@/components/AIRecommendationEngine";
import JaraBot from "@/components/jarabot";

const AIRecommendationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <AIRecommendationEngine />
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default AIRecommendationsPage;
