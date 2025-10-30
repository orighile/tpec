
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Mail } from "lucide-react";
import { Guest } from "./types";

interface GuestTableProps {
  guests: Guest[];
  selectedGuests: string[];
  onSelectGuests: (selected: string[]) => void;
  onEditGuest: (guest: Guest) => void;
  onRemoveGuest: (id: string) => void;
}

const GuestTable = ({
  guests,
  selectedGuests,
  onSelectGuests,
  onEditGuest,
  onRemoveGuest,
}: GuestTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>RSVP Status</TableHead>
            <TableHead>Meal</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.length > 0 ? (
            guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{guest.full_name}</div>
                    <div className="text-sm text-gray-500">{guest.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{guest.guest_group || "None"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      guest.rsvp_status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : guest.rsvp_status === "declined"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {guest.rsvp_status.charAt(0).toUpperCase() + guest.rsvp_status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{guest.meal_preference || "Not Selected"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditGuest(guest)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => onRemoveGuest(guest.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No guests found. Add some guests to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestTable;
