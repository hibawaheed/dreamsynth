import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { X, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { DreamFilter as DreamFilterType, DreamMood, DreamSurrealLevel } from '@/types/dream';

interface DreamFilterProps {
  filter: DreamFilterType;
  onFilterChange: (filter: DreamFilterType) => void;
}

export default function DreamFilter({ filter, onFilterChange }: DreamFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const moods: DreamMood[] = ['happy', 'sad', 'scary', 'confusing', 'neutral'];
  const surrealLevels: DreamSurrealLevel[] = ['low', 'medium', 'high'];
  
  const toggleFilter = () => {
    setIsExpanded(!isExpanded);
  };
  
  const setMood = (mood: DreamMood | undefined) => {
    onFilterChange({ ...filter, mood });
  };
  
  const setSurrealLevel = (surrealLevel: DreamSurrealLevel | undefined) => {
    onFilterChange({ ...filter, surrealLevel });
  };
  
  const clearFilters = () => {
    onFilterChange({});
  };
  
  const hasActiveFilters = filter.mood || filter.surrealLevel;
  
  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.filterButton,
          pressed && styles.buttonPressed,
          hasActiveFilters && styles.activeFilterButton
        ]}
        onPress={toggleFilter}
      >
        <Filter size={18} color={hasActiveFilters ? 'white' : Colors.text} />
        <Text style={[
          styles.filterButtonText,
          hasActiveFilters && styles.activeFilterButtonText
        ]}>
          Filter
        </Text>
      </Pressable>
      
      {hasActiveFilters && (
        <Pressable 
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.buttonPressed
          ]}
          onPress={clearFilters}
        >
          <X size={18} color={Colors.text} />
        </Pressable>
      )}
      
      {isExpanded && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>Mood</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterOptions}
          >
            <Pressable
              style={({ pressed }) => [
                styles.filterOption,
                !filter.mood && styles.selectedFilterOption,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setMood(undefined)}
            >
              <Text style={[
                styles.filterOptionText,
                !filter.mood && styles.selectedFilterOptionText
              ]}>
                All
              </Text>
            </Pressable>
            
            {moods.map((mood) => (
              <Pressable
                key={mood}
                style={({ pressed }) => [
                  styles.filterOption,
                  { backgroundColor: filter.mood === mood ? Colors.dreamMood[mood] : 'transparent' },
                  pressed && styles.buttonPressed
                ]}
                onPress={() => setMood(mood === filter.mood ? undefined : mood)}
              >
                <Text style={[
                  styles.filterOptionText,
                  filter.mood === mood && styles.selectedFilterOptionText
                ]}>
                  {mood}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          
          <Text style={styles.filterTitle}>Surreal Level</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterOptions}
          >
            <Pressable
              style={({ pressed }) => [
                styles.filterOption,
                !filter.surrealLevel && styles.selectedFilterOption,
                pressed && styles.buttonPressed
              ]}
              onPress={() => setSurrealLevel(undefined)}
            >
              <Text style={[
                styles.filterOptionText,
                !filter.surrealLevel && styles.selectedFilterOptionText
              ]}>
                All
              </Text>
            </Pressable>
            
            {surrealLevels.map((level) => (
              <Pressable
                key={level}
                style={({ pressed }) => [
                  styles.filterOption,
                  { backgroundColor: filter.surrealLevel === level ? Colors.dreamSurreal[level] : 'transparent' },
                  pressed && styles.buttonPressed
                ]}
                onPress={() => setSurrealLevel(level === filter.surrealLevel ? undefined : level)}
              >
                <Text style={[
                  styles.filterOptionText,
                  filter.surrealLevel === level && styles.selectedFilterOptionText
                ]}>
                  {level}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activeFilterButtonText: {
    color: 'white',
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  filterPanel: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    paddingBottom: 16,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFilterOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedFilterOptionText: {
    color: 'white',
    fontWeight: '500',
  },
});
