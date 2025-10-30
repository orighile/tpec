
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { guestGroups } from "./types";
import { useState } from "react";

interface NewGuestForm {
  full_name: string;
  email: string;
  phone: string;
  rsvp_status: "pending" | "confirmed" | "declined";
  meal_preference: string;
  guest_group: string;
  table_assignment: string | null;
  plus_one: boolean;
  notes: string;
  event_id: string;
}

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewGuestForm) => void;
}

const AddGuestDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AddGuestDialogProps) => {
  const [newGuest, setNewGuest] = useState<NewGuestForm>({
    full_name: "",
    email: "",
    phone: "",
    rsvp_status: "pending",
    meal_preference: "",
    guest_group: "",
    table_assignment: "",
    plus_one: false,
    notes: "",
    event_id: "",
  });

  const handleSubmit = () => {
    onSubmit(newGuest);
    setNewGuest({
      full_name: "",
      email: "",
      phone: "",
      rsvp_status: "pending",
      meal_preference: "",
      guest_group: "",
      table_assignment: "",
      plus_one: false,
      notes: "",
      event_id: "",
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
          <DialogDescription>
            Enter the details for your new guest below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newGuest.full_name}
                onChange={(e) => setNewGuest({ ...newGuest, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Select
                value={newGuest.guest_group}
                onValueChange={(value) => setNewGuest({ ...newGuest, guest_group: value })}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {guestGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plusOne">Plus One</Label>
            <Select
              value={newGuest.plus_one ? "yes" : "no"}
              onValueChange={(value) => setNewGuest({ ...newGuest, plus_one: value === "yes" })}
            >
              <SelectTrigger id="plusOne">
                <SelectValue placeholder="Plus one?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={newGuest.notes}
              onChange={(e) => setNewGuest({ ...newGuest, notes: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;
