import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Dream } from '@/types/dream';
import { formatDate, getDreamExcerpt } from '@/utils/dreamUtils';

interface DreamCardProps {
  dream: Dream;
}

export default function DreamCard({ dream }: DreamCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/dream/${dream.id}`);
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{dream.title}</Text>
          <Text style={styles.date}>{formatDate(dream.date)}</Text>
        </View>
        
        <Text style={styles.excerpt} numberOfLines={2}>
          {getDreamExcerpt(dream.reconstructedContent || dream.rawContent)}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: Colors.dreamMood[dream.mood] }]}>
              <Text style={styles.tagText}>{dream.mood}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: Colors.dreamSurreal[dream.surrealLevel] }]}>
              <Text style={styles.tagText}>{dream.surrealLevel}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </View>
      </View>
      
      {dream.imageUri && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: dream.imageUri }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 8,
  },
  excerpt: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
