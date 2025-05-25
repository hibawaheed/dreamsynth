import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Moon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';
import DreamCard from '@/components/DreamCard';
import EmptyDreamState from '@/components/EmptyDreamState';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dreams } = useDreamStore();
  
  // Get the 5 most recent dreams
  const recentDreams = [...dreams]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const handleRecordDream = () => {
    router.push('/record');
  };
  
  const handleViewAllDreams = () => {
    router.push('/archive');
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <LinearGradient
        colors={['rgba(107, 91, 149, 0.2)', 'rgba(136, 177, 217, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Good Morning</Text>
            <Text style={styles.headerTitle}>Remember your dreams?</Text>
            <Text style={styles.headerSubtitle}>
              Record and reconstruct your dreams before they fade away
            </Text>
          </View>
          
          <View style={styles.iconContainer}>
            <Moon size={40} color={Colors.primary} />
          </View>
        </View>
        
        <Pressable
          style={({ pressed }) => [
            styles.recordButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleRecordDream}
        >
          <Plus size={20} color="white" />
          <Text style={styles.recordButtonText}>Record Dream</Text>
        </Pressable>
      </LinearGradient>
      
      <View style={styles.recentDreamsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Dreams</Text>
          {dreams.length > 0 && (
            <Pressable onPress={handleViewAllDreams}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          )}
        </View>
        
        {recentDreams.length > 0 ? (
          recentDreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))
        ) : (
          <EmptyDreamState />
        )}
      </View>
    </ScrollView>
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
  header: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
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
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentDreamsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});
