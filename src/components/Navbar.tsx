
import { useState } from "react";
import { List, X, Bell, CalendarPlus, UserPlus, User, Gear } from "phosphor-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TPECLogo from "./TPECLogo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const userEmail = user?.email || "Guest";
  
  const handlePlanningToolsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      window.location.href = '/auth';
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const planningToolsLinks = [
    { title: "Budget Calculator", href: "/budget", description: "Track expenses and manage your event budget" },
    { title: "Checklist", href: "/checklist", description: "Comprehensive event planning checklists" },
    { title: "Guest Management", href: "/guests", description: "Manage invitations and track RSVPs" },
    { title: "Seating Chart", href: "/seating", description: "Design your event seating arrangements" },
    { title: "Party Crew", href: "/party-crew", description: "Organize your event team and assignments" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white via-purple-50/30 to-white border-b border-purple-100/50 backdrop-blur-sm py-4 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - now acts as home button with enhanced styling */}
        <div className="flex items-center group">
          <div className="relative">
            {/* Subtle glow effect behind logo */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <TPECLogo size="lg" linkToHome={true} />
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium bg-transparent hover:bg-primary/5 focus:bg-transparent data-[state=open]:bg-primary/10 data-[state=open]:text-primary rounded-md px-3">
                  Plan My Event
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white/95 backdrop-blur-md border border-primary/20 shadow-lg rounded-lg">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {planningToolsLinks.map((tool) => (
                      <li key={tool.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={tool.href}
                            onClick={handlePlanningToolsClick}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-[#D4AF37] focus:bg-gray-100 focus:text-[#D4AF37]"
                          >
                            <div className="text-sm font-medium leading-none">{tool.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                              {tool.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
           
          <Link to="/planners" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Find Event Planners</Link>
          <Link to="/vendors/marketplace" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Browse Vendors</Link>
          <Link to="/venues" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Find Venues</Link>
          <Link to="/jarabot" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Ask JaraBot</Link>
          <Link to="/community" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Community</Link>
          <Link to="/gallery" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-2 py-1 rounded-md hover:bg-primary/5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Event Inspiration</Link>
        </div>

        {/* Right section with CTA and user menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button asChild className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Link to="/events/create">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                     <AvatarImage src="/src/assets/avatar-1.jpg" alt="User" />
                    <AvatarFallback className="bg-[#D4AF37] text-white">{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleProfileClick}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/tasks" 
                    className="flex items-center cursor-pointer hover:bg-gray-100 w-full"
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    My Tasks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSettingsClick}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Gear className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer hover:bg-gray-100 text-red-600 focus:text-red-600"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-[#D4AF37] hover:bg-[#D4AF37]/90">
              <Link to="/auth">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center space-x-2">
          <Button asChild className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white text-sm px-3 py-2" size="sm">
            <Link to="/events/create">
              <CalendarPlus className="mr-1 h-3 w-3" />
              Create
            </Link>
          </Button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#D4AF37] hover:bg-gray-100 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden pt-4 pb-3 space-y-1 px-4 border-t border-gray-200 mt-4">
          <div className="py-2">
            <button 
              className="block w-full text-left text-base font-medium text-gray-700 hover:text-[#D4AF37]"
              onClick={() => document.getElementById('mobile-planning-tools')?.classList.toggle('hidden')}
            >
              Plan My Event
            </button>
            <div id="mobile-planning-tools" className="hidden pl-4 pt-2 space-y-2">
              {planningToolsLinks.map((tool) => (
                <Link 
                  key={tool.title} 
                  to={tool.href} 
                  onClick={handlePlanningToolsClick}
                  className="block py-1 text-sm text-gray-600 hover:text-[#D4AF37]"
                >
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
          
          <Link to="/planners" className="block py-2 text-base font-medium text-gray-700 hover:text-[#D4AF37]">Find Event Planners</Link>
          <Link to="/vendors/marketplace" className="block py-2 text-base font-medium text-gray-700 hover:text-[#D4AF37]">Browse Vendors</Link>
          <Link to="/venues" className="block py-2 text-base font-medium text-gray-700 hover:text-[#D4AF37]">Find Venues</Link>
          <Link to="/jarabot" className="block py-2 text-base font-medium text-gray-700 hover:text-[#D4AF37]">Ask JaraBot</Link>
          <Link to="/community" className="block py-2 text-base font-medium text-gray-700 hover:text-[#D4AF37]">Community</Link>
          <Link to="/gallery" className="block py-2 text-base font-medium text-gray-700 hover:text-[#D4AF37]">Event Inspiration</Link>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/src/assets/avatar-1.jpg" alt="User" />
                    <AvatarFallback className="bg-[#D4AF37] text-white">{userInitials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{userEmail}</div>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <button 
                  onClick={handleProfileClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#D4AF37] hover:bg-gray-100"
                >
                  Profile
                </button>
                <Link to="/tasks" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#D4AF37] hover:bg-gray-100">My Tasks</Link>
                <button 
                  onClick={handleSettingsClick}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#D4AF37] hover:bg-gray-100"
                >
                  Settings
                </button>
                <button 
                  onClick={handleSignOut} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#D4AF37] hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200">
              <Link to="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-[#D4AF37] hover:bg-gray-100">Login / Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
