
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Building2, 
  PartyPopper, 
  Laptop, 
  Users, 
  CalendarClock,
  ChevronLeft
} from "lucide-react";
import JaraBot from "@/components/jarabot";

// Service data with expanded information
const servicesData = {
  "wedding-planning": {
    title: "Wedding Planning",
    icon: Heart,
    description: "From intimate ceremonies to grand celebrations, we provide comprehensive wedding planning services tailored to your vision.",
    longDescription: "Our wedding planning services are designed to make your special day truly memorable. We handle everything from venue selection and vendor coordination to timeline creation and day-of coordination, allowing you to enjoy your celebration stress-free.",
    features: [
      "Venue Selection & Management",
      "Vendor Coordination & Booking",
      "Budget Planning & Management",
      "Timeline Creation & Implementation",
      "Day-of Coordination",
      "Guest Management"
    ],
    process: [
      "Initial Consultation - We'll discuss your vision, preferences, and budget.",
      "Planning Phase - We'll create a comprehensive plan and timeline.",
      "Vendor Selection - We'll help you choose and book the best vendors.",
      "Coordination - We'll coordinate all aspects of your wedding day.",
      "Execution - We'll ensure everything runs smoothly on your special day."
    ],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80"
  },
  "celebrations": {
    title: "Milestone Celebrations",
    icon: PartyPopper,
    description: "Make your special moments memorable with our expertly planned birthday parties, anniversaries, and other milestone events.",
    longDescription: "Our celebration planning services help you mark life's special moments with style and joy. From birthdays and anniversaries to graduations and retirement parties, we create personalized experiences that reflect your personality and preferences.",
    features: [
      "Theme Development & Design",
      "Entertainment Booking & Management",
      "Decor Design & Setup",
      "Full-Service Planning & Coordination",
      "Venue Selection & Management",
      "Custom Experiences"
    ],
    process: [
      "Consultation - We'll discuss your celebration goals and preferences.",
      "Concept Development - We'll create a unique theme and design concept.",
      "Planning - We'll handle all logistics and vendor coordination.",
      "Setup - We'll transform your venue according to the design concept.",
      "Execution - We'll ensure your celebration runs smoothly and memorably."
    ],
    image: "https://images.unsplash.com/photo-1533294455009-a77b7557d979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80"
  },
  "corporate": {
    title: "Corporate Events",
    icon: Building2,
    description: "Elevate your company events with our professional corporate event planning services for conferences, galas, and team building.",
    longDescription: "Our corporate event planning services are designed to help your business make a lasting impression. From conferences and galas to product launches and team-building activities, we create professional, engaging events that align with your brand and objectives.",
    features: [
      "Venue Sourcing & Management",
      "Speaker & Talent Management",
      "Catering Coordination & Menu Development",
      "Branding Integration & Implementation",
      "Technical Production & AV Management",
      "Registration & Attendee Management"
    ],
    process: [
      "Strategy Session - We'll discuss your event objectives and requirements.",
      "Proposal Development - We'll create a comprehensive event plan and budget.",
      "Planning & Coordination - We'll handle all logistics and vendor management.",
      "Production - We'll oversee all technical aspects of your event.",
      "Execution - We'll ensure your event runs seamlessly and professionally."
    ],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
  },
  "hybrid-events": {
    title: "Hybrid Events",
    icon: Laptop,
    description: "Combine in-person and virtual experiences with our hybrid event solutions for maximum reach and engagement.",
    longDescription: "Our hybrid event planning services help you bridge the gap between physical and virtual attendance, creating inclusive experiences for all participants regardless of location. We leverage cutting-edge technology to ensure seamless integration between in-person and online components.",
    features: [
      "Technology Integration & Management",
      "Live Streaming & Video Production",
      "Virtual Engagement Strategies",
      "Hybrid Logistics & Coordination",
      "Dual Content Creation & Management",
      "Technical Support & Troubleshooting"
    ],
    process: [
      "Needs Assessment - We'll discuss your hybrid event requirements and objectives.",
      "Platform Selection - We'll help you choose the right technology for your event.",
      "Planning & Integration - We'll develop strategies for engaging both audiences.",
      "Production - We'll manage all technical aspects of your hybrid event.",
      "Execution - We'll ensure a seamless experience for all participants."
    ],
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2112&q=80"
  },
  "online-events": {
    title: "Online Events",
    icon: Users,
    description: "Engage your audience with professionally produced virtual events that deliver impact regardless of location.",
    longDescription: "Our online event planning services help you create engaging, interactive virtual experiences that transcend geographical boundaries. From webinars and virtual conferences to online workshops and digital celebrations, we design and produce online events that captivate your audience.",
    features: [
      "Platform Selection & Setup",
      "Digital Production & Direction",
      "Virtual Networking Opportunities",
      "Technical Support & Troubleshooting",
      "Content Creation & Management",
      "Attendee Engagement Strategies"
    ],
    process: [
      "Strategy Development - We'll discuss your online event goals and requirements.",
      "Platform Selection - We'll help you choose the right technology for your event.",
      "Content Planning - We'll develop engaging content and activities.",
      "Production - We'll handle all technical aspects of your online event.",
      "Execution - We'll ensure a smooth and engaging experience for all participants."
    ],
    image: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80"
  },
  "consultation": {
    title: "Consultation Services",
    icon: CalendarClock,
    description: "Get expert advice and strategic planning guidance for your self-managed events through our consultation services.",
    longDescription: "Our consultation services provide expert guidance and support for self-managed events. Whether you need help with planning strategy, vendor recommendations, budget optimization, or timeline creation, our experienced consultants offer personalized advice to ensure your event's success.",
    features: [
      "Planning Strategy Development",
      "Vendor Recommendations & Introductions",
      "Budget Optimization & Management",
      "Timeline Creation & Management",
      "Logistics Guidance & Support",
      "Crisis Management Planning"
    ],
    process: [
      "Initial Assessment - We'll discuss your event and identify areas where you need support.",
      "Strategy Development - We'll create a tailored consultation plan based on your needs.",
      "Guidance Sessions - We'll provide expert advice and recommendations.",
      "Resource Provision - We'll share tools, templates, and vendor contacts.",
      "Follow-up Support - We'll be available to answer questions and provide additional guidance."
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
  }
};

const ServiceDetailPage = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const service = serviceType ? servicesData[serviceType as keyof typeof servicesData] : null;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceType]);
  
  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
              <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been moved.</p>
              <Button asChild>
                <Link to="/services">Back to Services</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const ServiceIcon = service.icon;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/services" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4" />
              Back to Services
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center">
                  <ServiceIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">{service.title}</h1>
              </div>
              
              <p className="text-lg text-gray-700 mb-6">{service.longDescription}</p>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Our Services Include:</h2>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto text-lg"
                onClick={() => window.open("https://calendly.com/ladyadeolaighile/meet-and-greet", "_blank")}
              >
                Book a Consultation
              </Button>
            </div>
            
            <div>
              <div className="rounded-lg overflow-hidden shadow-md mb-8">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-72 object-cover"
                />
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Our Process:</h2>
                <ol className="space-y-4">
                  {service.process.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary/10 text-primary font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Ready to Get Started?</h2>
            <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
              Let our team of expert event consultants help you create a memorable and successful {service.title.toLowerCase()} experience.
            </p>
            <div className="flex justify-center">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto text-lg"
                onClick={() => window.open("https://calendly.com/ladyadeolaighile/meet-and-greet", "_blank")}
              >
                Schedule a Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <JaraBot />
    </div>
  );
};

export default ServiceDetailPage;
