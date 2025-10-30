
import Navbar from "../components/Navbar";
import About from "../components/About";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn about TPEC Events and our approach to event consulting
            </p>
          </div>
        </div>
        <About />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
