import { View, StyleSheet } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  return (
    <View 
      style={[
        styles.background,
        { pointerEvents: 'none' }  // Move pointerEvents to style
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 5, // for Android
  },
});
