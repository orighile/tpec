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
    <>
      <SEO 
        title="Browse Event Vendors in Nigeria | TPEC Events Marketplace"
        description="Find and book verified event vendors in Lagos, Abuja, and across Nigeria. Browse caterers, photographers, DJs, decorators, venues, and more for your perfect event."
        keywords="event vendors Nigeria, wedding vendors Lagos, caterers Abuja, event photographers, Nigerian DJs, party decorators, event services Nigeria"
        jsonLd={jsonLd}
      />
      <div className="py-12">
        <div className="container mx-auto px-4">
          <NigerianServicesDirectory />
        </div>
      </div>
      <JaraBot />
    </>
  );
};

export default VendorMarketplacePage;
