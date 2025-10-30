
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, DollarSign } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { VendorFormValues } from "../schema/vendorFormSchema";
import { priceRanges } from "@/data/vendors";

type LocationPriceFieldsProps = {
  form: UseFormReturn<VendorFormValues>;
};

const LocationPriceFields = ({ form }: LocationPriceFieldsProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Location & Pricing</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="City, State" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Range</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              <DollarSign className="absolute left-3 top-[38px] h-4 w-4 text-muted-foreground" />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default LocationPriceFields;
