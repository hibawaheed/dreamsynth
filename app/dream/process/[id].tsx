import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { 
  generateFollowUpQuestions, 
  reconstructDreamNarrative,
  generateDreamImagePrompt
} from '@/utils/aiUtils';

export default function DreamProcessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dreams, updateDream } = useDreamStore();
  
  const [currentDream, setCurrentDream] = useState(dreams.find(d => d.id === id));
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true);
  const [isProcessingDream, setIsProcessingDream] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  useEffect(() => {
    if (!currentDream) {
      Alert.alert('Error', 'Dream not found');
      router.replace('/');
      return;
    }
    
    // Generate follow-up questions
    const generateQuestions = async () => {
      try {
        const generatedQuestions = await generateFollowUpQuestions(currentDream!.rawContent);
        setQuestions(generatedQuestions);
        setIsGeneratingQuestions(false);
      } catch (error) {
        console.error('Error generating questions:', error);
        setIsGeneratingQuestions(false);
        // Fallback questions
        setQuestions([
          "What emotions did you feel during this dream?",
          "Were there any specific colors or visual details you remember?",
          "Did the dream remind you of anything from your waking life?"
        ]);
      }
    };
    
    generateQuestions();
  }, [currentDream, router]);
  
  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      // Save the current answer
      setAnswers([...answers, currentAnswer]);
      setCurrentAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, process the dream
        processDream();
      }
    } else {
      // Skip this question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        processDream();
      }
    }
  };
  
  const processDream = async () => {
    if (!currentDream) return;
    
    setIsProcessingDream(true);
    
    try {
      // Combine all answers into additional details
      const additionalDetails = answers
        .map((answer, index) => `${questions[index]}: ${answer}`)
        .join('\n\n');
      
      // Reconstruct the dream narrative
      const dreamUpdates = await reconstructDreamNarrative(
        currentDream.rawContent,
        additionalDetails
      );
      
      // Generate image prompt if needed
      let imageUri = currentDream.imageUri;
      
      // Update the dream in the store
      updateDream(currentDream.id, {
        ...dreamUpdates,
        isProcessed: true,
      });
      
      // Navigate to the dream detail screen
      router.replace(`/dream/${currentDream.id}`);
    } catch (error) {
      console.error('Error processing dream:', error);
      setIsProcessingDream(false);
      Alert.alert(
        'Processing Error',
        'There was an error processing your dream. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const skipAllQuestions = () => {
    processDream();
  };
  
  if (!currentDream) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dream not found</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Enhancing Your Dream',
          headerRight: () => (
            <Pressable
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.buttonPressed
              ]}
              onPress={skipAllQuestions}
              disabled={isProcessingDream}
            >
              <Text style={styles.skipButtonText}>Skip All</Text>
            </Pressable>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.header}>
          <Sparkles size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>Dream Enhancement</Text>
        </View>
        
        <Text style={styles.description}>
          Let's clarify some details about your dream to create a more complete picture.
        </Text>
        
        {isGeneratingQuestions ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Analyzing your dream...</Text>
          </View>
        ) : isProcessingDream ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Reconstructing your dream...</Text>
            <Text style={styles.processingSubtext}>
              Our AI is weaving your dream fragments into a cohesive narrative
            </Text>
          </View>
        ) : (
          <View style={styles.questionContainer}>
            <Text style={styles.questionCounter}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex]}
            </Text>
            
            <TextInput
              style={styles.answerInput}
              placeholder="Your answer (optional)"
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              value={currentAnswer}
              onChangeText={setCurrentAnswer}
            />
            
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.buttonPressed
              ]}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish & Process'}
              </Text>
              <ArrowRight size={20} color="white" />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 16,
  },
  processingSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  questionContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionCounter: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    lineHeight: 24,
  },
  answerInput: {
    backgroundColor: 'rgba(107, 91, 149, 0.05)',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(107, 91, 149, 0.1)',
  },
  skipButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 24,
  },
});
