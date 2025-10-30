
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuestRsvpStatus } from "./types";

interface GuestListControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: GuestRsvpStatus | 'all';
  onFilterStatusChange: (status: GuestRsvpStatus | 'all') => void;
  totalGuests: number;
}

const GuestListControls = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  totalGuests,
}: GuestListControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <Tabs 
        value={filterStatus}
        onValueChange={(value) => onFilterStatusChange(value as GuestRsvpStatus | 'all')}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="all">All ({totalGuests})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default GuestListControls;
