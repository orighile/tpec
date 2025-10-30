import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NigerianServicesDirectory from "@/components/vendors/NigerianServicesDirectory";
import JaraBot from "@/components/jarabot";

const VendorMarketplacePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
