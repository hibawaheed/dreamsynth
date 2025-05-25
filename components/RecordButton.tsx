import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Pressable, Animated, Text } from 'react-native';
import { Mic } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  size?: number;
}

export default function RecordButton({ 
  isRecording, 
  onPress, 
  size = 64 
}: RecordButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;
    
    if (isRecording) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isRecording, pulseAnim]);
  
  return (
    <View style={styles.container}>
      {isRecording && (
        <Animated.View 
          style={[
            styles.pulseCircle,
            {
              width: size * 1.5,
              height: size * 1.5,
              borderRadius: size * 1.5 / 2,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isRecording ? Colors.error : Colors.primary,
          },
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
      >
        <Mic 
          size={size / 2} 
          color="white" 
          strokeWidth={2.5}
        />
      </Pressable>
      
      <Text style={styles.label}>
        {isRecording ? 'Recording...' : 'Record Dream'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
});
