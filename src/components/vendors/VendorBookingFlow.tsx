import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, MapPin, Users, Package, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import PaymentIntegration from '../payments/PaymentIntegration';
import { useVendorBookings } from '@/hooks/useVendorBookings';
import { useAuth } from '@/contexts/AuthContext';

interface VendorBookingFlowProps {
  vendor: {
    id: string;
    name: string;
    category: string;
    priceRange: string;
    location: string;
    imageUrl: string;
    services: string[];
    availability: string[];
  };
  onBookingComplete?: (bookingData: any) => void;
  onCancel?: () => void;
}

interface BookingDetails {
  eventDate: Date | undefined;
  eventTime: string;
  duration: string;
  location: string;
  guestCount: number;
  services: string[];
  specialRequests: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const VendorBookingFlow: React.FC<VendorBookingFlowProps> = ({
  vendor,
  onBookingComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    eventDate: undefined,
    eventTime: '',
    duration: '',
    location: '',
    guestCount: 0,
    services: [],
    specialRequests: '',
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { createVendorBooking } = useVendorBookings();

  const steps = [
    { number: 1, title: 'Event Details', description: 'Date, time, and location' },
    { number: 2, title: 'Services', description: 'Select required services' },
    { number: 3, title: 'Contact Info', description: 'Your contact details' },
    { number: 4, title: 'Review', description: 'Confirm booking details' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const durationOptions = [
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: '12 hours' },
    { value: '24', label: 'Full day' }
  ];

  const calculateTotal = () => {
    const basePrice = parseFloat(vendor.priceRange.replace(/[₦,]/g, ''));
    const serviceMultiplier = bookingDetails.services.length || 1;
    const durationHours = parseInt(bookingDetails.duration) || 4;
    const guestMultiplier = Math.max(1, Math.ceil(bookingDetails.guestCount / 50));
    
    return basePrice * serviceMultiplier * (durationHours / 4) * guestMultiplier;
  };

  const handleServiceToggle = (service: string) => {
    setBookingDetails(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!bookingDetails.eventDate || !bookingDetails.eventTime || !bookingDetails.location || !bookingDetails.duration) {
          toast({
            title: "Missing Information",
            description: "Please fill in all event details",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (bookingDetails.services.length === 0) {
          toast({
            title: "No Services Selected",
            description: "Please select at least one service",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (!bookingDetails.customerInfo.name || !bookingDetails.customerInfo.email || !bookingDetails.customerInfo.phone) {
          toast({
            title: "Missing Contact Info",
            description: "Please fill in all contact details",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowPayment(true);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your booking",
        variant: "destructive"
      });
      return;
    }

    try {
      const bookingFormData = {
        vendor_id: vendor.id,
        amount: calculateTotal(),
        currency: 'NGN',
        notes: bookingDetails.specialRequests,
        booking_details: {
          event_date: bookingDetails.eventDate?.toISOString() || '',
          event_time: bookingDetails.eventTime,
          duration: bookingDetails.duration,
          location: bookingDetails.location,
          guest_count: bookingDetails.guestCount,
          services: bookingDetails.services,
          special_requests: bookingDetails.specialRequests,
          customer_info: bookingDetails.customerInfo,
        }
      };

      const booking = await createVendorBooking.mutateAsync(bookingFormData);
      
      const completeBooking = {
        ...bookingDetails,
        vendor,
        totalAmount: calculateTotal(),
        paymentData,
        bookingId: booking.id,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      onBookingComplete?.(completeBooking);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking with ${vendor.name} has been saved to the database`,
      });
    } catch (error) {
      console.error('Booking save error:', error);
      toast({
        title: "Booking Error",
        description: "Payment was successful but there was an error saving your booking. Please contact support.",
        variant: "destructive"
      });
    }
  };

  if (showPayment) {
    return (
      <PaymentIntegration
        amount={calculateTotal()}
        description={`Booking ${vendor.name} for ${format(bookingDetails.eventDate!, 'MMM dd, yyyy')}`}
        vendorId={vendor.id}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={(error) => {
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive"
          });
          setShowPayment(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep >= step.number 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {step.number}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground">{step.description}</div>
            </div>
            {step.number < steps.length && (
              <div className={`
                w-16 h-0.5 mx-4
                ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Vendor Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img 
              src={vendor.imageUrl} 
              alt={vendor.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground">{vendor.category}</p>
              <Badge variant="outline">{vendor.priceRange}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Step 1: Event Details */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingDetails.eventDate ? format(bookingDetails.eventDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bookingDetails.eventDate}
                        onSelect={(date) => setBookingDetails({...bookingDetails, eventDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={bookingDetails.eventTime} onValueChange={(time) => setBookingDetails({...bookingDetails, eventTime: time})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={bookingDetails.duration} onValueChange={(duration) => setBookingDetails({...bookingDetails, duration})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Expected Guests</Label>
                  <Input
                    type="number"
                    placeholder="Number of guests"
                    value={bookingDetails.guestCount || ''}
                    onChange={(e) => setBookingDetails({...bookingDetails, guestCount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Event Location</Label>
                <Input
                  placeholder="Event venue or address"
                  value={bookingDetails.location}
                  onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})}
                />
              </div>
            </>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vendor.services.map(service => (
                  <div
                    key={service}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-colors
                      ${bookingDetails.services.includes(service)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                      }
                    `}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{service}</span>
                      {bookingDetails.services.includes(service) && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Special Requests</Label>
                <Textarea
                  placeholder="Any special requirements or requests..."
                  value={bookingDetails.specialRequests}
                  onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})}
                />
              </div>
            </>
          )}

          {/* Step 3: Contact Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Your full name"
                  value={bookingDetails.customerInfo.name}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    customerInfo: {...bookingDetails.customerInfo, name: e.target.value}
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={bookingDetails.customerInfo.email}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    customerInfo: {...bookingDetails.customerInfo, email: e.target.value}
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+234 800 000 0000"
                  value={bookingDetails.customerInfo.phone}
                  onChange={(e) => setBookingDetails({
                    ...bookingDetails,
                    customerInfo: {...bookingDetails.customerInfo, phone: e.target.value}
                  })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {bookingDetails.eventDate && format(bookingDetails.eventDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {bookingDetails.eventTime} ({bookingDetails.duration}h)
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {bookingDetails.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {bookingDetails.guestCount} guests
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Services</h4>
                  <div className="space-y-1">
                    {bookingDetails.services.map(service => (
                      <div key={service} className="flex items-center gap-2 text-sm">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          <Button onClick={nextStep}>
            {currentStep < steps.length ? 'Next' : 'Proceed to Payment'}
            {currentStep === steps.length && <CreditCard className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorBookingFlow;
