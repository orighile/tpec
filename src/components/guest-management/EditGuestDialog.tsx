
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
import { Guest, guestGroups, mealPreferences } from "./types";
import { useState, useEffect } from "react";

interface EditGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
  onSubmit: (data: any) => void;
}

const EditGuestDialog = ({
  open,
  onOpenChange,
  guest,
  onSubmit,
}: EditGuestDialogProps) => {
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  
  useEffect(() => {
    if (guest) {
      setEditingGuest({ ...guest });
    }
  }, [guest]);

  if (!guest || !editingGuest) return null;

  const handleSubmit = () => {
    onSubmit(editingGuest);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
          <DialogDescription>
            Update information for {editingGuest.full_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editFullName">Full Name</Label>
              <Input
                id="editFullName"
                value={editingGuest.full_name}
                onChange={(e) => setEditingGuest({ ...editingGuest, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={editingGuest.email}
                onChange={(e) => setEditingGuest({ ...editingGuest, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone</Label>
              <Input
                id="editPhone"
                value={editingGuest.phone || ""}
                onChange={(e) => setEditingGuest({ ...editingGuest, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGroup">Group</Label>
              <Select
                value={editingGuest.guest_group || ""}
                onValueChange={(value) => setEditingGuest({ ...editingGuest, guest_group: value })}
              >
                <SelectTrigger id="editGroup">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editRsvpStatus">RSVP Status</Label>
              <Select
                value={editingGuest.rsvp_status}
                onValueChange={(value: "confirmed" | "pending" | "declined") => 
                  setEditingGuest({ ...editingGuest, rsvp_status: value })
                }
              >
                <SelectTrigger id="editRsvpStatus">
                  <SelectValue placeholder="RSVP Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMealPreference">Meal Preference</Label>
              <Select
                value={editingGuest.meal_preference || ""}
                onValueChange={(value) => 
                  setEditingGuest({ ...editingGuest, meal_preference: value })
                }
              >
                <SelectTrigger id="editMealPreference">
                  <SelectValue placeholder="Meal Preference" />
                </SelectTrigger>
                <SelectContent>
                  {mealPreferences.map((meal) => (
                    <SelectItem key={meal} value={meal}>
                      {meal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editPlusOne">Plus One</Label>
            <Select
              value={editingGuest.plus_one ? "yes" : "no"}
              onValueChange={(value) => 
                setEditingGuest({ ...editingGuest, plus_one: value === "yes" })
              }
            >
              <SelectTrigger id="editPlusOne">
                <SelectValue placeholder="Plus one?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editTable">Table Assignment</Label>
            <Input
              id="editTable"
              value={editingGuest.table_assignment || ""}
              onChange={(e) => 
                setEditingGuest({ 
                  ...editingGuest, 
                  table_assignment: e.target.value || null 
                })
              }
              placeholder="e.g., Table 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editNotes">Notes</Label>
            <Input
              id="editNotes"
              value={editingGuest.notes || ""}
              onChange={(e) => setEditingGuest({ ...editingGuest, notes: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Update Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGuestDialog;
