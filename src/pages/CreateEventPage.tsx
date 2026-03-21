
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, MapPin, UsersIcon, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const eventCategories = [
  { id: "conference", name: "Conference" },
  { id: "wedding", name: "Wedding" },
  { id: "birthday", name: "Birthday" },
  { id: "corporate", name: "Corporate" },
  { id: "cultural", name: "Cultural" },
  { id: "entertainment", name: "Entertainment" },
  { id: "expo", name: "Expo" },
  { id: "fashion", name: "Fashion" },
  { id: "food", name: "Food & Drinks" },
  { id: "music", name: "Music" },
  { id: "networking", name: "Networking" },
  { id: "sports", name: "Sports" },
  { id: "tech", name: "Technology" },
  { id: "workshop", name: "Workshop" },
  { id: "other", name: "Other" },
];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.date({
    required_error: "Event date is required",
  }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .max(10000, "Capacity cannot exceed 10,000"),
  category: z.string({
    required_error: "Please select a category",
  }),
});

type EventFormValues = z.infer<typeof formSchema>;

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      capacity: undefined,
      category: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const onSubmit = (data: EventFormValues) => {
    if (!imageFile) {
      toast.error("Please upload an event image");
      return;
    }

    // Combine form data with image for submission
    const eventData = {
      ...data,
      image: imageFile,
    };

    console.log("Submit event data:", eventData);
    
    // Show success toast and redirect
    toast.success("Event created successfully!");
    setTimeout(() => navigate("/events"), 1500);
  };

  return (
    <main className="flex-1 py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Event</h1>
            <p className="text-muted-foreground">
              Fill out the details below to create your Nigerian event
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-sm p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Event Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Create a catchy and descriptive title for your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your event, including highlights and what attendees can expect"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select event date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Choose the date when your event will take place
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate a-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Enter event location or venue"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Provide the full address or venue name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Capacity */}
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Capacity</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            placeholder="Maximum number of attendees"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set the maximum number of people who can attend
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eventCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the category that best describes your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <div className="space-y-3">
                  <FormLabel htmlFor="image">Event Image</FormLabel>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 transition-colors hover:border-muted-foreground">
                    {!imagePreview ? (
                      <div className="text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none hover:text-primary/80"
                          >
                            <span>Upload an image</span>
                            <input
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="mx-auto max-h-64 rounded-md object-contain"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 rounded-full bg-background p-1 shadow-md hover:bg-muted"
                        >
                          <X className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Upload a high-quality image for your event. This will be shown in event listings.
                  </FormDescription>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 py-6 h-auto text-lg"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </Form>
        </div>
      </div>
    </main>
  );
};

export default CreateEventPage;
