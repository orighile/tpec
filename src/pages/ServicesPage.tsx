
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import ConsultationBooking from "../components/ConsultationBooking";
import Footer from "../components/Footer";

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive event planning and consulting services to bring your vision to life
            </p>
          </div>
        </div>
        <Services />
        <ConsultationBooking />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
