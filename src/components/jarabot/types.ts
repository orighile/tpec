
export type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
};

export type ChatState = {
  isOpen: boolean;
  isExpanded: boolean;
  isRecording: boolean;
  isListening: boolean;
  input: string;
  messages: Message[];
};

export type PageContext = {
  page: 'general' | 'seating-chart' | 'marketplace' | 'budget' | 'guest-management' | 'checklist' | 
         'party-crew' | 'testimonials' | 'ai-recommendations' | 'vendors' | 'roadmap';
};

export type TableShape = 'round' | 'square' | 'rectangle';

export type AIRecommendation = {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  createdAt: Date;
};

export type EventTip = {
  category: string;
  content: string;
};

export type SocialProof = {
  id: string;
  name: string;
  avatarUrl: string;
  testimonial: string;
  eventType: string;
  rating: number;
};

export type VendorRating = {
  id: string;
  vendorId: string;
  userId: string;
  rating: number;
  review: string;
  createdAt: Date;
};

export type PartyCrewMember = {
  id: string;
  userId: string;
  name: string;
  role: string;
  avatarUrl?: string;
  tasks: string[];
  contact: string;
};

export type RoadmapSummary = {
  phaseStats: {
    total: number;
    completed: number;
    inProgress: number;
    upcoming: number;
    blocked: number;
  };
  taskCompletionRate: number;
  currentFocusAreas: string[];
  criticalTasksRemaining: string[];
};

export type JaraBotFeature = {
  name: string;
  status: 'available' | 'coming-soon' | 'beta';
  description: string;
};

export type JaraBotIntent = 
  | 'general-help'
  | 'roadmap-info'
  | 'feature-request'
  | 'project-status'
  | 'event-planning'
  | 'vendor-search'
  | 'budget-advice'
  | 'guest-management'
  | 'venue-selection'
  | 'vendor-recommendation'
  | 'cultural-advice'
  | 'unknown';

// Nigerian event venue type
export type NigerianEventVenue = {
  name: string;
  location: string;
  capacity: string;
  amenities: string[];
  accessibility: string;
  bestFor: string[];
  priceRange: string;
  contactInfo: string;
  description: string;
};

// Nigerian Q&A type
export type EventQA = {
  question: string;
  answer: string;
};

// Traditional ceremony type
export type TraditionalCeremony = {
  name: string;
  essentialElements: string[];
  keyPersonnel: string[];
  culturalConsiderations: string;
};

// Event schedule item type
export type EventScheduleItem = {
  time: string;
  activity: string;
};

// Budget guideline type
export type BudgetGuideline = {
  totalRange: string;
  breakdown: Record<string, string>;
  guestCount: string;
  notes: string;
};

// Add SpeechRecognition interface
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
  grammars: any;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
