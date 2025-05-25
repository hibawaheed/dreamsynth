# dreamweaver

## Core Structure

### App Navigation & Layout
- app/_layout.tsx: The root layout that sets up the app's navigation structure using Expo Router with a Stack navigator.
- app/(tabs)/_layout.tsx: Configures the tab-based navigation with three main tabs: Home, Archive, and Settings.

### Main Screens
- app/(tabs)/index.tsx: The home screen showing recent dreams and a prominent "Record Dream" button.
- app/(tabs)/archive.tsx: Displays all saved dreams with filtering capabilities.
- app/(tabs)/settings.tsx: User preferences and app configuration options.
- app/record.tsx: The dream recording interface with voice recording and text input options.
- app/dream/[id].tsx: Detailed view of a specific dream with its reconstructed narrative and metadata.
- app/dream/process/[id].tsx: Handles the AI-powered dream enhancement process with follow-up questions.
- app/dream/edit/[id].tsx: Interface for editing dream details, mood, and surreal level.

## State Management

- store/dreamStore.ts: Central state management using Zustand, handling all dream-related data and actions:
  - Stores dreams array with persistence via AsyncStorage
  - Manages current dream being recorded/edited
  - Handles recording state and audio URI
  - Provides actions for adding, updating, and deleting dreams

## Data Types & Utilities

- types/dream.ts: TypeScript interfaces defining the Dream object structure and filter options.
- utils/dreamUtils.ts: Helper functions for dream manipulation:
  - ID generation
  - Date formatting
  - Content excerpting
  - Creating new dream objects

- utils/aiUtils.ts: AI integration functions:
  - generateFollowUpQuestions: Creates personalized questions based on dream content
  - reconstructDreamNarrative: Transforms raw dream fragments into coherent stories
  - generateDreamImagePrompt: Creates prompts for dream visualization

## UI Components

- components/DreamCard.tsx: Reusable card component displaying dream previews in lists.
- components/RecordButton.tsx: Animated recording button with visual feedback.
- components/DreamFilter.tsx: Filter interface for the dream archive.
- components/EmptyDreamState.tsx: Placeholder UI when no dreams are available.
- components/DreamSymbolTag.tsx: Visual tags for dream characters and symbols.

## Styling & Constants

- constants/colors.ts: App-wide color palette with dream-specific color mappings for moods and surreal levels.

## Key Features Implementation

1. Dream Recording:
   - Voice recording using Expo AV
   - Text input alternative
   - Saving raw dream content

2. AI Dream Enhancement:
   - Follow-up questions generation
   - Dream narrative reconstruction
   - Mood and surreal level analysis
   - Character and symbol extraction

3. Dream Archive:
   - Filtering by mood and surreal level
   - Chronological sorting
   - Visual previews with metadata

4. User Experience:
   - Dreamlike visual design with soft purples and blues
   - Intuitive navigation between recording and viewing
   - Smooth animations and transitions

The app follows a clean architecture with separation of concerns between UI components, state management, and business logic. The AI integration is handled through utility functions that communicate with an external API endpoint.
