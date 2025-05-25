import { Dream } from '@/types/dream';

// Function to generate follow-up questions based on dream content
export const generateFollowUpQuestions = async (dreamContent: string): Promise<string[]> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert dream analyst. Generate 3 follow-up questions to help the user remember more details about their dream. The questions should be specific to the content they shared and help clarify vague parts or expand on interesting elements. Keep questions concise and focused.'
          },
          {
            role: 'user',
            content: `Here's my dream: ${dreamContent}`
          }
        ]
      }),
    });

    const data = await response.json();
    // Parse the response to extract questions
    const questions = data.completion
      .split(/\d+\./)
      .filter(Boolean)
      .map((q: string) => q.trim());
    
    return questions.length ? questions : [
      "What emotions did you feel during this dream?",
      "Were there any specific colors or visual details you remember?",
      "Did the dream remind you of anything from your waking life?"
    ];
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    // Fallback questions if API fails
    return [
      "What emotions did you feel during this dream?",
      "Were there any specific colors or visual details you remember?",
      "Did the dream remind you of anything from your waking life?"
    ];
  }
};

// Function to reconstruct dream narrative
export const reconstructDreamNarrative = async (
  rawContent: string, 
  additionalDetails: string = ''
): Promise<Partial<Dream>> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert dream interpreter and creative writer. Your task is to take a user\'s fragmented dream description and transform it into a cohesive, engaging narrative. Also identify a title, key characters, and possible symbolism. Format your response as JSON with the following structure: {"title": "Dream Title", "reconstructedContent": "Full narrative...", "characters": ["Character 1", "Character 2"], "symbols": ["Symbol 1", "Symbol 2"], "mood": "happy|sad|scary|confusing|neutral", "surrealLevel": "low|medium|high"}'
          },
          {
            role: 'user',
            content: `Here's my dream: ${rawContent}${additionalDetails ? `\n\nAdditional details: ${additionalDetails}` : ''}`
          }
        ]
      }),
    });

    const data = await response.json();
    
    try {
      // Try to parse the JSON response
      const parsedResponse = JSON.parse(data.completion);
      return {
        title: parsedResponse.title,
        reconstructedContent: parsedResponse.reconstructedContent,
        characters: parsedResponse.characters || [],
        symbols: parsedResponse.symbols || [],
        mood: parsedResponse.mood || 'neutral',
        surrealLevel: parsedResponse.surrealLevel || 'medium',
        isProcessed: true
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to using the raw response
      return {
        title: 'Mysterious Dream',
        reconstructedContent: data.completion,
        characters: [],
        symbols: [],
        mood: 'neutral',
        surrealLevel: 'medium',
        isProcessed: true
      };
    }
  } catch (error) {
    console.error('Error reconstructing dream narrative:', error);
    throw error;
  }
};

// Function to generate dream image description
export const generateDreamImagePrompt = async (dreamContent: string): Promise<string> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating 8-bit pixel art descriptions. Create a concise description (max 50 words) for an 8-bit pixel art image that captures the essence of this dream. Focus on the main setting, mood, and 1-2 key elements. The description should be suitable for an image generation AI to create an 8-bit pixel art style image.'
          },
          {
            role: 'user',
            content: `Here's the dream to visualize: ${dreamContent}`
          }
        ]
      }),
    });

    const data = await response.json();
    return data.completion.trim();
  } catch (error) {
    console.error('Error generating image prompt:', error);
    return "8-bit pixel art of a dreamlike landscape with surreal elements";
  }
};
