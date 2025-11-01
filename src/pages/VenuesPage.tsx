import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NigerianServicesDirectory from "@/components/vendors/NigerianServicesDirectory";
import JaraBot from "@/components/jarabot";
import { SEO } from "@/components/SEO";

const VenuesPage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Event Venues in Nigeria",
    "description": "Premium event venues for weddings, corporate events, and celebrations in Lagos, Abuja, and across Nigeria"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Event Venues in Nigeria - Wedding Halls & Corporate Spaces | TPEC"
        description="Discover premium event venues in Lagos, Abuja, and across Nigeria. Find the perfect space for weddings, corporate events, parties, and celebrations. Book your venue today."
        keywords="event venues Nigeria, wedding venues Lagos, conference halls Abuja, party venues, banquet halls Nigeria, event spaces Lagos"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Browse Venues</h1>
            <p className="text-muted-foreground text-lg">
              Discover the perfect venue for your event in Nigeria
            </p>
          </div>
          <NigerianServicesDirectory />
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default VenuesPage;
