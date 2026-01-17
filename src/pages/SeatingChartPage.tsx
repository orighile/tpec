
import { useState } from "react";
import SeatingPlanner from "@/components/SeatingPlanner";
import { Button } from "@/components/ui/button";
import { Download, Save, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JaraBot from "@/components/jarabot";

const SeatingChartPage = () => {
  const { toast } = useToast();
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleShareSeatingChart = () => {
    if (!shareEmail || !shareEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSharing(false);
      toast({
        title: "Seating chart shared",
        description: `Your seating chart has been shared with ${shareEmail}`,
      });
      setShareEmail("");
    }, 1500);
  };

  const handleExportSeatingChart = () => {
    toast({
      title: "Exporting seating chart",
      description: "Your seating chart is being exported. It will download shortly.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your seating chart has been downloaded.",
      });
    }, 2000);
  };
  
  const handleSaveSeatingChart = () => {
    setIsSaving(true);
    
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Seating chart saved",
        description: "Your seating chart layout has been saved successfully.",
      });
    }, 1500);
  };

  return (
    <>
      <div className="flex-1 py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Seating Chart</h1>
            <p className="text-xl text-muted-foreground">
              Design your event floor plan and arrange guests at tables
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Button 
              variant="outline" 
              className="flex gap-2 items-center" 
              onClick={handleSaveSeatingChart}
              disabled={isSaving}
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Layout"}
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Share2 size={16} />
                  Share Layout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Seating Chart</DialogTitle>
                  <DialogDescription>
                    Enter an email address to share your seating layout with a colleague or client.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input 
                      id="email" 
                      placeholder="example@email.com" 
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleShareSeatingChart} 
                    disabled={isSharing}
                  >
                    {isSharing ? "Sharing..." : "Share Layout"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="flex gap-2 items-center" onClick={handleExportSeatingChart}>
              <Download size={16} />
              Export as PDF
            </Button>
          </div>
          
          <SeatingPlanner />
          
          <div className="mt-8 bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Seating Chart Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Strategic Seating</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Seat guests with others they'll enjoy talking to</li>
                  <li>Keep guests with mobility issues close to entrances</li>
                  <li>Consider age when creating table assignments</li>
                  <li>Keep families together when possible</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Layout Considerations</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Allow sufficient space between tables (at least 60 inches)</li>
                  <li>Keep high-traffic areas clear of tables</li>
                  <li>Consider proximity to dance floor, buffet, and restrooms</li>
                  <li>Ensure good visibility of key areas for all tables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <JaraBot />
    </>
  );
};

export default SeatingChartPage;
