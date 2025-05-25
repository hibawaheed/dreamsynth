import { Dream, DreamMood, DreamSurrealLevel } from '@/types/dream';

// Generate a unique ID for dreams
export const generateDreamId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Get a short excerpt from dream content
export const getDreamExcerpt = (content: string, maxLength: number = 100): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};

// Determine mood based on content analysis (placeholder for AI integration)
export const analyzeDreamMood = (content: string): DreamMood => {
  // This would be replaced with actual AI analysis
  const moods: DreamMood[] = ['happy', 'sad', 'scary', 'confusing', 'neutral'];
  return moods[Math.floor(Math.random() * moods.length)];
};

// Determine surreal level based on content analysis (placeholder for AI integration)
export const analyzeDreamSurrealLevel = (content: string): DreamSurrealLevel => {
  // This would be replaced with actual AI analysis
  const levels: DreamSurrealLevel[] = ['low', 'medium', 'high'];
  return levels[Math.floor(Math.random() * levels.length)];
};

// Create a new dream object with default values
export const createNewDream = (rawContent: string, audioUri?: string): Dream => {
  return {
    id: generateDreamId(),
    title: 'Untitled Dream',
    rawContent,
    reconstructedContent: '',
    audioUri,
    characters: [],
    symbols: [],
    mood: 'neutral',
    surrealLevel: 'medium',
    date: new Date().toISOString(),
    isProcessed: false,
  };
};
