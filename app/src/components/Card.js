import { StyleSheet, View } from 'react-native';
import { colors, radii, shadow } from '../theme';

export default function Card({ children, style, radius = radii.xl }) {
  return <View style={[styles.base, { borderRadius: radius }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    ...shadow.card,
  },
});
