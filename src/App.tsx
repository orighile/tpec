
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import TWAInstallPrompt from "@/components/TWAInstallPrompt";
import Layout from "@/components/Layout";

// Pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import EventsPage from "./pages/EventsPage";
import VendorsPage from "./pages/VendorsPage";
import VendorMarketplacePage from "./pages/VendorMarketplacePage";
import VendorDetailPage from "./pages/VendorDetailPage";
import VendorBookingPage from "./pages/VendorBookingPage";
import VendorOnboardingPage from "./pages/VendorOnboardingPage";
import BudgetPage from "./pages/BudgetPage";
import ChecklistPage from "./pages/ChecklistPage";
import GuestManagementPage from "./pages/GuestManagementPage";
import SeatingChartPage from "./pages/SeatingChartPage";
import Tasks from "./pages/Tasks";
import PartyCrew from "./pages/PartyCrew";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import SearchPage from "./pages/SearchPage";
import PlanningToolsPage from "./pages/PlanningToolsPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import DomainsPage from "./pages/DomainsPage";
import RoadmapPage from "./pages/RoadmapPage";
import SocialAndTrendsPage from "./pages/SocialAndTrendsPage";
import AdvancedFeaturesPage from "./pages/AdvancedFeaturesPage";
import AIRecommendationsPage from "./pages/AIRecommendationsPage";
import Auth from "./pages/Auth";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import DisclaimerPage from "./pages/DisclaimerPage";
import DigitalInvitationsPage from "./pages/DigitalInvitationsPage";
import GiftRegistryPage from "./pages/GiftRegistryPage";
import FAQPage from "./pages/FAQPage";
import VenuesPage from "./pages/VenuesPage";
import PlannersPage from "./pages/PlannersPage";
import JaraBotPage from "./pages/JaraBotPage";
import CommunityPage from "./pages/CommunityPage";
import GalleryPage from "./pages/GalleryPage";
import BookConsultationPage from "./pages/BookConsultationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
              <Route path="/services/:id" element={<Layout><ServiceDetailPage /></Layout>} />
              <Route path="/events" element={<Layout><EventsPage /></Layout>} />
              <Route path="/events/create" element={<Layout><CreateEventPage /></Layout>} />
              <Route path="/create-event" element={<Layout><CreateEventPage /></Layout>} />
              <Route path="/events/:id" element={<Layout><EventDetailPage /></Layout>} />
              <Route path="/vendors" element={<Layout><VendorsPage /></Layout>} />
              <Route path="/vendors/marketplace" element={<Layout><VendorMarketplacePage /></Layout>} />
              <Route path="/vendor-onboarding" element={<Layout><VendorOnboardingPage /></Layout>} />
              <Route path="/vendors/onboarding" element={<Layout><VendorOnboardingPage /></Layout>} />
              <Route path="/vendors/:id/book" element={<Layout><VendorBookingPage /></Layout>} />
              <Route path="/vendors/:id" element={<Layout><VendorDetailPage /></Layout>} />
              <Route path="/budget" element={<Layout><BudgetPage /></Layout>} />
              <Route path="/checklist" element={<Layout><ChecklistPage /></Layout>} />
              <Route path="/guests" element={<Layout><GuestManagementPage /></Layout>} />
              <Route path="/seating" element={<Layout><SeatingChartPage /></Layout>} />
              <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
              <Route path="/party-crew" element={<Layout><PartyCrew /></Layout>} />
              <Route path="/search" element={<Layout><SearchPage /></Layout>} />
              <Route path="/planning-tools" element={<Layout><PlanningToolsPage /></Layout>} />
              <Route path="/testimonials" element={<Layout><TestimonialsPage /></Layout>} />
              <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
              <Route path="/blog/:id" element={<Layout><BlogPostPage /></Layout>} />
              <Route path="/domains" element={<Layout><DomainsPage /></Layout>} />
              <Route path="/roadmap" element={<Layout><RoadmapPage /></Layout>} />
              <Route path="/social-and-trends" element={<Layout><SocialAndTrendsPage /></Layout>} />
              <Route path="/social-trends" element={<Layout><SocialAndTrendsPage /></Layout>} />
              <Route path="/advanced-features" element={<Layout><AdvancedFeaturesPage /></Layout>} />
              <Route path="/ai-recommendations" element={<Layout><AIRecommendationsPage /></Layout>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
              <Route path="/privacy" element={<Layout><PrivacyPolicyPage /></Layout>} />
              <Route path="/terms" element={<Layout><TermsOfServicePage /></Layout>} />
              <Route path="/disclaimer" element={<Layout><DisclaimerPage /></Layout>} />
              <Route path="/planning-tools/invitations" element={<Layout><DigitalInvitationsPage /></Layout>} />
              <Route path="/planning-tools/registry" element={<Layout><GiftRegistryPage /></Layout>} />
              <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
              <Route path="/venues" element={<Layout><VenuesPage /></Layout>} />
              <Route path="/planners" element={<Layout><PlannersPage /></Layout>} />
              <Route path="/jarabot" element={<Layout hideFooter><JaraBotPage /></Layout>} />
              <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
              <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
              <Route path="/book-consultation" element={<BookConsultationPage />} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
            <TWAInstallPrompt />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
