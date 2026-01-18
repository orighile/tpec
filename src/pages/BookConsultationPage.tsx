import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Users, Calendar, Briefcase, CheckCircle } from "lucide-react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import BookingForm from "@/components/booking/BookingForm";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import { useConsultationBooking, ConsultationBooking } from "@/hooks/useConsultationBooking";
import { SEO } from "@/components/SEO";

type ConsultationType = "meet-and-greet" | "event-planning" | "vendor-consultation";

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: "Choose Type" },
  { number: 2, title: "Select Date & Time" },
  { number: 3, title: "Your Details" },
  { number: 4, title: "Confirmation" },
];

const consultationTypes = [
  {
    id: "meet-and-greet" as ConsultationType,
    title: "Meet & Greet",
    description: "A 30-minute introductory call to discuss your event vision and how we can help.",
    icon: Users,
    duration: "30 minutes",
  },
  {
    id: "event-planning" as ConsultationType,
    title: "Event Planning",
    description: "A detailed consultation to plan your event, discuss requirements, and create a roadmap.",
    icon: Calendar,
    duration: "45 minutes",
  },
  {
    id: "vendor-consultation" as ConsultationType,
    title: "Vendor Consultation",
    description: "Get expert recommendations on vendors, venues, and services for your event.",
    icon: Briefcase,
    duration: "30 minutes",
  },
];

const BookConsultationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  const { isLoading, createBooking } = useConsultationBooking();

  const handleTypeSelect = (type: ConsultationType) => {
    setConsultationType(type);
    setCurrentStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinueToForm = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep(3);
    }
  };

  const handleFormSubmit = async (formData: {
    name: string;
    email: string;
    phone?: string;
    event_type?: string;
    message?: string;
  }) => {
    if (!selectedDate || !selectedTime || !consultationType) return;

    const booking = await createBooking({
      ...formData,
      booking_date: selectedDate,
      booking_time: selectedTime,
      consultation_type: consultationType,
    });

    if (booking) {
      setConfirmedBooking(booking);
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Book a Consultation | TPEC Events"
        description="Schedule a free consultation with TPEC Events to discuss your event planning needs."
      />
      <Navbar />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Book a Consultation
            </h1>
            <p className="text-muted-foreground text-lg">
              Schedule a free consultation with our event planning experts
            </p>
          </div>

          {/* Progress */}
          {currentStep < 4 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center gap-2 text-sm ${
                      step.number === currentStep
                        ? "text-primary font-medium"
                        : step.number < currentStep
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          step.number === currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                ))}
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Choose Consultation Type"}
                {currentStep === 2 && "Select Date & Time"}
                {currentStep === 3 && "Enter Your Details"}
                {currentStep === 4 && ""}
              </CardTitle>
              {currentStep < 4 && (
                <CardDescription>
                  {currentStep === 1 &&
                    "Select the type of consultation that best fits your needs"}
                  {currentStep === 2 &&
                    "Choose your preferred date and time for the consultation"}
                  {currentStep === 3 &&
                    "Fill in your contact information to complete the booking"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Step 1: Choose Type */}
              {currentStep === 1 && (
                <div className="grid gap-4 md:grid-cols-3">
                  {consultationTypes.map((type) => (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                        consultationType === type.id
                          ? "border-primary ring-2 ring-primary/20"
                          : ""
                      }`}
                      onClick={() => handleTypeSelect(type.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <type.icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-2">{type.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {type.description}
                          </p>
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {type.duration}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-3">Select a Date</h3>
                      <BookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                      />
                    </div>
                    
                    <div>
                      {selectedDate ? (
                        <TimeSlotPicker
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          onTimeSelect={handleTimeSelect}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Please select a date first</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleContinueToForm}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Form */}
              {currentStep === 3 && (
                <BookingForm
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                  onBack={handleBack}
                />
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && confirmedBooking && (
                <BookingConfirmation booking={confirmedBooking} />
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          {currentStep < 4 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Need help? Contact us at{" "}
                <a
                  href="mailto:info@tpecflowers.com"
                  className="text-primary hover:underline"
                >
                  info@tpecflowers.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+2349053065636"
                  className="text-primary hover:underline"
                >
                  +234 9053065636
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookConsultationPage;
