
import { 
  Heart, 
  Building2, 
  PartyPopper, 
  Laptop, 
  Users, 
  CalendarClock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const services = [
  {
    icon: Heart,
    title: "Wedding Planning",
    description: "From intimate ceremonies to grand celebrations, we provide comprehensive wedding planning services tailored to your vision.",
    features: ["Venue Selection", "Vendor Coordination", "Timeline Creation", "Day-of Coordination"],
    learnMoreLink: "/services/wedding-planning"
  },
  {
    icon: PartyPopper,
    title: "Milestone Celebrations",
    description: "Make your special moments memorable with our expertly planned birthday parties, anniversaries, and other milestone events.",
    features: ["Theme Development", "Entertainment Booking", "Decor Design", "Full-Service Planning"],
    learnMoreLink: "/services/celebrations"
  },
  {
    icon: Building2,
    title: "Corporate Events",
    description: "Elevate your company events with our professional corporate event planning services for conferences, galas, and team building.",
    features: ["Venue Sourcing", "Speaker Management", "Catering Coordination", "Branding Integration"],
    learnMoreLink: "/services/corporate"
  },
  {
    icon: Laptop,
    title: "Hybrid Events",
    description: "Combine in-person and virtual experiences with our hybrid event solutions for maximum reach and engagement.",
    features: ["Technology Integration", "Live Streaming", "Virtual Engagement", "Hybrid Logistics"],
    learnMoreLink: "/services/hybrid-events"
  },
  {
    icon: Users,
    title: "Online Events",
    description: "Engage your audience with professionally produced virtual events that deliver impact regardless of location.",
    features: ["Platform Selection", "Digital Production", "Virtual Networking", "Technical Support"],
    learnMoreLink: "/services/online-events"
  },
  {
    icon: CalendarClock,
    title: "Consultation Services",
    description: "Get expert advice and strategic planning guidance for your self-managed events through our consultation services.",
    features: ["Planning Strategy", "Vendor Recommendations", "Budget Optimization", "Timeline Creation"],
    learnMoreLink: "/services/consultation"
  }
];

const Services = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Event Consulting Services</h2>
          <p className="text-gray-600">
            Professional event planning and management services to bring your vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="tpec-card p-6 flex flex-col h-full">
              <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-5">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              
              <p className="text-gray-600 mb-5">
                {service.description}
              </p>
              
              <div className="mb-6 flex-grow">
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-auto" asChild>
                <Link to={service.learnMoreLink}>
                  Learn More
                </Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/book-consultation")}
          >
            Book a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
