
# TPEC Events - Developer Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Authentication System](#authentication-system)
5. [Database Schema](#database-schema)
6. [Core Features](#core-features)
7. [Components Architecture](#components-architecture)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Development Setup](#development-setup)
11. [Deployment](#deployment)
12. [Contributing Guidelines](#contributing-guidelines)

## Project Overview

TPEC Events is a comprehensive event planning and management platform built with React and TypeScript. The application provides tools for event creation, vendor management, guest management, budget tracking, and AI-powered assistance through JaraBot.

### Key Features
- Event planning and management
- Vendor marketplace and management
- Guest list management with RSVP tracking
- Budget planning and expense tracking
- Seating chart builder
- Party crew management
- AI chatbot assistance (JaraBot)
- Social trends and testimonials
- Advanced features (AR preview, voice commands, offline mode)

## Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library
- **React Router DOM 6.26.2** - Client-side routing
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions
  - Edge functions

### State Management & Data Fetching
- **TanStack Query 5.56.2** - Server state management
- **React Context** - Global state (Auth)
- **Custom hooks** - Local state management

### Additional Libraries
- **React Hook Form 7.53.0** - Form handling
- **Zod 3.23.8** - Schema validation
- **Recharts 2.12.7** - Data visualization
- **date-fns 3.6.0** - Date manipulation
- **uuid 11.1.0** - Unique ID generation

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── jarabot/         # AI chatbot components
│   ├── vendors/         # Vendor-related components
│   ├── guest-management/ # Guest management components
│   ├── party-crew/      # Party crew components
│   └── roadmap/         # Roadmap components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── utils/               # Utility functions
├── data/                # Static data and mock data
├── types/               # TypeScript type definitions
├── integrations/        # External service integrations
└── lib/                 # Library configurations
```

## Authentication System

The application uses Supabase Auth for user management:

### AuthContext (`src/contexts/AuthContext.tsx`)
- Provides authentication state globally
- Manages user sessions
- Handles sign in/up/out operations
- Password reset functionality

### Key Methods
```typescript
const { 
  user,           // Current user object
  session,        // Current session
  isLoading,      // Loading state
  signIn,         // Sign in function
  signUp,         // Sign up function
  signOut,        // Sign out function
  resetPassword   // Password reset function
} = useAuth();
```

### Protected Routes
Authentication is required for:
- Profile management
- Event creation/management
- Vendor interactions
- Guest management
- Budget planning

## Database Schema

### Core Tables
The application uses Supabase PostgreSQL with the following main tables:

- **profiles** - User profile information
- **events** - Event details and metadata
- **vendors** - Vendor information and services
- **guests** - Guest list management
- **budgets** - Budget tracking and expenses

### Row Level Security (RLS)
All tables implement RLS policies to ensure data isolation between users.

## Core Features

### 1. Event Management
- **Location**: `src/pages/EventsPage.tsx`, `src/pages/CreateEventPage.tsx`
- Create, edit, and manage events
- Event details and scheduling
- Event sharing and collaboration

### 2. Vendor Marketplace
- **Location**: `src/components/VendorMarketplace.tsx`
- Browse and filter vendors by category
- Vendor profiles and reviews
- Contact and booking functionality
- Vendor registration system

### 3. Guest Management
- **Location**: `src/components/guest-management/`
- Add and manage guest lists
- RSVP tracking and status management
- Meal preferences and dietary restrictions
- Guest grouping and categorization

### 4. Budget Planning
- **Location**: `src/pages/BudgetPage.tsx`
- Expense tracking and categorization
- Budget allocation and monitoring
- Cost analysis and reporting

### 5. JaraBot AI Assistant
- **Location**: `src/components/jarabot/`
- Context-aware AI responses
- Nigerian cultural knowledge
- Event planning assistance
- Voice command support

## Components Architecture

### Component Organization
Components are organized by feature and reusability:

1. **UI Components** (`src/components/ui/`)
   - Base shadcn/ui components
   - Customized for the design system

2. **Feature Components** (`src/components/[feature]/`)
   - Feature-specific components
   - Each feature has its own directory

3. **Page Components** (`src/pages/`)
   - Top-level route components
   - Compose feature components

### Design System
The application uses a consistent design system:

```css
/* Key colors from index.css */
--jara-purple: 280 87% 65%;
--jara-teal: 176 64% 40%;
--jara-green: 143 61% 48%;
--jara-orange: 25 95% 53%;
```

### Component Patterns

#### Custom Hooks Pattern
Most features use custom hooks for state management:

```typescript
// Example: useGuestManager hook
export const useGuestManager = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  // ... logic
  return {
    guests,
    handleAddGuest,
    handleUpdateGuest,
    // ... methods
  };
};
```

#### Form Handling Pattern
Forms use React Hook Form with Zod validation:

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {...}
});
```

## State Management

### Global State
- **AuthContext** - User authentication state
- **React Query** - Server state and caching

### Local State
- **useState** - Component-level state
- **Custom hooks** - Feature-specific state logic

### Data Fetching
TanStack Query is used for server state:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['vendors'],
  queryFn: fetchVendors,
});
```

## API Integration

### Supabase Client
```typescript
import { supabase } from "@/integrations/supabase/client";

// Example usage
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id);
```

### Error Handling
- Global error boundary (`src/components/ErrorBoundary.tsx`)
- Toast notifications for user feedback
- Graceful fallbacks for failed requests

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

### Production Build
```bash
npm run build
```

### Deployment Platforms
The application can be deployed to:
- Vercel
- Netlify
- Supabase hosting
- Any static hosting service

### Environment Configuration
Ensure production environment variables are set:
- Database connection strings
- API keys
- Feature flags

## Contributing Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling

### Component Guidelines
- Keep components focused and single-purpose
- Use custom hooks for complex logic
- Implement proper TypeScript types
- Add appropriate error boundaries

### File Organization
- Group related files in feature directories
- Use index files for clean imports
- Keep components under 200 lines
- Extract large components into smaller ones

### Testing Considerations
- Components should be testable in isolation
- Use React Testing Library patterns
- Mock external dependencies
- Test user interactions and edge cases

### Git Workflow
- Use descriptive commit messages
- Create feature branches
- Submit pull requests for review
- Ensure builds pass before merging

## Performance Considerations

### Optimization Techniques
- Lazy loading for route components
- Image optimization
- Bundle splitting
- Query result caching

### Monitoring
- Error boundary logging
- Performance metrics tracking
- User behavior analytics

## Security Considerations

### Data Protection
- Row Level Security (RLS) policies
- Input validation with Zod
- Secure authentication flows
- HTTPS enforcement

### Best Practices
- Sanitize user inputs
- Validate API responses
- Implement proper error handling
- Use secure headers

---

This documentation serves as a comprehensive guide for developers working on the TPEC Events application. For specific implementation details, refer to the individual component files and their inline documentation.
