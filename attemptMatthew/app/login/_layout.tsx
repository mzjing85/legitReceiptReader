// app/login/layout.tsx
import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,               // full height
    justifyContent: 'center', // center vertically
    alignItems: 'center',     // center horizontally
    padding: 20,
    backgroundColor: '#fff',  // optional background color
  },
});
