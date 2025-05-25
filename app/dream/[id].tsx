import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Pressable,
  Share,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Edit2, Share2, Calendar, Moon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import { formatDate } from '@/utils/dreamUtils';
import DreamSymbolTag from '@/components/DreamSymbolTag';

export default function DreamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dreams } = useDreamStore();
  
  // Find the dream by ID
  const dream = dreams.find(d => d.id === id);
  
  if (!dream) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Dream not found</Text>
      </View>
    );
  }
  
  const handleEdit = () => {
    router.push(`/dream/edit/${dream.id}`);
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        title: dream.title,
        message: `${dream.title}\n\n${dream.reconstructedContent}\n\nShared from Dream Fixer`,
      });
    } catch (error) {
      console.error('Error sharing dream:', error);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: dream.title,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={handleEdit}
              >
                <Edit2 size={20} color={Colors.primary} />
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && styles.buttonPressed
                ]}
                onPress={handleShare}
              >
                <Share2 size={20} color={Colors.primary} />
              </Pressable>
            </View>
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
        <View style={styles.metaInfo}>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={Colors.textLight} />
            <Text style={styles.dateText}>{formatDate(dream.date)}</Text>
          </View>
          
          <View style={[
            styles.moodBadge, 
            { backgroundColor: Colors.dreamMood[dream.mood] }
          ]}>
            <Moon size={14} color="white" />
            <Text style={styles.moodText}>{dream.mood}</Text>
          </View>
        </View>
        
        {dream.imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: dream.imageUri }}
              style={styles.dreamImage}
              contentFit="cover"
            />
          </View>
        )}
        
        <Text style={styles.dreamContent}>
          {dream.reconstructedContent || dream.rawContent}
        </Text>
        
        {(dream.characters.length > 0 || dream.symbols.length > 0) && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Key Elements</Text>
            
            <View style={styles.tagsContainer}>
              {dream.characters.map((character, index) => (
                <DreamSymbolTag 
                  key={`char-${index}`} 
                  text={character} 
                  type="character" 
                />
              ))}
              
              {dream.symbols.map((symbol, index) => (
                <DreamSymbolTag 
                  key={`sym-${index}`} 
                  text={symbol} 
                  type="symbol" 
                />
              ))}
            </View>
          </View>
        )}
        
        {dream.rawContent && dream.reconstructedContent && (
          <View style={styles.originalSection}>
            <Text style={styles.sectionTitle}>Original Recording</Text>
            <Text style={styles.originalText}>{dream.rawContent}</Text>
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
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 91, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 6,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(107, 91, 149, 0.1)',
  },
  dreamImage: {
    width: '100%',
    height: '100%',
  },
  dreamContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  originalSection: {
    padding: 16,
    backgroundColor: 'rgba(107, 91, 149, 0.05)',
    borderRadius: 12,
    marginBottom: 24,
  },
  originalText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 24,
  },
});
