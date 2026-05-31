import { splashestilo } from "@/assets/SplashStyles";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
   useEffect(() => {
    setTimeout(() => {
      navigation.navigate("./login");
    }, 2000); // wait 2 seconds
  }, []);


  useEffect(() => {
    const blink = Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([
      Animated.loop(blink, { iterations: 3 }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log("it switches now");
    });
  }, []);

  return (
    <View style={splashestilo.container}>
      <Animated.Text style={[splashestilo.logo, { opacity }]}>
        Mind<Text style={splashestilo.logoBlue}>Drain</Text>
      </Animated.Text>
    </View>
  );
}