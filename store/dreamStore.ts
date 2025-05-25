import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream, DreamFilter } from '@/types/dream';

interface DreamState {
  dreams: Dream[];
  currentDream: Partial<Dream> | null;
  filter: DreamFilter;
  isRecording: boolean;
  audioUri: string | null;
  
  // Actions
  addDream: (dream: Dream) => void;
  updateDream: (id: string, updates: Partial<Dream>) => void;
  deleteDream: (id: string) => void;
  setCurrentDream: (dream: Partial<Dream> | null) => void;
  updateCurrentDream: (updates: Partial<Dream>) => void;
  setFilter: (filter: DreamFilter) => void;
  setIsRecording: (isRecording: boolean) => void;
  setAudioUri: (uri: string | null) => void;
  clearCurrentDream: () => void;
}

export const useDreamStore = create<DreamState>()(
  persist(
    (set) => ({
      dreams: [],
      currentDream: null,
      filter: {},
      isRecording: false,
      audioUri: null,
      
      addDream: (dream) => set((state) => ({ 
        dreams: [...state.dreams, dream],
        currentDream: null,
        audioUri: null
      })),
      
      updateDream: (id, updates) => set((state) => ({
        dreams: state.dreams.map((dream) => 
          dream.id === id ? { ...dream, ...updates } : dream
        )
      })),
      
      deleteDream: (id) => set((state) => ({
        dreams: state.dreams.filter((dream) => dream.id !== id)
      })),
      
      setCurrentDream: (dream) => set({ currentDream: dream }),
      
      updateCurrentDream: (updates) => set((state) => ({
        currentDream: state.currentDream ? { ...state.currentDream, ...updates } : updates
      })),
      
      setFilter: (filter) => set({ filter }),
      
      setIsRecording: (isRecording) => set({ isRecording }),
      
      setAudioUri: (audioUri) => set({ audioUri }),
      
      clearCurrentDream: () => set({ currentDream: null, audioUri: null })
    }),
    {
      name: 'dream-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ dreams: state.dreams }), // Only persist dreams array
    }
  )
);
