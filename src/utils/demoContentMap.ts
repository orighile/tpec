// Map of demo content locations and their implementation status
export const demoContentMap = {
  // Fully implemented with real functionality
  implemented: {
    'JaraBot': {
      file: 'src/components/jarabot/JaraBot.tsx',
      status: '✅ Real AI response system using utils/core.ts',
      replacement: 'Smart AI response generation based on context'
    },
    'Party Crew Management': {
      file: 'src/hooks/useCrewManagement.tsx', 
      status: '✅ Real CRUD operations with localStorage persistence',
      replacement: 'Full crew member management with persistence'
    },
    'Seating Chart': {
      file: 'src/hooks/useSeatingChart.tsx',
      status: '✅ Complete seating management system',
      replacement: 'Table and guest management with drag-and-drop'
    },
    'AI Recommendations': {
      file: 'src/hooks/useAIRecommendations.tsx',
      status: '✅ Intelligent recommendation engine',
      replacement: 'Context-aware AI suggestions based on event data'
    },
    'Vendor Management': {
      file: 'src/hooks/useVendors.tsx',
      status: '✅ Supabase integration for vendor CRUD',
      replacement: 'Real database operations for vendor marketplace'
    },
    'Testimonials': {
      file: 'src/components/SocialProof.tsx',
      status: '✅ Dynamic testimonials with filtering',
      replacement: 'Real testimonials management system'
    }
  },

  // Still using demo/placeholder content
  pendingReplacement: {
    'Placeholder Images': {
      locations: [
        'src/components/SocialProof.tsx (/placeholder.svg)',
        'src/components/party-crew/ (avatar placeholders)',
        'src/components/vendors/ (placeholder images)',
        'Various components using /placeholder.svg'
      ],
      priority: 'Medium',
      replacement: 'Real user-uploaded images or generated avatars'
    },
    'Sample Social Media Posts': {
      locations: [
        'src/components/SocialProofGallery.tsx',
        'src/components/TrendingAlerts.tsx'
      ],
      priority: 'Low',
      replacement: 'Real social media API integration'
    },
    'Mock Analytics Data': {
      locations: [
        'src/components/analytics/',
        'src/components/dashboard/'
      ],
      priority: 'High',
      replacement: 'Real analytics data from Supabase or external APIs'
    },
    'Demo Marketing Content': {
      locations: [
        'src/components/marketing/',
        'src/components/messaging/'
      ],
      priority: 'Low',
      replacement: 'Real marketing automation and messaging features'
    }
  },

  // Content that's intentionally demo for showcase
  showcase: {
    'Vendor Sample Data': {
      file: 'src/data/vendors/vendorsList.ts',
      reason: 'Provides realistic examples for marketplace demonstration',
      action: 'Keep for demo purposes, supplement with real vendor registrations'
    },
    'Featured Events': {
      file: 'src/components/FeaturedEvents.tsx',
      reason: 'Shows app capabilities with curated examples',
      action: 'Keep as sample data while allowing real event creation'
    }
  }
};

export const getDemoContentSummary = () => {
  const implemented = Object.keys(demoContentMap.implemented).length;
  const pending = Object.keys(demoContentMap.pendingReplacement).length;
  const showcase = Object.keys(demoContentMap.showcase).length;
  
  return {
    totalItems: implemented + pending + showcase,
    implemented,
    pending,
    showcase,
    completionRate: Math.round((implemented / (implemented + pending)) * 100)
  };
};