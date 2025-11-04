
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

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-xs px-3 py-2 shadow-md">
                <Link to="/events/create">
                  <CalendarPlus className="mr-1 h-3 w-3" />
                  Create
                </Link>
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0 ring-2 ring-primary/20">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/src/assets/avatar-1.jpg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold">{userInitials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/98 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-xl z-50">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold">Account</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tasks" className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        My Tasks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10">
                      <Gear className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-xs">
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-t border-primary/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-6 gap-1 px-2 py-3">
          <Link to="/planners" className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group">
            <UserPlus className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-medium text-foreground/60 group-hover:text-primary transition-colors">Planners</span>
          </Link>
          
          <Link to="/vendors/marketplace" className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group">
            <svg className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[10px] font-medium text-foreground/60 group-hover:text-primary transition-colors">Vendors</span>
          </Link>
          
          <Link to="/venues" className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group">
            <svg className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium text-foreground/60 group-hover:text-primary transition-colors">Venues</span>
          </Link>
          
          <Link to="/jarabot" className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group">
            <svg className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-[10px] font-medium text-foreground/60 group-hover:text-primary transition-colors">JaraBot</span>
          </Link>
          
          <Link to="/community" className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group">
            <svg className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] font-medium text-foreground/60 group-hover:text-primary transition-colors">Community</span>
          </Link>
          
          <Link to="/gallery" className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 transition-all duration-300 group">
            <svg className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium text-foreground/60 group-hover:text-primary transition-colors">Gallery</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
