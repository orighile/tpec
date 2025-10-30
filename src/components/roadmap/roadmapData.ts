
import { Phase } from "./types";

export const initialPhases: Phase[] = [
  {
    id: 1,
    name: "Foundation & Core Infrastructure",
    status: "completed",
    description: "Setting up the platform's foundation and core systems",
    timeframe: "Month 1-2",
    tasks: [
      { name: "Supabase Integration Setup", status: "completed" },
      { name: "Visual Identity Implementation", status: "completed", isCritical: true },
      { name: "User Management", status: "completed" },
      { name: "User Authentication System", status: "completed" },
      { name: "Basic Database Schema Design", status: "completed" },
      { name: "Storage Configuration for Media Files", status: "completed", riskLevel: "medium" }
    ]
  },
  {
    id: 2,
    name: "Event Creation & Management Core",
    status: "completed",
    description: "Implementing event creation and basic management features",
    timeframe: "Month 2-3",
    tasks: [
      { name: "Event Creation System", status: "completed", isCritical: true },
      { name: "Basic Planning Tools", status: "completed" },
      { name: "Vendor Directory Foundation", status: "completed" }
    ],
    dependencies: [1]
  },
  {
    id: 3,
    name: "JaraBot AI Assistant Implementation",
    status: "completed",
    description: "Developed and integrated the AI assistant with Nigerian cultural context",
    timeframe: "Month 3-5 (Completed)",
    tasks: [
      { name: "JaraBot Core Development", status: "completed", isCritical: true, riskLevel: "high" },
      { name: "JaraBot Primary Features", status: "completed" },
      { name: "JaraBot Integration Points", status: "completed" }
    ],
    dependencies: [1]
  },
  {
    id: 4,
    name: "Advanced Planning & Collaboration",
    status: "completed",
    description: "Adding tools for collaboration and advanced planning features",
    timeframe: "Month 5-6",
    tasks: [
      { name: "Enhanced Collaboration Tools", status: "completed" },
      { name: "Advanced Budget Management", status: "completed", isCritical: true },
      { name: "Timeline Management", status: "completed" }
    ],
    dependencies: [2]
  },
  {
    id: 5,
    name: "Community & Social Features",
    status: "canceled",
    description: "Implementing social and community-focused features (Canceled for this release)",
    timeframe: "Month 6-7 (Next release)",
    tasks: [
      { name: "Party Crew Builder", status: "canceled" },
      { name: "Social Proof 2.0", status: "canceled" },
      { name: "Trending Alerts", status: "canceled" }
    ],
    dependencies: [2, 4]
  },
  {
    id: 6,
    name: "Vendor Marketplace Expansion",
    status: "completed",
    description: "Expanding the vendor features and marketplace capabilities",
    timeframe: "Month 7-8",
    tasks: [
      { name: "Advanced Vendor Features", status: "completed", isCritical: true },
      { name: "Vendor Showcase", status: "completed" },
      { name: "Vendor Analytics", status: "completed", riskLevel: "medium" }
    ],
    dependencies: [2]
  },
  {
    id: 7,
    name: "Advanced Technology Features",
    status: "canceled",
    description: "Implementing cutting-edge technology features (Canceled for this release)",
    timeframe: "Month 8-9 (Next release)",
    tasks: [
      { name: "Offline-First Mode", status: "canceled", riskLevel: "high" },
      { name: "AR Venue Preview", status: "canceled", isCritical: true },
      { name: "Voice Search & Commands", status: "canceled" }
    ],
    dependencies: [3, 4]
  },
  {
    id: 8,
    name: "Gamification & Engagement",
    status: "canceled",
    description: "Adding gamification elements to increase user engagement (Canceled for this release)",
    timeframe: "Month 9-10 (Next release)",
    tasks: [
      { name: "Reward System", status: "canceled" },
      { name: "Engagement Mechanics", status: "canceled" },
      { name: "UGC Hub Enhancement", status: "canceled" }
    ],
    dependencies: [5]
  },
  {
    id: 9,
    name: "Optimization & Enhancement",
    status: "completed",
    description: "Refined platform performance, analytics capabilities, and localization for Nigerian markets",
    timeframe: "Month 10-11 (Completed)",
    tasks: [
      { 
        name: "Performance Optimization", 
        status: "completed", 
        isCritical: true,
        notes: "Improved page load times and optimized database queries for faster response times"
      },
      { 
        name: "Analytics & Insights", 
        status: "completed",
        notes: "Implemented comprehensive analytics dashboard for vendors and event planners" 
      },
      { 
        name: "Localization Refinement", 
        status: "completed", 
        riskLevel: "medium",
        notes: "Enhanced platform for Nigerian cultural contexts and local market needs" 
      }
    ],
    dependencies: [1, 2, 3, 4]
  },
  {
    id: 10,
    name: "Scale & Expansion",
    status: "canceled",
    description: "Preparing the platform for nationwide scaling and potential expansion to other West African markets (Canceled for this release)",
    timeframe: "Month 11-12+ (Next release)",
    tasks: [
      { 
        name: "API Development", 
        status: "canceled",
        notes: "Creating public APIs for third-party integrations and partners" 
      },
      { 
        name: "Advanced AI Enhancements", 
        status: "canceled", 
        riskLevel: "high",
        notes: "Implementing AI-driven recommendations and predictive event planning features" 
      },
      { 
        name: "Market Expansion Support", 
        status: "canceled", 
        isCritical: true,
        notes: "Building infrastructure to support expansion to other Nigerian cities and potentially Ghana" 
      }
    ],
    dependencies: [9]
  }
];
