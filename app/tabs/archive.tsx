import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import DreamCard from '@/components/DreamCard';
import DreamFilter from '@/components/DreamFilter';
import EmptyDreamState from '@/components/EmptyDreamState';
import { Dream, DreamFilter as DreamFilterType } from '@/types/dream';

export default function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const { dreams, filter, setFilter } = useDreamStore();
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  
  // Apply filters and sort by date (newest first)
  useFocusEffect(
    useCallback(() => {
      let result = [...dreams];
      
      // Apply mood filter
      if (filter.mood) {
        result = result.filter(dream => dream.mood === filter.mood);
      }
      
      // Apply surreal level filter
      if (filter.surrealLevel) {
        result = result.filter(dream => dream.surrealLevel === filter.surrealLevel);
      }
      
      // Apply search text filter (if implemented)
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        result = result.filter(dream => 
          dream.title.toLowerCase().includes(searchLower) || 
          dream.reconstructedContent.toLowerCase().includes(searchLower) ||
          dream.rawContent.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort by date (newest first)
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFilteredDreams(result);
    }, [dreams, filter])
  );
  
  const renderDreamItem = ({ item }: { item: Dream }) => (
    <DreamCard dream={item} />
  );
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <DreamFilter 
        filter={filter} 
        onFilterChange={setFilter} 
      />
      
      {filteredDreams.length > 0 ? (
        <FlatList
          data={filteredDreams}
          renderItem={renderDreamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyDreamState 
          message={
            Object.keys(filter).length > 0
              ? "No dreams match your filters"
              : "You haven't recorded any dreams yet"
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});
