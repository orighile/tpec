import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NigerianServicesDirectory from "@/components/vendors/NigerianServicesDirectory";
import JaraBot from "@/components/jarabot";

const VenuesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
