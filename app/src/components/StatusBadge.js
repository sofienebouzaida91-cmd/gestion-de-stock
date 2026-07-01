import { StyleSheet, Text, View } from 'react-native';
import { fonts, radii } from '../theme';

export default function StatusBadge({ text, color, bg, style }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: radii.round,
  },
  text: {
    fontFamily: fonts.bodyExtraBold,
    fontSize: 11.5,
  },
});
