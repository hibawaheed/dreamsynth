export type DreamMood = 'happy' | 'sad' | 'scary' | 'confusing' | 'neutral';
export type DreamSurrealLevel = 'low' | 'medium' | 'high';

export interface Dream {
  id: string;
  title: string;
  rawContent: string; // Original recording/text
  reconstructedContent: string; // AI-enhanced narrative
  audioUri?: string; // Path to audio recording if available
  imageUri?: string; // Path to generated image if available
  characters: string[]; // Key characters identified
  symbols: string[]; // Possible symbolism
  mood: DreamMood;
  surrealLevel: DreamSurrealLevel;
  date: string; // ISO date string
  isProcessed: boolean; // Whether AI has processed it
}

export interface DreamFilter {
  mood?: DreamMood;
  surrealLevel?: DreamSurrealLevel;
  searchText?: string;
  dateFrom?: string;
  dateTo?: string;
}
