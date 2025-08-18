import { View, ViewProps, StyleSheet } from 'react-native';

export function ThemedView({ pointerEvents, style, ...props }: ViewProps) {
  return (
    <View
      {...props}
      style={[
        style,
        pointerEvents && { pointerEvents } // Handle pointerEvents in style
      ].filter(Boolean)}
    />
  );
}
