
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventChecklist from "@/components/EventChecklist";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChecklistPage = () => {
  const { toast } = useToast();
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShareChecklist = () => {
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
        title: "Checklist shared",
        description: `Your checklist has been shared with ${shareEmail}`,
      });
      setShareEmail("");
    }, 1500);
  };

  const handleExportChecklist = () => {
    toast({
      title: "Exporting checklist",
      description: "Your checklist is being exported. It will download shortly.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your checklist has been downloaded.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Event Checklist</h1>
            <p className="text-xl text-gray-600">
              Keep track of all your event tasks and never miss a deadline
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <Share2 size={16} />
                  Share Checklist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Checklist</DialogTitle>
                  <DialogDescription>
                    Enter an email address to share your checklist with a colleague or client.
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
                    onClick={handleShareChecklist} 
                    disabled={isSharing}
                  >
                    {isSharing ? "Sharing..." : "Share Checklist"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="flex gap-2 items-center" onClick={handleExportChecklist}>
              <FileText size={16} />
              Export Checklist
            </Button>
          </div>
          
          <EventChecklist />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Checklist Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Stay Organized</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Set clear deadlines for each task</li>
                  <li>Categorize tasks based on priority</li>
                  <li>Review your checklist regularly</li>
                  <li>Delegate tasks to team members when possible</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Time Management</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Start with the most critical tasks</li>
                  <li>Break down large tasks into smaller steps</li>
                  <li>Use reminders for approaching deadlines</li>
                  <li>Build in buffer time for unexpected issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChecklistPage;
