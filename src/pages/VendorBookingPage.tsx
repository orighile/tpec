import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VendorBookingFlow from '@/components/vendors/VendorBookingFlow';
import { vendors } from '@/data/vendors/vendorsList';

const VendorBookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vendor = vendors.find(v => v.id === `v${id}`);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
          <p className="text-muted-foreground mb-6">The vendor you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/vendors')}>
            Browse All Vendors
          </Button>
        </div>
      </div>
    );
  }

  // Transform vendor data to match VendorBookingFlow interface
  const bookingVendor = {
    id: vendor.id,
    name: vendor.name,
    category: vendor.category,
    priceRange: vendor.priceRange,
    location: vendor.location,
    imageUrl: vendor.imageUrl,
    services: vendor.specialties,
    availability: vendor.availability
  };

  const handleBookingComplete = (bookingData: any) => {
    // Navigate to a success page or show confirmation
    navigate('/vendors', { 
      replace: true,
      state: { 
        message: `Booking confirmed with ${vendor.name}!`,
        bookingId: bookingData.bookingId 
      }
    });
  };

  const handleCancel = () => {
    navigate(`/vendors/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/vendors/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendor Details
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Book {vendor.name}</h1>
            <p className="text-muted-foreground">
              Complete your booking in a few simple steps
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <VendorBookingFlow
            vendor={bookingVendor}
            onBookingComplete={handleBookingComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorBookingPage;