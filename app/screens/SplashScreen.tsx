import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const SplashScreenComponent = ({
  onFinish,
  delayBeforeAnimation = 1000, // Delay before animation starts
}: {
  onFinish: () => void;
  delayBeforeAnimation?: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity is 1

  useEffect(() => {
    const startAnimation = async () => {
      // Wait for the delay before starting animation
      await new Promise(resolve => setTimeout(resolve, delayBeforeAnimation));

      // Start the fade-out animation
      Animated.timing(fadeAnim, {
        toValue: .3, // Fade to 0 opacity
        duration: 1000, // Duration in milliseconds
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => {

        onFinish(); // Call the onFinish callback after the animation
      });
    };

    startAnimation();
  }, [fadeAnim, onFinish, delayBeforeAnimation]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim, // Apply animated opacity
        },
      ]}
    >
      <Image
        style={styles.image}
        source={require('../../assets/images/splash.png')}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

export default SplashScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: null,
  },
});