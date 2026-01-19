import { useState } from "react";
import { Bell, CalendarPlus, User, Gear, List, X } from "phosphor-react";
import { Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TPECLogo from "./TPECLogo";
import { ThemeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [planningToolsOpen, setPlanningToolsOpen] = useState(false);

  const userInitials = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const userEmail = user?.email || "Guest";

  const handlePlanningToolsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      window.location.href = "/auth";
    }
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const planningToolsLinks = [
    { title: "Budget Calculator", href: "/budget", description: "Track expenses and manage your event budget" },
    { title: "Checklist", href: "/checklist", description: "Comprehensive event planning checklists" },
    { title: "Guest Management", href: "/guests", description: "Manage invitations and track RSVPs" },
    { title: "Seating Chart", href: "/seating", description: "Design your event seating arrangements" },
    { title: "Party Crew", href: "/party-crew", description: "Organize your event team and assignments" },
  ];

  const mainNavLinks = [
    { title: "Planners", href: "/planners" },
    { title: "Vendors", href: "/vendors/marketplace" },
    { title: "Venues", href: "/venues" },
    { title: "Inspo", href: "/gallery" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
            <TPECLogo size="lg" linkToHome={false} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary transition-all duration-200 font-medium bg-transparent hover:bg-primary/5 focus:bg-primary/5 data-[state=open]:bg-primary/10 data-[state=open]:text-primary focus:text-foreground rounded-lg px-4 h-10">
                    Planning Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-card/98 backdrop-blur-xl border border-border shadow-[var(--shadow-elegant)] rounded-xl z-[100]">
                    <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {planningToolsLinks.map((tool) => (
                        <li key={tool.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={tool.href}
                              onClick={handlePlanningToolsClick}
                              className="block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-primary/5 hover:shadow-sm focus:bg-primary/5 border border-transparent hover:border-primary/10"
                            >
                              <div className="text-sm font-semibold leading-none text-foreground mb-1">
                                {tool.title}
                              </div>
                              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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

            {mainNavLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5 h-10 inline-flex items-center"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            {!user && (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/auth"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 rounded-full px-6"
                >
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </div>
            )}
            
            <Button
              asChild
              className="hidden sm:inline-flex bg-gradient-to-r from-primary via-purple-500 to-amber-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-amber-500/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-full px-6"
            >
              <Link to="/create-event">Create Event</Link>
            </Button>

            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-full"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              </Button>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-border hover:ring-primary/40 transition-all duration-200"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/src/assets/avatar-1.jpg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-card/98 backdrop-blur-xl border border-border shadow-[var(--shadow-elegant)] rounded-xl z-[100]"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5 rounded-lg"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/tasks"
                      className="flex items-center cursor-pointer hover:bg-primary/5 focus:bg-primary/5 w-full rounded-lg"
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      My Tasks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettingsClick}
                    className="cursor-pointer hover:bg-primary/5 focus:bg-primary/5 rounded-lg"
                  >
                    <Gear className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive rounded-lg"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 rounded-lg"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background/98 backdrop-blur-xl">
                <SheetHeader className="text-left pb-6 border-b border-border">
                  <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col py-6 space-y-2">
                  {/* Planning Tools Collapsible */}
                  <Collapsible open={planningToolsOpen} onOpenChange={setPlanningToolsOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors">
                      <span>Planning Tools</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${planningToolsOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 space-y-1 mt-1">
                      {planningToolsLinks.map((tool) => (
                        <Link
                          key={tool.title}
                          to={tool.href}
                          onClick={handleMobileLinkClick}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          {tool.title}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Main Nav Links */}
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      to={link.href}
                      onClick={handleMobileLinkClick}
                      className="px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth & Actions */}
                <div className="border-t border-border pt-6 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-primary via-purple-500 to-amber-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-amber-500/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-full"
                  >
                    <Link to="/create-event" onClick={handleMobileLinkClick}>Create Event</Link>
                  </Button>
                  
                  {!user && (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/5 rounded-full"
                      >
                        <Link to="/auth" onClick={handleMobileLinkClick}>Login</Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full text-foreground hover:text-primary hover:bg-primary/5 rounded-full"
                      >
                        <Link to="/auth?tab=signup" onClick={handleMobileLinkClick}>Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
