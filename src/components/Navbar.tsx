import { useState } from "react";
import { Bell, CalendarPlus, User, Gear } from "phosphor-react";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const userEmail = user?.email || "Guest";

  const handlePlanningToolsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      window.location.href = "/auth";
    }
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

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
            <TPECLogo size="lg" linkToHome={false} />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary transition-all duration-200 font-medium bg-transparent hover:bg-primary/5 focus:bg-primary/5 data-[state=open]:bg-primary/10 data-[state=open]:text-primary focus:text-foreground rounded-lg px-4 h-10">
                    Plan Event
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

            <Link
              to="/planners"
              className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5 h-10 inline-flex items-center"
            >
              Planners
            </Link>

            <Link
              to="/vendors/marketplace"
              className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5 h-10 inline-flex items-center"
            >
              Vendors
            </Link>

            <Link
              to="/venues"
              className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5 h-10 inline-flex items-center"
            >
              Venues
            </Link>


            <Link
              to="/gallery"
              className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-primary/5 h-10 inline-flex items-center"
            >
              Inspo
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
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

            {user ? (
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
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
