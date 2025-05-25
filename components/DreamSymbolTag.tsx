import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/colors';

interface DreamSymbolTagProps {
  text: string;
  type: 'character' | 'symbol';
}

export default function DreamSymbolTag({ text, type }: DreamSymbolTagProps) {
  return (
    <View style={[
      styles.container,
      type === 'character' ? styles.characterContainer : styles.symbolContainer
    ]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  characterContainer: {
    backgroundColor: 'rgba(107, 91, 149, 0.15)',
  },
  symbolContainer: {
    backgroundColor: 'rgba(136, 177, 217, 0.15)',
  },
  text: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
});
