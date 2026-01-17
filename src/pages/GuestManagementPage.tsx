import { useState } from "react";
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

const GuestManagementPage = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const eventId = "sample-event-id";
  
  const handleExportGuestList = () => {
    toast({
      title: "Exporting guest list",
      description: "Your guest list is being exported. It will download shortly.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your guest list has been downloaded.",
      });
    }, 2000);
  };

  const handleImportGuestList = () => {
    setIsImporting(true);
    
    setTimeout(() => {
      setIsImporting(false);
      toast({
        title: "Import complete",
        description: "Your guest list has been imported successfully.",
      });
    }, 2000);
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
