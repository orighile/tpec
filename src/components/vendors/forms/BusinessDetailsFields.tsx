
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { VendorFormValues } from "../schema/vendorFormSchema";

type BusinessDetailsFieldsProps = {
  form: UseFormReturn<VendorFormValues>;
};

const BusinessDetailsFields = ({ form }: BusinessDetailsFieldsProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Business Details</h3>
      
      <FormField
        control={form.control}
        name="specialties"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialties</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter specialties separated by commas (e.g., Wedding Cakes, Birthday Cakes)" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Your Business</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell potential clients about your business, experience, and what makes you unique" 
                  className="h-32 resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="established"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Established (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2015" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BusinessDetailsFields;
