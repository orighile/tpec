import { Info, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DemoModeBannerProps {
  featureName?: string;
}

const DemoModeBanner = ({ featureName = "this feature" }: DemoModeBannerProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              You're viewing sample data
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Sign up to create your own event and unlock {featureName} with your real guest list.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/auth")}
          className="shrink-0"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Sign Up Free
        </Button>
      </div>
    </div>
  );
};

export default DemoModeBanner;
