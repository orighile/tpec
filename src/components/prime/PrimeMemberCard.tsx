import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ExternalLink, Crown, Star } from "lucide-react";
import { PrimeMember } from "@/hooks/usePrimeMembership";

interface PrimeMemberCardProps {
  member: PrimeMember;
  onClick?: () => void;
}

export const PrimeMemberCard = ({ member, onClick }: PrimeMemberCardProps) => {
  return (
    <Card
      className="tpec-card overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20">
        {member.cover_image_url ? (
          <img
            src={member.cover_image_url}
            alt={member.business_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Crown className="h-12 w-12 text-primary/30" />
          </div>
        )}
        {member.is_featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}
        <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">
          Prime {member.membership_type === "vendor" ? "Vendor" : "Planner"}
        </Badge>
      </div>

      <CardContent className="p-5 relative">
        {/* Logo */}
        <div className="absolute -top-8 left-5">
          <div className="w-16 h-16 rounded-xl bg-background border-4 border-background shadow-lg overflow-hidden">
            {member.logo_url ? (
              <img
                src={member.logo_url}
                alt={`${member.business_name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Crown className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-8">
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
            {member.business_name}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {member.category && (
              <Badge variant="secondary" className="text-xs">
                {member.category}
              </Badge>
            )}
            {member.price_range && (
              <span className="text-xs text-muted-foreground">
                {member.price_range}
              </span>
            )}
          </div>

          {member.business_description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {member.business_description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            {member.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {member.location}
              </span>
            )}
          </div>

          {/* Contact buttons */}
          <div className="flex gap-2">
            {member.contact_phone && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${member.contact_phone}`);
                }}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
            {member.contact_email && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`mailto:${member.contact_email}`);
                }}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            )}
            {member.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(member.website!, "_blank");
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
