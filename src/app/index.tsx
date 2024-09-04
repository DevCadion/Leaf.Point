import React from "react";
import { Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';

// Imports fontes.

import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_800ExtraBold,
}from "@expo-google-fonts/poppins";

//--------------------------------------------//

import{DMSans_400Regular}from "@expo-google-fonts/dm-sans";
import{DMSerifDisplay_400Regular}from "@expo-google-fonts/dm-serif-display";


//fim das importações de fontes.

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    DMSans_400Regular,
    DMSerifDisplay_400Regular,
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 24 }}>
        Test Leaf </Text>
    </View>
  );
}


