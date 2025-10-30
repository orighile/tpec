import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import JaraBot from "@/components/jarabot";

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white text-center">Frequently Asked Questions</h1>
            <p className="text-white/90 text-center mt-4 max-w-2xl mx-auto">
              Find answers to common questions about our event consulting services and platform
            </p>
          </div>
        </div>
        <FAQ />
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default FAQPage;
