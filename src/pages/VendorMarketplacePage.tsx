import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NigerianServicesDirectory from "@/components/vendors/NigerianServicesDirectory";
import JaraBot from "@/components/jarabot";
import { SEO } from "@/components/SEO";

const VendorMarketplacePage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nigerian Event Vendors & Services",
    "description": "Browse verified event vendors in Nigeria - caterers, photographers, DJs, decorators, and more",
    "itemListElement": []
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Browse Event Vendors in Nigeria | TPEC Events Marketplace"
        description="Find and book verified event vendors in Lagos, Abuja, and across Nigeria. Browse caterers, photographers, DJs, decorators, venues, and more for your perfect event."
        keywords="event vendors Nigeria, wedding vendors Lagos, caterers Abuja, event photographers, Nigerian DJs, party decorators, event services Nigeria"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4">
          <NigerianServicesDirectory />
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default VendorMarketplacePage;
