
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { vendorFormSchema, VendorFormValues } from "./schema/vendorFormSchema";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

// Import form section components
import FormHeader from "./forms/FormHeader";
import BusinessInfoFields from "./forms/BusinessInfoFields";
import LocationPriceFields from "./forms/LocationPriceFields";
import ContactInfoFields from "./forms/ContactInfoFields";
import BusinessDetailsFields from "./forms/BusinessDetailsFields";
import TermsCheckbox from "./forms/TermsCheckbox";
import SubmitButton from "./forms/SubmitButton";

const VendorRegistrationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      location: "",
      priceRange: "",
      email: user?.email || "",
      phone: "",
      website: "",
      specialties: "",
      about: "",
      established: "",
      termsAccepted: false,
    },
  });

  function onSubmit(data: VendorFormValues) {
    setIsSubmitting(true);

    // In a real app, this would be a database call
    // For now, we'll simulate a registration process
    setTimeout(() => {
      // Create vendor object with form data
      const newVendor = {
        id: uuidv4(),
        name: data.name,
        category: data.category,
        description: data.description,
        imageUrl: "/placeholder.svg", // Default placeholder image
        location: data.location,
        priceRange: data.priceRange,
        rating: 0,
        reviewCount: 0,
        verified: false,
        availability: ["Weekdays", "Weekends"],
        specialties: data.specialties.split(",").map(s => s.trim()),
        contactInfo: {
          email: data.email,
          phone: data.phone,
          website: data.website || undefined,
        },
        established: data.established || undefined,
        about: data.about,
        userId: user?.id, // Link vendor to user account
      };

      console.log("Vendor registration data:", newVendor);
      
      // Show success message
      toast({
        title: "Registration submitted",
        description: "Your vendor registration is being reviewed. We'll notify you once approved.",
      });

      setIsSubmitting(false);
      navigate("/vendors");
    }, 1500);
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
      <FormHeader />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BusinessInfoFields form={form} />
          
          <LocationPriceFields form={form} />

          <div className="border-t border-gray-200 pt-6">
            <ContactInfoFields form={form} />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <BusinessDetailsFields form={form} />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <TermsCheckbox form={form} />
          </div>

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default VendorRegistrationForm;
