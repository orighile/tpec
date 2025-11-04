
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
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with premium effect */}
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <TPECLogo size="lg" linkToHome={true} />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium bg-transparent hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 focus:bg-transparent data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/10 data-[state=open]:to-accent/10 data-[state=open]:text-primary rounded-lg px-4">
                      Plan My Event
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white/98 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-xl">
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {planningToolsLinks.map((tool) => (
                          <li key={tool.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={tool.href}
                                onClick={handlePlanningToolsClick}
                                className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 hover:shadow-md hover:scale-105 focus:bg-gradient-to-br focus:from-primary/10 focus:to-accent/10"
                              >
                                <div className="text-sm font-semibold leading-none text-foreground">{tool.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
              
              <Link to="/planners" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group">
                <span className="relative z-10">Find Planners</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              
              <Link to="/vendors/marketplace" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group">
                <span className="relative z-10">Browse Vendors</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              
              <Link to="/venues" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group">
                <span className="relative z-10">Venues</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              
              <Link to="/jarabot" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group">
                <span className="relative z-10">JaraBot</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              
              <Link to="/community" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group">
                <span className="relative z-10">Community</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              
              <Link to="/gallery" className="relative text-foreground/80 hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 group">
                <span className="relative z-10">Inspiration</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button asChild className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <Link to="/events/create">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <CalendarPlus className="mr-2 h-4 w-4 relative z-10" />
                  <span className="relative z-10">Create Event</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative text-foreground/70 hover:text-primary hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50"></span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/src/assets/avatar-1.jpg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/98 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-xl z-50">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tasks" className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10 w-full">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        My Tasks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus:bg-gradient-to-r focus:from-primary/10 focus:to-accent/10">
                      <Gear className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Navigation - Desktop Style */}
            <div className="lg:hidden flex items-center gap-1.5 flex-shrink-0">
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs px-3 py-1.5 h-8 shadow-md">
                <Link to="/events/create">
                  <CalendarPlus className="h-3 w-3" />
                </Link>
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 ring-2 ring-primary/20">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/src/assets/avatar-1.jpg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold">{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/98 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-xl z-50">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-semibold">Account</p>
                        <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                      <User className="mr-2 h-3 w-3" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tasks" className="cursor-pointer text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                        <CalendarPlus className="mr-2 h-3 w-3" />
                        My Tasks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer text-xs hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                      <Gear className="mr-2 h-3 w-3" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-xs hover:bg-red-50 text-red-600 focus:text-red-600">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-xs h-8 px-2">
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Secondary Navigation Bar - Mobile/Tablet Only */}
          <div className="lg:hidden border-t border-primary/10 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-0.5 px-2 py-2 min-w-max">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs bg-transparent hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/10 data-[state=open]:to-accent/10 px-3 py-1.5 h-8">
                      Tools
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white/98 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-xl">
                      <ul className="grid w-[280px] gap-2 p-3">
                        {planningToolsLinks.map((tool) => (
                          <li key={tool.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={tool.href}
                                onClick={handlePlanningToolsClick}
                                className="block select-none space-y-0.5 rounded-lg p-2.5 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10"
                              >
                                <div className="text-xs font-semibold leading-none text-foreground">{tool.title}</div>
                                <p className="line-clamp-1 text-[10px] leading-snug text-muted-foreground">{tool.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <Link to="/planners" className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 whitespace-nowrap h-8 flex items-center">
                Planners
              </Link>
              
              <Link to="/vendors/marketplace" className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 whitespace-nowrap h-8 flex items-center">
                Vendors
              </Link>
              
              <Link to="/venues" className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 whitespace-nowrap h-8 flex items-center">
                Venues
              </Link>
              
              <Link to="/jarabot" className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 whitespace-nowrap h-8 flex items-center">
                Bot
              </Link>
              
              <Link to="/community" className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 whitespace-nowrap h-8 flex items-center">
                Community
              </Link>
              
              <Link to="/gallery" className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 whitespace-nowrap h-8 flex items-center">
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
