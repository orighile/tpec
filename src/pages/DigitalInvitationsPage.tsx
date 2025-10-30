import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, Share2, Palette, Calendar, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const invitationTemplates = [
  {
    id: "elegant-gold",
    name: "Elegant Gold",
    description: "Classic gold design perfect for weddings and formal events",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Wedding",
    color: "#D4AF37"
  },
  {
    id: "modern-corporate",
    name: "Modern Corporate",
    description: "Clean, professional design for business events",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Corporate",
    color: "#2563EB"
  },
  {
    id: "colorful-birthday",
    name: "Colorful Celebration",
    description: "Vibrant design perfect for birthdays and parties",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Birthday",
    color: "#EC4899"
  },
  {
    id: "cultural-african",
    name: "African Heritage",
    description: "Beautiful traditional African patterns and colors",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Cultural",
    color: "#059669"
  }
];

const DigitalInvitationsPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(invitationTemplates[0]);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    hostName: "",
    rsvpEmail: "",
    additionalInfo: ""
  });
  const { toast } = useToast();

  const handleCreateInvitation = () => {
    if (!eventDetails.title || !eventDetails.date || !eventDetails.venue) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the event title, date, and venue.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Invitation Created!",
      description: "Your digital invitation has been generated and is ready to share."
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Share via WhatsApp, Email, or Social Media"
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your invitation is being downloaded as PNG/PDF."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Digital Invitations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create beautiful, customizable digital invitations for your Nigerian events
            </p>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Template Selection */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Choose a Template</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {invitationTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate.id === template.id 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-3">
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <h3 className="font-medium text-sm">{template.name}</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {template.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="mr-2 h-5 w-5" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="relative h-64 rounded-lg p-6 text-white flex flex-col justify-center"
                      style={{ 
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${selectedTemplate.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <h3 className="text-xl font-bold mb-2">
                        {eventDetails.title || "Your Event Title"}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {eventDetails.date || "Event Date"}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {eventDetails.time || "Event Time"}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {eventDetails.venue || "Event Venue"}
                        </div>
                      </div>
                      {eventDetails.hostName && (
                        <p className="mt-3 text-xs">Hosted by {eventDetails.hostName}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Details Form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Event Details</h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Sarah & John's Wedding"
                        value={eventDetails.title}
                        onChange={(e) => setEventDetails(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Event Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your event"
                        value={eventDetails.description}
                        onChange={(e) => setEventDetails(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={eventDetails.date}
                          onChange={(e) => setEventDetails(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={eventDetails.time}
                          onChange={(e) => setEventDetails(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        placeholder="e.g., Lagos Continental Hotel, Victoria Island"
                        value={eventDetails.venue}
                        onChange={(e) => setEventDetails(prev => ({ ...prev, venue: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hostName">Host Name</Label>
                      <Input
                        id="hostName"
                        placeholder="Your name or organization"
                        value={eventDetails.hostName}
                        onChange={(e) => setEventDetails(prev => ({ ...prev, hostName: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="rsvpEmail">RSVP Email</Label>
                      <Input
                        id="rsvpEmail"
                        type="email"
                        placeholder="rsvp@yourevent.com"
                        value={eventDetails.rsvpEmail}
                        onChange={(e) => setEventDetails(prev => ({ ...prev, rsvpEmail: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Dress code, special instructions, etc."
                        value={eventDetails.additionalInfo}
                        onChange={(e) => setEventDetails(prev => ({ ...prev, additionalInfo: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleCreateInvitation} className="flex-1">
                        Create Invitation
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        Email & WhatsApp sharing
                      </li>
                      <li className="flex items-center">
                        <Download className="h-4 w-4 mr-2 text-primary" />
                        High-quality PNG/PDF downloads
                      </li>
                      <li className="flex items-center">
                        <Palette className="h-4 w-4 mr-2 text-primary" />
                        Cultural Nigerian themes
                      </li>
                      <li className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        RSVP tracking integration
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DigitalInvitationsPage;