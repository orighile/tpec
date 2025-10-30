
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { MemberFormData, CREW_ROLES } from "./types";
import { Plus, Trash } from "lucide-react";

interface CrewMemberFormProps {
  formData: MemberFormData;
  onFormChange: (newFormData: MemberFormData) => void;
  onSubmit: () => void;
  submitLabel: string;
}

const CrewMemberForm = ({ 
  formData, 
  onFormChange, 
  onSubmit,
  submitLabel
}: CrewMemberFormProps) => {
  
  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index] = value;
    onFormChange({
      ...formData,
      tasks: updatedTasks
    });
  };

  const handleAddTask = () => {
    onFormChange({
      ...formData,
      tasks: [...formData.tasks, ""]
    });
  };

  const handleRemoveTask = (index: number) => {
    onFormChange({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => onFormChange({ ...formData, role: value })}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {CREW_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact">Contact Information</Label>
        <Input
          id="contact"
          value={formData.contact}
          onChange={(e) => onFormChange({ ...formData, contact: e.target.value })}
          placeholder="Email or phone number"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Tasks & Responsibilities</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddTask}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
        {formData.tasks.map((task, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={task}
              onChange={(e) => handleTaskChange(index, e.target.value)}
              placeholder={`Task ${index + 1}`}
            />
            {formData.tasks.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveTask(index)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default CrewMemberForm;
