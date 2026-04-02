import { useState, useRef } from "react";
import GuestManager from "@/components/GuestManager";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DemoModeBanner from "@/components/common/DemoModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const GuestManagementPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventId = "sample-event-id";
  const isDemo = !user || eventId === "sample-event-id";
  
  const handleExportGuestList = async () => {
    try {
      const { data: guests, error } = await supabase
        .from("guests")
        .select("full_name, email, phone, rsvp_status, meal_preference, guest_group, table_assignment, plus_one, notes")
        .eq("event_id", eventId);

      if (error) throw error;

      const rows = guests || [];
      const headers = ["Full Name", "Email", "Phone", "RSVP Status", "Meal Preference", "Group", "Table", "Plus One", "Notes"];
      const csvContent = [
        headers.join(","),
        ...rows.map(g => [
          `"${g.full_name || ""}"`,
          `"${g.email || ""}"`,
          `"${g.phone || ""}"`,
          `"${g.rsvp_status || ""}"`,
          `"${g.meal_preference || ""}"`,
          `"${g.guest_group || ""}"`,
          `"${g.table_assignment || ""}"`,
          g.plus_one ? "Yes" : "No",
          `"${(g.notes || "").replace(/"/g, '""')}"`,
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "guest-list.csv";
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Export complete", description: "Your guest list CSV has been downloaded." });
    } catch {
      toast({ title: "Export failed", description: "Could not export guest list.", variant: "destructive" });
    }
  };

  const handleImportGuestList = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({ title: "No file selected", description: "Please select a CSV file first.", variant: "destructive" });
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");

      const rows = lines.slice(1).map(line => {
        const cols = line.split(",").map(c => c.replace(/^"|"$/g, "").trim());
        return {
          event_id: eventId,
          full_name: cols[0] || "Unknown",
          email: cols[1] || `guest-${Date.now()}@example.com`,
          phone: cols[2] || null,
          rsvp_status: cols[3] || "pending",
          meal_preference: cols[4] || null,
          guest_group: cols[5] || null,
          table_assignment: cols[6] || null,
          plus_one: (cols[7] || "").toLowerCase() === "yes",
          notes: cols[8] || null,
        };
      });

      const { error } = await supabase.from("guests").insert(rows);
      if (error) throw error;

      toast({ title: "Import complete", description: `${rows.length} guests imported successfully.` });
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message || "Could not import guests.", variant: "destructive" });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Guest Management</h1>
            <p className="text-xl text-muted-foreground">
              Organize your guest list, track RSVPs, and manage guest details
            </p>
          </div>
          
          {isDemo && (
            <DemoModeBanner featureName="guest management" />
          )}
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="outline" className="flex gap-2 items-center" onClick={handleExportGuestList}>
              <Download size={16} />
              Export Guest List
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Upload size={16} />
                  Import Guests
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Guest List</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file with your guest information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleImportGuestList} 
                    disabled={isImporting}
                  >
                    {isImporting ? "Importing..." : "Import"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <GuestManager eventId={eventId} />
          
          <div className="mt-8 bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Guest Management Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Collecting RSVPs</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Set a clear RSVP deadline</li>
                  <li>Provide multiple ways to RSVP (online, phone, email)</li>
                  <li>Follow up with guests who haven't responded</li>
                  <li>Confirm dietary restrictions and +1 information</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Guest Communication</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Send save-the-dates 6-8 months in advance</li>
                  <li>Mail formal invitations 6-8 weeks before the event</li>
                  <li>Create a wedding website for additional details</li>
                  <li>Send a post-event thank you note within 3 months</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default GuestManagementPage;
