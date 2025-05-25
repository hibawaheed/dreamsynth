import React from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Bell, Trash2, HelpCircle, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useDreamStore } from '@/store/dreamStore';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { dreams, clearCurrentDream } = useDreamStore();
  const [morningMode, setMorningMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(false);
  const [autoProcess, setAutoProcess] = React.useState(true);
  
  const handleClearAllDreams = () => {
    Alert.alert(
      "Clear All Dreams",
      "Are you sure you want to delete all your dreams? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            // This would need to be implemented in the store
            Alert.alert("Not Implemented", "This feature is not yet implemented.");
          }
        }
      ]
    );
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    control: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {control}
    </View>
  );
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        {renderSettingItem(
          <Moon size={24} color={Colors.primary} />,
          "Morning Mode",
          "Simplified interface for when you're still groggy",
          <Switch
            value={morningMode}
            onValueChange={setMorningMode}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="white"
          />
        )}
        
        {renderSettingItem(
          <Bell size={24} color={Colors.primary} />,
          "Dream Reminders",
          "Get notifications to record your dreams",
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="white"
          />
        )}
        
        {renderSettingItem(
          <Info size={24} color={Colors.primary} />,
          "Auto-Process Dreams",
          "Automatically enhance dreams with AI",
          <Switch
            value={autoProcess}
            onValueChange={setAutoProcess}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="white"
          />
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <Pressable
          style={({ pressed }) => [
            styles.dangerButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleClearAllDreams}
          disabled={dreams.length === 0}
        >
          <Trash2 size={20} color={Colors.error} />
          <Text style={styles.dangerButtonText}>Clear All Dreams</Text>
        </Pressable>
        
        <Text style={styles.dataStats}>
          {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'} stored
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        {renderSettingItem(
          <HelpCircle size={24} color={Colors.primary} />,
          "How Dream Fixer Works",
          "Learn about the science behind dream reconstruction",
          <Text style={styles.linkText}>View</Text>
        )}
        
        <Text style={styles.versionText}>Dream Fixer v1.0.0</Text>
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
  section: {
    marginBottom: 32,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  dangerButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  dataStats: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});
