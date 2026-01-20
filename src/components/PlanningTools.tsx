import { 
  Calendar, 
  Users, 
  CreditCard, 
  CheckSquare, 
  Home, 
  Gift, 
  Mail, 
  LayoutGrid 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const planningTools = [
  {
    icon: CreditCard,
    title: "Budget Calculator",
    description: "Easily track expenses and manage your event budget with automated calculations",
    action: "Create Budget",
    link: "/budget",
    enabled: true
  },
  {
    icon: CheckSquare,
    title: "Checklist",
    description: "Never miss a detail with our comprehensive event planning checklists",
    action: "Start Checklist",
    link: "/checklist",
    enabled: true
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Manage invitations, track RSVPs, and organize attendee information",
    action: "Manage Guests",
    link: "/guests",
    enabled: true
  },
  {
    icon: LayoutGrid,
    title: "Seating Chart",
    description: "Create and customize your event seating arrangements with our intuitive tool",
    action: "Design Layout",
    link: "/seating",
    enabled: true
  },
  {
    icon: Users,
    title: "Party Crew Builder",
    description: "Organize your event team and assign responsibilities",
    action: "Build Crew",
    link: "/party-crew",
    enabled: true
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Keep track of all tasks and assignments for your event",
    action: "Manage Tasks",
    link: "/tasks",
    enabled: true
  }
];

const vendorTools = [
  {
    icon: Home,
    title: "Vendor Marketplace",
    description: "Find and connect with top-rated vendors for every aspect of your event",
    action: "Browse Vendors",
    link: "/vendors",
    enabled: true
  },
  {
    icon: Calendar,
    title: "Vendor Calendar",
    description: "Schedule vendor appointments and keep track of important meetings",
    action: "Open Calendar",
    link: "/planning-tools/calendar",
    enabled: false
  }
];

const additionalTools = [
  {
    icon: Mail,
    title: "Digital Invitations",
    description: "Create beautiful, customizable digital invites that match your event theme",
    action: "Design Invites",
    link: "/planning-tools/invitations",
    enabled: true
  },
  {
    icon: Gift,
    title: "Gift Registry",
    description: "Set up an online gift registry that's easy for guests to use",
    action: "Create Registry",
    link: "/planning-tools/registry",
    enabled: true
  }
];

const PlanningTools = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Event Planning Tools</h2>
          <p className="text-gray-600">
            Professional planning tools to help you create successful, memorable events
          </p>
        </div>
        
        <Tabs defaultValue="planning" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="planning">Planning Tools</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="additional">Invitations & Registry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planningTools.map((tool, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-5">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  
                  <p className="text-gray-600 mb-5">
                    {tool.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    asChild={tool.enabled}
                    disabled={!tool.enabled}
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {tool.enabled ? (
                      <Link to={tool.link}>{tool.action}</Link>
                    ) : (
                      <span>{tool.action} {!tool.enabled && "(Coming Soon)"}</span>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="vendors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {vendorTools.map((tool, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-5">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  
                  <p className="text-gray-600 mb-5">
                    {tool.description}
                  </p>
                  
                  <Button 
                    variant="outline"
                    asChild={tool.enabled}
                    disabled={!tool.enabled} 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {tool.enabled ? (
                      <Link to={tool.link}>{tool.action}</Link>
                    ) : (
                      <span>{tool.action} {!tool.enabled && "(Coming Soon)"}</span>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {additionalTools.map((tool, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-5">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  
                  <p className="text-gray-600 mb-5">
                    {tool.description}
                  </p>
                  
                  <Button 
                    variant="outline"
                    asChild={tool.enabled}
                    disabled={!tool.enabled}
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {tool.enabled ? (
                      <Link to={tool.link}>{tool.action}</Link>
                    ) : (
                      <span>{tool.action} {!tool.enabled && "(Coming Soon)"}</span>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
            <Link to="/events/create">Create Your Event</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlanningTools;
