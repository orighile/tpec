
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartyCrewBuilder from "@/components/PartyCrewBuilder";
import JaraBot from "@/components/jarabot";

const PartyCrewPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <PartyCrewBuilder />
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default PartyCrewPage;
