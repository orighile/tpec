
import { v4 as uuidv4 } from 'uuid';
import { Message } from "../types";

export function createMessage(type: 'user' | 'bot', content: string): Message {
  return {
    id: uuidv4(),
    type,
    content,
    timestamp: new Date()
  };
}

// Speech recognition utilities
export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onEnd: () => void
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowWithSpeech = window as any;

  if (!windowWithSpeech.webkitSpeechRecognition && !windowWithSpeech.SpeechRecognition) {
    console.error("Speech recognition not supported");
    return null;
  }
  
  // Use the appropriate constructor
  const SpeechRecognitionConstructor = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
  if (!SpeechRecognitionConstructor) return null;
  
  const recognition = new SpeechRecognitionConstructor();
  
  recognition.lang = 'en-NG';  // Nigerian English
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  
  recognition.onend = () => {
    onEnd();
  };
  
  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    onEnd();
  };
  
  try {
    recognition.start();
    return recognition;
  } catch (error) {
    console.error("Error starting speech recognition:", error);
    return null;
  }
}

export function detectCurrentPage(): { page: 'general' | 'seating-chart' | 'marketplace' | 'budget' | 'guest-management' | 'checklist' | 
         'party-crew' | 'testimonials' | 'ai-recommendations' | 'vendors' | 'roadmap' } {
  // This would ideally check the actual URL or app state
  // For now we'll return a default value
  return { page: 'general' };
}

export function getRoadmapSummary() {
  // This would fetch actual roadmap data in a real application
  return {
    phaseStats: {
      total: 27,
      completed: 12,
      inProgress: 8,
      upcoming: 5,
      blocked: 2
    },
    taskCompletionRate: 44.4,
    currentFocusAreas: ["Guest Management", "Budget Tools", "Vendor Integration"],
    criticalTasksRemaining: ["Payment Processing", "Real-time Collaboration"]
  };
}
