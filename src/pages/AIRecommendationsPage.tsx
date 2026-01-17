import AIRecommendationEngine from "@/components/AIRecommendationEngine";
import JaraBot from "@/components/jarabot";

const AIRecommendationsPage = () => {
  return (
    <>
      <main className="flex-1 py-12">
        <AIRecommendationEngine />
      </main>
      <JaraBot />
    </>
  );
};

export default AIRecommendationsPage;
