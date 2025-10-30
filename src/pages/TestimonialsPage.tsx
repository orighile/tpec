
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialProof from "@/components/SocialProof";
import JaraBot from "@/components/jarabot";

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <SocialProof />
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default TestimonialsPage;
