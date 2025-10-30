
import { PartyCrewMember } from "@/components/jarabot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Mail } from "lucide-react";

interface CrewMemberCardProps {
  member: PartyCrewMember;
  onEdit: (member: PartyCrewMember) => void;
  onRemove: (id: string) => void;
  onContact: (member: PartyCrewMember) => void;
  isSendingEmail: boolean;
}

const CrewMemberCard = ({ 
  member, 
  onEdit, 
  onRemove, 
  onContact, 
  isSendingEmail 
}: CrewMemberCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={member.avatarUrl || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <Badge variant="outline" className="mt-1">{member.role}</Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(member)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(member.id)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Tasks & Responsibilities</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              {member.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Contact: {member.contact || "None"}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              disabled={isSendingEmail || !member.contact}
              onClick={() => onContact(member)}
            >
              <Mail className="h-4 w-4 mr-1" />
              {isSendingEmail ? "Sending..." : "Message"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrewMemberCard;
