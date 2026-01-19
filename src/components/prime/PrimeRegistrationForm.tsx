import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Crown } from "lucide-react";
import { PrimeMembershipType, CreatePrimeMemberData } from "@/hooks/usePrimeMembership";

interface PrimeRegistrationFormProps {
  membershipType: PrimeMembershipType;
  onSubmit: (data: CreatePrimeMemberData) => Promise<any>;
  isSubmitting?: boolean;
}

const VENDOR_CATEGORIES = [
  "Catering",
  "Photography",
  "Videography",
  "DJ & Music",
  "Decoration",
  "Cakes & Pastries",
  "Fashion & Attire",
  "Makeup & Beauty",
  "Event Rentals",
  "Transportation",
  "MC & Entertainment",
  "Other",
];

const PLANNER_CATEGORIES = [
  "Wedding Planner",
  "Corporate Events",
  "Birthday & Parties",
  "Traditional Ceremonies",
  "Full-Service Planning",
  "Day-of Coordinator",
  "Destination Events",
  "Other",
];

const LOCATIONS = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Calabar",
  "Benin City",
  "Warri",
  "Owerri",
  "Other",
];

const PRICE_RANGES = [
  "₦50,000 - ₦200,000",
  "₦200,000 - ₦500,000",
  "₦500,000 - ₦1,000,000",
  "₦1,000,000 - ₦5,000,000",
  "₦5,000,000+",
];

export const PrimeRegistrationForm = ({
  membershipType,
  onSubmit,
  isSubmitting = false,
}: PrimeRegistrationFormProps) => {
  const [formData, setFormData] = useState<CreatePrimeMemberData>({
    membership_type: membershipType,
    business_name: "",
    business_description: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    location: "",
    category: "",
    services: [],
    price_range: "",
  });

  const [servicesInput, setServicesInput] = useState("");

  const categories = membershipType === "vendor" ? VENDOR_CATEGORIES : PLANNER_CATEGORIES;
  const typeLabel = membershipType === "vendor" ? "Vendor" : "Planner";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name.trim()) return;

    const services = servicesInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    await onSubmit({
      ...formData,
      services,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Join Prime {typeLabel}s</CardTitle>
        <CardDescription>
          Get featured in our marketplace and reach thousands of event planners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, business_name: e.target.value }))
              }
              placeholder={`Your ${membershipType === "vendor" ? "vendor" : "planning"} business name`}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={formData.business_description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, business_description: e.target.value }))
              }
              placeholder="Tell potential clients about your business..."
              rows={4}
            />
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contact_email: e.target.value }))
                }
                placeholder="business@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))
                }
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
          </div>

          {/* Location & Price Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, location: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_range">Price Range</Label>
              <Select
                value={formData.price_range}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, price_range: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
              placeholder="https://yourbusiness.com"
            />
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label htmlFor="services">Services (comma separated)</Label>
            <Input
              id="services"
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              placeholder="e.g. Wedding Photography, Portrait Sessions, Event Coverage"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !formData.business_name.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Join Prime {typeLabel}s
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
