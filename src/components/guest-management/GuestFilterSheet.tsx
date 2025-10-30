
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { guestGroups } from "./types";

interface GuestFilterSheetProps {
  filterGroup: string;
  onFilterGroupChange: (group: string) => void;
  guests: any[];
}

const GuestFilterSheet = ({
  filterGroup,
  onFilterGroupChange,
  guests,
}: GuestFilterSheetProps) => {
  return (
    <div>
      {/* Guest Filter Sheet - simplified for now */}
    </div>
  );
};

export default GuestFilterSheet;
