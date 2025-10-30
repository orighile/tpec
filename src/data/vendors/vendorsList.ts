
import { Vendor } from "@/types/vendor";
import cateringImg from "@/assets/catering-image.jpg";
import venueImg from "@/assets/venue-image-1.jpg";
import decorationImg from "@/assets/decoration-image.jpg";
import djImg from "@/assets/dj-image.jpg";
import photographyImg from "@/assets/photography-image.jpg";
import cakeImg from "@/assets/cake-image.jpg";

// Sample vendors data with enhanced information
export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Signature Catering",
    category: "Catering",
    description: "Premium catering service specializing in Nigerian and continental cuisines for all event types.",
    imageUrl: cateringImg,
    location: "Lagos, Nigeria",
    priceRange: "₦₦₦",
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    availability: ["Weekdays", "Weekends", "Public Holidays"],
    specialties: ["Nigerian Cuisine", "Continental", "Finger Foods", "Desserts"],
    contactInfo: {
      email: "info@signaturecatering.com",
      phone: "+234 802 123 4567",
      website: "signaturecatering.com"
    },
    established: "2012",
    about: "Signature Catering takes pride in creating memorable dining experiences for events of all sizes. Our team of professional chefs and service staff are dedicated to excellence and creative presentation. We source only the freshest ingredients to ensure quality in every dish we serve."
  },
  {
    id: "v2",
    name: "EventSpace Plus",
    category: "Venue",
    description: "Luxurious event venues with state-of-the-art facilities for weddings, corporate events, and parties.",
    imageUrl: venueImg,
    location: "Abuja, Nigeria",
    priceRange: "₦₦₦₦",
    rating: 4.5,
    reviewCount: 98,
    verified: true,
    availability: ["Weekdays", "Weekends"],
    specialties: ["Indoor Halls", "Outdoor Gardens", "Rooftop", "Beachfront"],
    contactInfo: {
      email: "bookings@eventspaceplus.com",
      phone: "+234 905 678 1234",
      website: "eventspaceplus.com"
    },
    established: "2015",
    about: "EventSpace Plus offers stunning, versatile venues across Abuja that cater to a wide range of events. Our spaces combine elegant design with practical amenities, making them perfect for memorable occasions. Our experienced event managers provide support through every stage of planning and execution."
  },
  {
    id: "v3",
    name: "Perfect Decor",
    category: "Decoration",
    description: "Transforming ordinary spaces into extraordinary experiences with creative and elegant decorations.",
    imageUrl: decorationImg,
    location: "Port Harcourt, Nigeria",
    priceRange: "₦₦",
    rating: 4.6,
    reviewCount: 87,
    verified: true,
    availability: ["Weekdays", "Weekends"],
    specialties: ["Wedding Decor", "Corporate Branding", "Traditional Ceremonies", "Balloon Art"],
    contactInfo: {
      email: "hello@perfectdecor.com",
      phone: "+234 803 456 7890"
    },
    established: "2018",
    about: "Perfect Decor is known for creating stunning visual experiences through thoughtful and creative decoration. We work closely with our clients to understand their vision and bring it to life with attention to detail and artistic flair. No event is too small or too large for our dedicated team."
  },
  {
    id: "v4",
    name: "Rhythm DJs",
    category: "Entertainment",
    description: "Professional DJ services with the latest sound equipment and an extensive music library for all events.",
    imageUrl: djImg,
    location: "Lagos, Nigeria",
    priceRange: "₦₦",
    rating: 4.9,
    reviewCount: 156,
    verified: true,
    availability: ["Weekdays", "Weekends", "Public Holidays"],
    specialties: ["Wedding Reception", "Corporate Parties", "Club Events", "Traditional Ceremonies"],
    contactInfo: {
      email: "bookings@rhythmdjs.com",
      phone: "+234 701 234 5678",
      website: "rhythmdjs.com"
    },
    established: "2010",
    about: "Rhythm DJs has been setting the standard for entertainment in Lagos for over a decade. Our team of professional DJs knows how to read a crowd and create the perfect atmosphere for any event. We bring our own high-quality sound and lighting equipment to ensure a seamless experience."
  },
  {
    id: "v5",
    name: "Capture Memories",
    category: "Photography",
    description: "Professional photography and videography services capturing the most precious moments of your events.",
    imageUrl: photographyImg,
    location: "Kano, Nigeria",
    priceRange: "₦₦₦",
    rating: 4.7,
    reviewCount: 112,
    verified: false,
    availability: ["Weekends"],
    specialties: ["Wedding Photography", "Event Coverage", "Portrait Sessions", "Drone Footage"],
    contactInfo: {
      email: "shoot@capturememories.com",
      phone: "+234 808 765 4321",
      website: "capturememories.com"
    },
    established: "2019",
    about: "Capture Memories is a team of passionate photographers and videographers who specialize in documenting life's special moments. We believe in creating authentic, emotion-filled imagery that tells your unique story. Our modern approach combines journalistic style with artistic portraiture."
  },
  {
    id: "v6",
    name: "Divine Cakes",
    category: "Cakes & Desserts",
    description: "Delicious, custom-designed cakes and desserts for all occasions with a focus on quality and presentation.",
    imageUrl: cakeImg,
    location: "Lagos, Nigeria",
    priceRange: "₦₦",
    rating: 4.6,
    reviewCount: 93,
    verified: true,
    availability: ["Weekdays", "Weekends"],
    specialties: ["Wedding Cakes", "Birthday Cakes", "Cupcakes", "Dessert Tables"],
    contactInfo: {
      email: "orders@divinecakes.com",
      phone: "+234 809 876 5432"
    },
    established: "2017",
    about: "Divine Cakes creates beautiful, delicious custom cakes and desserts for all occasions. Each creation is made from scratch using premium ingredients. Our baker has formal training in both Nigerian and European pastry techniques, resulting in unique flavor combinations that delight the palate."
  }
];

export default vendors;
