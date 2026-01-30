import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quotes, Star } from "phosphor-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import avatar images
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

const testimonials = [
  {
    id: 1,
    name: "Ada Okonkwo",
    role: "Lagos Bride 2025",
    location: "Lagos",
    quote: "TPEC made finding a reliable DJ stress-free! Booked in 2 days.",
    avatar: avatar1,
    rating: 5,
  },
  {
    id: 2,
    name: "Emeka Nwachukwu",
    role: "Groom, January 2026",
    location: "Abuja",
    quote: "The vendor marketplace saved us weeks of research. Found our caterer and photographer in one evening.",
    avatar: avatar2,
    rating: 5,
  },
  {
    id: 3,
    name: "Blessing Okafor",
    role: "Birthday Planner",
    location: "Benin City",
    quote: "Chief AI gave me budget tips I never thought of. Saved over 30% on decorations!",
    avatar: avatar3,
    rating: 5,
  },
  {
    id: 4,
    name: "Chidi Eze",
    role: "Event Coordinator",
    location: "Ibadan",
    quote: "As a first-time event planner, the checklist feature kept me on track. Our corporate launch was flawless.",
    avatar: avatar4,
    rating: 5,
  },
  {
    id: 5,
    name: "Ngozi Adebayo",
    role: "Traditional Wedding",
    location: "Edo State",
    quote: "I found three amazing vendors from my village in Edo State. TPEC truly covers Nigeria.",
    avatar: avatar1,
    rating: 5,
  },
  {
    id: 6,
    name: "Kunle Fashola",
    role: "Wedding Host",
    location: "Lagos",
    quote: "The seating chart tool made our 400-guest owambe seamless. No confusion at all!",
    avatar: avatar2,
    rating: 5,
  },
];

const TestimonialsCarousel = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Are Saying
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from event planners and couples who found success with TPEC
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full bg-card border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quotes className="h-8 w-8 text-primary/30 mb-4" weight="fill" />
                    
                    <p className="text-foreground/90 mb-6 flex-grow italic">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-500"
                          weight="fill"
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
