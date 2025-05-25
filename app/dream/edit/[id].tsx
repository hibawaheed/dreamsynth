import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Save, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { DreamMood, DreamSurrealLevel } from '@/types/dream';

export default function EditDreamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dreams, updateDream, deleteDream } = useDreamStore();
  
  const dream = dreams.find(d => d.id === id);
  
  const [title, setTitle] = useState(dream?.title || '');
  const [content, setContent] = useState(dream?.reconstructedContent || dream?.rawContent || '');
  const [mood, setMood] = useState<DreamMood>(dream?.mood || 'neutral');
  const [surrealLevel, setSurrealLevel] = useState<DreamSurrealLevel>(dream?.surrealLevel || 'medium');
  
  useEffect(() => {
    if (!dream) {
      Alert.alert('Error', 'Dream not found');
      router.replace('/');
    }
  }, [dream, router]);
  
  const handleSave = () => {
    if (!dream) return;
    
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your dream');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please enter content for your dream');
      return;
    }
    
    updateDream(dream.id, {
      title,
      reconstructedContent: content,
      mood,
      surrealLevel,
    });
    
    router.back();
  };
  
  const handleDelete = () => {
    if (!dream) return;
    
    Alert.alert(
      "Delete Dream",
      "Are you sure you want to delete this dream? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteDream(dream.id);
            router.replace('/');
          }
        }
      ]
    );
  };
  
  if (!dream) {
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
          title: 'Edit Dream',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={Colors.error} />
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={handleSave}
              >
                <Save size={20} color="white" />
              </Pressable>
            </View>
          ),
        }}
      />
      
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
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Dream Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter a title for your dream"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Dream Content</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Describe your dream..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Dream Mood</Text>
            <View style={styles.optionsContainer}>
              {(['happy', 'sad', 'scary', 'confusing', 'neutral'] as DreamMood[]).map((option) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.moodOption,
                    { backgroundColor: mood === option ? Colors.dreamMood[option] : 'transparent' },
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => setMood(option)}
                >
                  <Text style={[
                    styles.moodOptionText,
                    mood === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Surreal Level</Text>
            <View style={styles.optionsContainer}>
              {(['low', 'medium', 'high'] as DreamSurrealLevel[]).map((option) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.surrealOption,
                    { backgroundColor: surrealLevel === option ? Colors.dreamSurreal[option] : 'transparent' },
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => setSurrealLevel(option)}
                >
                  <Text style={[
                    styles.surrealOptionText,
                    surrealLevel === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  headerButtons: {
    flexDirection: 'row',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  surrealOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  surrealOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 24,
  },
});
