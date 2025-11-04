
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
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/create" element={<CreateEventPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/vendors/marketplace" element={<VendorMarketplacePage />} />
                <Route path="/vendor-onboarding" element={<VendorOnboardingPage />} />
                <Route path="/vendors/onboarding" element={<VendorOnboardingPage />} />
                <Route path="/vendors/:id/book" element={<VendorBookingPage />} />
                <Route path="/vendors/:id" element={<VendorDetailPage />} />
                <Route path="/budget" element={<BudgetPage />} />
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/guests" element={<GuestManagementPage />} />
                <Route path="/seating" element={<SeatingChartPage />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/party-crew" element={<PartyCrew />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/planning-tools" element={<PlanningToolsPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/domains" element={<DomainsPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/social-and-trends" element={<SocialAndTrendsPage />} />
                <Route path="/social-trends" element={<SocialAndTrendsPage />} />
                <Route path="/advanced-features" element={<AdvancedFeaturesPage />} />
                <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/planning-tools/invitations" element={<DigitalInvitationsPage />} />
                <Route path="/planning-tools/registry" element={<GiftRegistryPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/venues" element={<VenuesPage />} />
                <Route path="/planners" element={<PlannersPage />} />
                <Route path="/jarabot" element={<JaraBotPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <TWAInstallPrompt />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
