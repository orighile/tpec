import { Link } from "react-router-dom";
import { 
  UserPlus, 
  ChartLineUp, 
  ShieldCheck, 
  Star, 
  Users, 
  CurrencyNgn,
  CheckCircle,
  ArrowRight
} from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";

const benefits = [
  {
    icon: Users,
    title: "Reach Thousands of Planners",
    description: "Get discovered by event planners actively searching for services like yours across Nigeria."
  },
  {
    icon: CurrencyNgn,
    title: "Free Listing",
    description: "Join our marketplace at no cost. No hidden fees, no commissions on your bookings."
  },
  {
    icon: ShieldCheck,
    title: "Verified Badge",
    description: "Build trust with a verification badge that shows clients you're a legitimate business."
  },
  {
    icon: ChartLineUp,
    title: "Analytics Dashboard",
    description: "Track your profile views, booking requests, and performance with detailed insights."
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Collect reviews from satisfied clients to boost your credibility and attract more business."
  },
  {
    icon: UserPlus,
    title: "Direct Bookings",
    description: "Receive booking requests directly. No middleman, you keep 100% of your earnings."
  }
];

const testimonials = [
  {
    name: "Adebayo Okonkwo",
    business: "Royal Catering Services",
    location: "Lagos",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote: "Since joining TPEC, my bookings have increased by 300%. The platform connects me with serious clients who are ready to pay for quality service.",
    rating: 5
  },
  {
    name: "Chioma Eze",
    business: "Elegant Decorations",
    location: "Abuja",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    quote: "TPEC has transformed my small decoration business into a thriving enterprise. I've worked on over 50 events in just 6 months!",
    rating: 5
  },
  {
    name: "Emeka Nwosu",
    business: "Rhythm Masters DJ",
    location: "Port Harcourt",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    quote: "The verified badge gives my clients confidence. I get more inquiries now than I can handle. Best decision I made for my DJ business.",
    rating: 5
  }
];

const successStories = [
  {
    title: "From Side Hustle to Full-Time Business",
    vendor: "Divine Cakes by Funke",
    story: "Funke started baking cakes from her kitchen as a hobby. After joining TPEC, she received so many orders that she opened her own bakery shop within 8 months.",
    metric: "₦2.5M+ in bookings",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
  },
  {
    title: "Expanding Across 3 States",
    vendor: "Moments Photography",
    story: "What started as wedding photography in Lagos has now expanded to Abuja and Port Harcourt, all thanks to the visibility TPEC provided.",
    metric: "200+ events covered",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop"
  }
];

const VendorBenefitsPage = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Vendor Benefits - Grow Your Event Business | TPEC"
        description="Join Nigeria's premier event marketplace. Free listing, verified badge, analytics dashboard, and direct bookings. Start growing your business today."
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-jara-gold via-amber-500 to-orange-500 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <UserPlus className="h-5 w-5 text-white" weight="bold" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">For Vendors</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Grow Your Event Business With TPEC
            </h1>
            
            <p className="text-white/95 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of vendors who have transformed their businesses by connecting with event planners across Nigeria.
            </p>
            
            <Button 
              size="lg"
              className="bg-white text-jara-gold hover:bg-white/90 text-lg font-bold py-6 px-10 shadow-lg"
              asChild
            >
              <Link to="/vendor-onboarding">
                <UserPlus className="mr-2 h-5 w-5" weight="bold" />
                Register Now — It's Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Vendors Love TPEC</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to grow your event services business, all in one platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-jara-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-jara-gold" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Vendors Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from vendors who have grown their businesses with TPEC.
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
                      <p className="text-sm text-gray-600">{testimonial.business}, {testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-jara-purple">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              See how TPEC has helped vendors transform their businesses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-xl overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.vendor}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <div className="inline-block bg-jara-gold/10 text-jara-gold text-sm font-bold px-3 py-1 rounded-full mb-3">
                    {story.metric}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-sm text-jara-purple font-medium mb-2">{story.vendor}</p>
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
              Get started in just 3 simple steps.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Register", desc: "Create your free vendor account" },
              { step: "2", title: "Set Up Profile", desc: "Add your services, photos & pricing" },
              { step: "3", title: "Get Bookings", desc: "Start receiving booking requests" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jara-gold text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
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
      <section className="py-16 bg-gradient-to-r from-jara-gold via-amber-500 to-jara-gold">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Join over 500+ vendors already thriving on TPEC. Registration is free and takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-jara-gold hover:bg-white/90 font-bold"
              asChild
            >
              <Link to="/vendor-onboarding">
                <UserPlus className="mr-2 h-5 w-5" weight="bold" />
                Register as a Vendor
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
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> Free listing</span>
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> No commission</span>
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> Verified badge</span>
            <span className="flex items-center gap-2"><CheckCircle weight="fill" /> Analytics dashboard</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorBenefitsPage;