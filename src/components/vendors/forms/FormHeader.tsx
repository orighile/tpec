
import { UserPlus } from "lucide-react";

const FormHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-primary/10 p-2 rounded-full">
        <UserPlus className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold">Vendor Registration</h2>
    </div>
  );
};

export default FormHeader;
