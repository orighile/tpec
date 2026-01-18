
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does TPEC Events offer?",
    answer: "TPEC Events provides comprehensive event consulting services, including wedding planning, corporate event management, milestone celebrations, hybrid events, and online events. We offer end-to-end planning, day-of coordination, vendor management, and consultation services tailored to your specific needs."
  },
  {
    question: "How do I book a consultation with TPEC Events?",
    answer: "You can book a consultation through our online booking system on our website by clicking 'Book a Consultation'. Select your preferred consultation type, date, and time, and fill in your details. Our team will confirm your appointment via email."
  },
  {
    question: "What areas do you serve?",
    answer: "While we are based in Lagos, Nigeria, we provide event planning services throughout Nigeria and internationally. Our team has experience planning events across multiple countries and continents, and we're comfortable working with clients remotely."
  },
  {
    question: "How far in advance should I book your services?",
    answer: "For comprehensive planning services, we recommend booking 6-12 months in advance, especially for weddings and large corporate events. For day-of coordination or consultation services, 3-6 months is typically sufficient. However, we understand that sometimes events come together quickly, so please contact us regardless of your timeline."
  },
  {
    question: "How can vendors advertise their services on your platform?",
    answer: "Vendors can apply to be featured in our marketplace by completing the vendor application form on our website. Our team reviews all applications to ensure they meet our quality standards before being added to our platform. Featured vendor spots are also available for premium placement."
  },
  {
    question: "What types of events do you specialize in?",
    answer: "We specialize in a wide range of events, including weddings, corporate functions (conferences, galas, product launches), milestone celebrations (birthdays, anniversaries), hybrid events combining in-person and virtual elements, and fully online virtual events."
  },
  {
    question: "Do you offer partial planning services or consultations?",
    answer: "Yes, we understand that some clients may only need assistance with specific aspects of their event. We offer consultation services, partial planning packages, and day-of coordination options for clients who don't require full planning services."
  },
  {
    question: "What planning tools do you provide to clients?",
    answer: "Our clients gain access to our suite of planning tools, including budget calculators, customizable checklists, guest management systems, seating chart designers, vendor directories, and timeline creators. These tools are designed to streamline the planning process and keep everything organized."
  }
];

const FAQ = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Find answers to common questions about our event consulting services
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
