import { Link } from "react-router-dom";
import { 
  Sparkle, 
  CalendarCheck, 
  Users, 
  CurrencyNgn,
  ListChecks,
  Robot,
  Envelope,
  Star,
  CheckCircle,
  ArrowRight
} from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";

const tools = [
  {
    icon: CurrencyNgn,
    title: "Budget Calculator",
    description: "Track expenses, set budgets, and stay on top of your event finances with ease.",
    link: "/budget"
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Manage RSVPs, dietary requirements, and seating arrangements all in one place.",
    link: "/guests"
  },
  {
    icon: ListChecks,
    title: "Event Checklist",
    description: "Never miss a task with customizable checklists for every type of Nigerian event.",
    link: "/checklist"
  },
  {
    icon: Robot,
    title: "Chief AI Assistant",
    description: "Get instant answers and recommendations from our Nigerian event expert AI.",
    link: "/chief"
  },
  {
    icon: Envelope,
    title: "Digital Invitations",
    description: "Create beautiful, culturally-themed invitations and send them digitally.",
    link: "/planning-tools/invitations"
  },
  {
    icon: CalendarCheck,
    title: "Vendor Booking",
    description: "Find and book verified vendors for catering, decoration, photography, and more.",
    link: "/vendors/marketplace"
  }
];

const testimonials = [
  {
    name: "Ngozi Adeyemi",
    event: "Traditional Wedding",
    location: "Lagos",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    quote: "TPEC made planning my Igbo traditional wedding so easy! The checklist feature ensured I didn't forget any cultural details. My guests are still talking about how perfect everything was.",
    rating: 5
  },
  {
    name: "Tunde Bakare",
    event: "Corporate Event",
    location: "Abuja",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    quote: "We used TPEC to plan our company's 10th anniversary. The budget tool helped us stay within limits while the vendor marketplace connected us with amazing caterers.",
    rating: 5
  },
  {
    name: "Amara Okafor",
    event: "Birthday Party",
    location: "Port Harcourt",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    quote: "Chief suggested the perfect owambe theme for my 40th birthday! The guest management feature made tracking 200+ RSVPs a breeze. Highly recommend!",
    rating: 5
  }
];

const successStories = [
  {
    title: "Dream Wedding Under Budget",
    planner: "The Adeyinka Family",
    story: "Planning a 500-guest wedding seemed impossible until they discovered TPEC. Using our budget calculator and vendor comparison tools, they saved over ₦800,000 while creating their dream celebration.",
    metric: "₦800K saved",
    guests: "500 guests",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
  },
  {
    title: "Perfect Naming Ceremony",
    planner: "The Okonkwo Family",
    story: "First-time parents used TPEC's checklist feature to plan their baby's naming ceremony. Chief provided cultural insights on Yoruba naming traditions they had almost forgotten.",
    metric: "Zero stress",
    guests: "150 guests",
    image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=300&fit=crop"
  }
];

const stats = [
  { number: "10,000+", label: "Events Planned" },
  { number: "₦2B+", label: "Budgets Managed" },
  { number: "500+", label: "Verified Vendors" },
  { number: "98%", label: "Happy Planners" }
];

const PlannerBenefitsPage = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Planning Tools Benefits - Plan Your Perfect Event | TPEC"
        description="Discover powerful event planning tools designed for Nigerian celebrations. Budget calculator, guest management, AI assistant, and more. Start planning today!"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-jara-purple via-purple-700 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkle className="h-5 w-5 text-jara-gold" weight="bold" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">For Event Planners</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Plan Your Perfect Nigerian Event
            </h1>
            
            <p className="text-white/95 text-xl mb-8 max-w-2xl mx-auto">
              From traditional ceremonies to modern celebrations, our culturally-aware tools make event planning simple, collaborative, and truly Nigerian.
            </p>
            
            <Button 
              size="lg"
              className="bg-jara-gold hover:bg-amber-500 text-white text-lg font-bold py-6 px-10 shadow-lg"
              asChild
            >
              <Link to="/planning-tools">
                <Sparkle className="mr-2 h-5 w-5" weight="bold" />
                Start Planning — It's Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-jara-purple">{stat.number}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Planning Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan any Nigerian event, from weddings to corporate functions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Link to={tool.link} key={index}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-jara-purple/10 rounded-xl flex items-center justify-center mb-4">
                      <tool.icon className="h-6 w-6 text-jara-purple" weight="duotone" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Planners Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from people who planned unforgettable events with TPEC.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-jara-gold" weight="fill" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.event}, {testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-jara-gold">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              See how TPEC has helped families create memorable celebrations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-xl overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.planner}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex gap-3 mb-3">
                    <span className="bg-jara-purple/10 text-jara-purple text-sm font-bold px-3 py-1 rounded-full">
                      {story.metric}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                      {story.guests}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-sm text-jara-purple font-medium mb-2">{story.planner}</p>
                  <p className="text-gray-600">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start planning your event in just 3 simple steps.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Choose Your Event", desc: "Select your event type and date" },
              { step: "2", title: "Use Our Tools", desc: "Budget, checklist, guest management" },
              { step: "3", title: "Book Vendors", desc: "Find and book verified vendors" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jara-purple text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {index < 2 && (
                  <ArrowRight className="hidden md:block h-6 w-6 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-jara-purple via-purple-700 to-jara-purple">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Plan Your Event?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of Nigerians who have planned successful events with TPEC. It's completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-jara-gold hover:bg-amber-500 text-white font-bold"
              asChild
            >
              <Link to="/planning-tools">
                <Sparkle className="mr-2 h-5 w-5" weight="bold" />
                Start Planning Now
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/vendors/marketplace">
                Browse Vendors
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/90 text-sm">
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> 100% Free</span>
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> No signup required</span>
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> Nigerian-focused</span>
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> AI-powered</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlannerBenefitsPage;