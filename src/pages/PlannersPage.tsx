import NigeriaEventPlanners from "@/components/planners/NigeriaEventPlanners";
import JaraBot from "@/components/jarabot";
import { SEO } from "@/components/SEO";

const PlannersPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top Event Planners in Nigeria",
    "description": "Professional event planners specializing in weddings, corporate events, and celebrations across Nigeria"
  };

  return (
    <>
      <SEO 
        title="Professional Event Planners in Nigeria | Wedding & Corporate | TPEC"
        description="Find expert event planners in Lagos, Abuja, and across Nigeria. Specializing in weddings, corporate events, birthdays, and cultural celebrations. Book your consultation today."
        keywords="event planners Nigeria, wedding planners Lagos, corporate event planners Abuja, professional party planners, Nigerian event coordinators"
        jsonLd={jsonLd}
      />
      <main className="flex-1 bg-background">
        <NigeriaEventPlanners />
      </main>
      <JaraBot />
    </>
  );
};

export default PlannersPage;
