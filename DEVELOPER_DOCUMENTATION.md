
# TPEC Events - Developer Documentation

## Project Overview

TPEC Events is a comprehensive event planning and management platform built with React, TypeScript, and Supabase. This documentation outlines all entities, their relationships, and available actions within the system.

## Technology Stack

- **Frontend**: React 18.3.1, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: TanStack Query, React Context, Custom Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## Core Entities and Types

### 1. User Entity

```typescript
UserType = {
  id: string;
  email: string;
  role: "vendor" | "regular" | "admin";
  profile: ProfileType;
  session: Session | null;
  isAuthenticated: boolean;
}

ProfileType = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
```

**Relationships:**
- One-to-One with Profile
- One-to-Many with Events (as creator)
- One-to-Many with Tasks
- One-to-Many with VendorRatings (as reviewer)
- Many-to-Many with Events (as guest)

**Actions:**
- `signIn(email, password)` - Authenticate user
- `signUp(email, password, userData)` - Register new user
- `signOut()` - End user session
- `resetPassword(email)` - Initiate password reset
- `updateProfile(profileData)` - Update user profile
- `deleteAccount()` - Delete user account

### 2. Event Entity

```typescript
EventType = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  status: "planning" | "confirmed" | "completed" | "cancelled";
  budget: number | null;
  guest_count: number;
  created_at: string;
  updated_at: string;
}
```

**Relationships:**
- Many-to-One with User (creator)
- One-to-Many with Guests
- One-to-Many with Tasks
- One-to-Many with Expenses
- Many-to-Many with Vendors (bookings)
- One-to-Many with PartyCrewMembers

**Actions:**
- `createEvent(eventData)` - Create new event
- `updateEvent(id, eventData)` - Update event details
- `deleteEvent(id)` - Remove event
- `shareEvent(id, shareData)` - Share event with others
- `duplicateEvent(id)` - Create copy of event

### 3. Vendor Entity

```typescript
VendorType = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  availability: string[];
  specialties: string[];
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  established?: string;
  about?: string;
  userId?: string; // If vendor is also a user
}

VendorFilterOptions = {
  searchTerm: string;
  category: string;
  priceRange: string;
  location: string;
  verifiedOnly: boolean;
  availability: string[];
  rating: number | null;
}
```

**Relationships:**
- One-to-One with User (if registered user)
- One-to-Many with VendorRatings
- Many-to-Many with Events (bookings)

**Actions:**
- `registerVendor(vendorData)` - Register as vendor
- `updateVendorProfile(id, vendorData)` - Update vendor information
- `searchVendors(filters)` - Search and filter vendors
- `contactVendor(id, message)` - Send message to vendor
- `rateVendor(id, rating, review)` - Rate and review vendor
- `saveVendor(id)` - Add to saved vendors list

### 4. Guest Entity

```typescript
GuestType = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  rsvpStatus: "pending" | "confirmed" | "declined";
  mealPreference: string;
  group: string;
  table: string | null;
  plusOne: boolean;
  notes: string;
  event_id: string;
}

RsvpStats = {
  totalGuests: number;
  confirmed: number;
  declined: number;
  pending: number;
}
```

**Relationships:**
- Many-to-One with Event
- Optional relationship with SeatingChart

**Actions:**
- `addGuest(guestData)` - Add new guest to event
- `updateGuest(id, guestData)` - Update guest information
- `removeGuest(id)` - Remove guest from event
- `sendInvitation(id)` - Send RSVP invitation
- `updateRsvpStatus(id, status)` - Update RSVP response
- `assignTable(id, tableId)` - Assign guest to table

### 5. Task Entity

```typescript
TaskType = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  event_id: string | null;
  created_at: string;
  updated_at: string;
}

PhaseType = {
  id: number;
  name: string;
  status: TaskStatus;
  description: string;
  timeframe: string;
  tasks: TaskItem[];
  dependencies?: number[];
}
```

**Relationships:**
- Many-to-One with User
- Many-to-One with Event (optional)

**Actions:**
- `createTask(taskData)` - Create new task
- `updateTask(id, taskData)` - Update task details
- `deleteTask(id)` - Remove task
- `changeTaskStatus(id, status)` - Update task status
- `assignTaskToEvent(id, eventId)` - Link task to event

### 6. PartyCrewMember Entity

```typescript
PartyCrewMemberType = {
  id: string;
  userId: string;
  name: string;
  role: string;
  avatarUrl: string;
  tasks: string[];
  contact: string;
}

CrewRoles = [
  "Event Coordinator",
  "Venue Liaison", 
  "Catering Manager",
  "Entertainment Coordinator",
  "Guest Relations",
  "Transportation Manager",
  "Setup Crew",
  "Cleanup Crew",
  "Photographer/Videographer",
  "Social Media Manager"
]
```

**Relationships:**
- Many-to-One with Event
- Many-to-One with User

**Actions:**
- `addCrewMember(memberData)` - Add crew member to event
- `updateCrewMember(id, memberData)` - Update crew member details
- `removeCrewMember(id)` - Remove crew member
- `assignTasks(id, tasks)` - Assign tasks to crew member

### 7. VendorRating Entity

```typescript
VendorRatingType = {
  id: string;
  vendorId: string;
  userId: string;
  rating: number;
  review: string;
  createdAt: Date;
}
```

**Relationships:**
- Many-to-One with Vendor
- Many-to-One with User

**Actions:**
- `createReview(reviewData)` - Add vendor review
- `updateReview(id, reviewData)` - Update existing review
- `deleteReview(id)` - Remove review

## System Architecture

### Authentication Flow
```
User → AuthContext → Supabase Auth → Database
```

### Data Flow Patterns
```
Component → Custom Hook → TanStack Query → Supabase Client → Database
```

### State Management Hierarchy
1. **Global State**: AuthContext (user session)
2. **Server State**: TanStack Query (cached data)
3. **Local State**: useState/useReducer (component state)
4. **Form State**: React Hook Form (form data)

## Database Schema Relationships

```sql
-- Core relationships
users (auth.users) 1:1 profiles
users 1:M events
users 1:M tasks
events 1:M guests
events 1:M party_crew_members
events M:M vendors (through bookings)
vendors 1:M vendor_ratings
users 1:M vendor_ratings
```

## API Endpoints (Supabase)

### Authentication
- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token` - User login
- `POST /auth/v1/logout` - User logout
- `POST /auth/v1/recover` - Password recovery

### Data Operations
- `GET /rest/v1/table_name` - Fetch records
- `POST /rest/v1/table_name` - Create record
- `PATCH /rest/v1/table_name` - Update record
- `DELETE /rest/v1/table_name` - Delete record

## Security Model

### Row Level Security (RLS)
All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example policy
CREATE POLICY "Users can view their own tasks" 
ON tasks FOR SELECT 
USING (auth.uid() = user_id);
```

### Authentication Requirements
- All data operations require valid JWT token
- User roles determine access levels
- Vendor registration requires additional verification

## Component Architecture

### Page Components (Routes)
- `Index` - Landing page
- `Auth` - Authentication forms
- `EventsPage` - Event management
- `VendorMarketplacePage` - Vendor discovery
- `GuestManagementPage` - Guest list management
- `BudgetPage` - Budget tracking
- `ProfilePage` - User profile management
- `SettingsPage` - Application settings

### Feature Components
- `VendorMarketplace` - Vendor browsing and filtering
- `GuestManager` - Guest list operations
- `PartyCrewBuilder` - Team management
- `JaraBot` - AI assistant interface
- `TaskManagement` - Task tracking
- `SeatingPlanner` - Table arrangements

### Custom Hooks
- `useAuth()` - Authentication state
- `useVendorMarketplace()` - Vendor operations
- `useGuestManager()` - Guest management
- `usePartyCrewBuilder()` - Crew management
- `useAdvancedFeatures()` - Advanced functionality

## Development Workflow

### Adding New Features
1. Define TypeScript types
2. Create database schema (if needed)
3. Implement custom hooks
4. Build UI components
5. Add routing
6. Write tests

### Error Handling Strategy
- Global ErrorBoundary for React errors
- Toast notifications for user feedback
- Graceful degradation for network issues
- Form validation with Zod schemas

## Deployment Architecture

### Environment Configuration
- Development: Local Supabase + Vite dev server
- Staging: Supabase staging + Preview deployment
- Production: Supabase production + Static hosting

### Build Process
```bash
npm run build → Static files → CDN deployment
```

This documentation provides a complete overview of the TPEC Events application architecture, entities, and their interactions within the system.
