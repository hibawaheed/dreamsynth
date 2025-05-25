import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '600',
            color: Colors.text,
          },
          headerTintColor: Colors.primary,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="record"
          options={{
            title: 'Record Dream',
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="dream/[id]"
          options={{
            title: 'Dream Details',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="dream/edit/[id]"
          options={{
            title: 'Edit Dream',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="dream/process/[id]"
          options={{
            title: 'Processing Dream',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}
