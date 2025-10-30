
import { useState } from "react";
import { Check, Copy, Envelope, Users } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetShareProps {
  budgetId?: string;
}

const BudgetShare = ({ budgetId = "default" }: BudgetShareProps) => {
  const { toast } = useToast();
  const [shareEmail, setShareEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = `${window.location.origin}/planning-tools/budget?shared=${budgetId}`;

  const handleShareBudget = () => {
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
        title: "Budget shared",
        description: `Your budget has been shared with ${shareEmail} (${permission} permission)`,
      });
      setShareEmail("");
      setIsOpen(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "Budget share link has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Users size={16} />
          Share Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Budget</DialogTitle>
          <DialogDescription>
            Share your budget with team members or clients
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <label htmlFor="shareLink" className="sr-only">Link</label>
              <Input
                id="shareLink"
                value={shareUrl}
                readOnly
                className="w-full"
              />
            </div>
            <Button 
              type="button" 
              size="icon" 
              variant="outline" 
              onClick={copyToClipboard}
              className="transition-all duration-200"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Select 
                value={permission} 
                onValueChange={setPermission}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View only</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input 
                id="email" 
                placeholder="colleague@example.com" 
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleShareBudget} 
                disabled={isSharing}
                className="flex gap-1 items-center min-w-20"
              >
                <Envelope className="h-4 w-4" />
                {isSharing ? "Sending..." : "Invite"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetShare;
