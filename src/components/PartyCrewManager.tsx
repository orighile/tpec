import React, { useState } from "react";
import { useCrewManagement } from "@/hooks/useCrewManagement";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Trash2 } from "lucide-react";

const CREW_ROLES = [
  "Event Coordinator",
  "Venue Liaison", 
  "Catering Manager",
  "Entertainment Coordinator",
  "Guest Relations",
  "Setup Crew",
  "Photographer"
];

const PartyCrewManager = ({ eventId }: { eventId?: string }) => {
  const { toast } = useToast();
  const { crewMembers, loading, addCrewMember, removeCrewMember } = useCrewManagement(eventId);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    contact: "",
    tasks: [""],
  });

  const handleAdd = async () => {
    if (!newMember.name || !newMember.role) {
      toast({
        title: "Missing information",
        description: "Please provide name and role",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCrewMember(newMember);
      setNewMember({ name: "", role: "", contact: "", tasks: [""] });
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Crew member added successfully",
      });
    } catch (error) {
      console.error("Error adding crew member:", error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeCrewMember(id);
      toast({
        title: "Success", 
        description: "Crew member removed",
      });
    } catch (error) {
      console.error("Error removing crew member:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse">Loading crew members...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Party Crew Management
            </CardTitle>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {CREW_ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={newMember.contact}
                  onChange={(e) => setNewMember({ ...newMember, contact: e.target.value })}
                  placeholder="Email or phone"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>Add Member</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {crewMembers.length > 0 ? (
              crewMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                    {member.contact && (
                      <div className="text-xs text-muted-foreground">{member.contact}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{member.tasks?.length || 0} tasks</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemove(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No crew members added yet. Add your first crew member to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartyCrewManager;