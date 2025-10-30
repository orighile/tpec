
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2 } from "lucide-react";

type SubmitButtonProps = {
  isSubmitting: boolean;
};

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end pt-4">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <UserCheck className="mr-2 h-4 w-4" />
            Submit Registration
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
