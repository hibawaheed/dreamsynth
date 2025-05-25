import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Moon, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

interface EmptyDreamStateProps {
  message?: string;
}

export default function EmptyDreamState({ 
  message = "You haven't recorded any dreams yet" 
}: EmptyDreamStateProps) {
  const router = useRouter();
  
  const handleAddDream = () => {
    router.push('/record');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Moon size={64} color={Colors.primary} strokeWidth={1.5} />
      </View>
      
      <Text style={styles.message}>{message}</Text>
      
      <Text style={styles.description}>
        Record your dreams when you wake up to preserve those fleeting memories
      </Text>
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={handleAddDream}
      >
        <Plus size={20} color="white" />
        <Text style={styles.buttonText}>Record a Dream</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(107, 91, 149, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
