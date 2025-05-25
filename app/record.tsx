import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, MicOff, X, Save } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import RecordButton from '@/components/RecordButton';
import { createNewDream } from '@/utils/dreamUtils';

export default function RecordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addDream, setCurrentDream } = useDreamStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [dreamText, setDreamText] = useState('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recording = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Request audio recording permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant microphone permissions to record your dreams',
            [{ text: 'OK' }]
          );
        }
      }
    })();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
    };
  }, []);
  
  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant microphone permissions');
          return;
        }
        
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await newRecording.startAsync();
        recording.current = newRecording;
        
        setIsRecording(true);
        setRecordingDuration(0);
        
        timerRef.current = setInterval(() => {
          setRecordingDuration(prev => prev + 1);
        }, 1000);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Not Available', 'Recording is not available on web');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };
  
  const stopRecording = async () => {
    try {
      if (recording.current && Platform.OS !== 'web') {
        await recording.current.stopAndUnloadAsync();
        const uri = recording.current.getURI();
        if (uri) {
          setAudioUri(uri);
        }
        recording.current = null;
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setIsRecording(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };
  
  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    router.back();
  };
  
  const handleSave = async () => {
    if (!dreamText && !audioUri) {
      Alert.alert('Empty Dream', 'Please record or type your dream before saving');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a new dream with the recorded content
      const newDream = createNewDream(dreamText, audioUri || undefined);
      
      // Add to store
      addDream(newDream);
      
      // Set as current dream for processing
      setCurrentDream(newDream);
      
      // Navigate to processing screen
      router.replace(`/dream/process/${newDream.id}`);
    } catch (error) {
      console.error('Error saving dream:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to save your dream');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleCancel}
          >
            <X size={24} color={Colors.text} />
          </Pressable>
          
          <Text style={styles.headerTitle}>
            {isRecording ? 'Recording Dream...' : 'Record Your Dream'}
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.headerButton,
              styles.saveButton,
              pressed && styles.buttonPressed,
              (!dreamText && !audioUri) && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={(!dreamText && !audioUri) || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Save size={20} color="white" />
            )}
          </Pressable>
        </View>
        
        <View style={styles.recordingSection}>
          <Text style={styles.instructionText}>
            {isRecording 
              ? "Speak clearly about your dream..."
              : "Record or type your dream before it fades away"}
          </Text>
          
          <View style={styles.recordingControls}>
            <RecordButton 
              isRecording={isRecording}
              onPress={toggleRecording}
              size={80}
            />
            
            {isRecording && (
              <View style={styles.durationContainer}>
                <View style={styles.recordingIndicator} />
                <Text style={styles.durationText}>
                  {formatDuration(recordingDuration)}
                </Text>
              </View>
            )}
            
            {audioUri && !isRecording && (
              <View style={styles.audioPreview}>
                <Mic size={20} color={Colors.primary} />
                <Text style={styles.audioPreviewText}>Audio recorded</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            Or type your dream details:
          </Text>
          
          <TextInput
            style={styles.dreamInput}
            placeholder="I was in a strange house with many rooms..."
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
            value={dreamText}
            onChangeText={setDreamText}
          />
        </View>
        
        <Text style={styles.tipText}>
          Tip: Include as many details as you can remember, even if they seem unimportant
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  recordingControls: {
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    marginRight: 8,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 91, 149, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 16,
  },
  audioPreviewText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
  },
  dreamInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
