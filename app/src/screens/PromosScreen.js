import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePromos } from '../context/PromosContext';
import { colors, fonts, radii } from '../theme';
import Card from '../components/Card';
import { CheckIcon } from '../components/Icons';

export default function PromosScreen() {
  const insets = useSafeAreaInsets();
  const { all: promos } = usePromos();

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Bons plans</Text>
      <Text style={styles.subtitle}>Promos en cours, choisies selon votre stock.</Text>

      {promos.map((p) => (
        <Card key={p.id} style={styles.card} radius={radii.xxl}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: p.color }]}>
              <Text style={styles.avatarText}>{p.initial}</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.product} numberOfLines={1}>{p.product}</Text>
              <Text style={styles.meta}>{p.enseigne} · {p.deal}</Text>
            </View>
            <View style={styles.offBadge}>
              <Text style={styles.offBadgeText}>{p.off}</Text>
            </View>
          </View>
          {p.linked && (
            <View style={styles.linkedBanner}>
              <CheckIcon color={colors.greenDark} size={14} strokeWidth={3} />
              <Text style={styles.linkedText}>{p.reason}</Text>
            </View>
          )}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },

  card: { padding: 14, marginTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, color: '#fff', fontSize: 16 },
  rowBody: { flex: 1 },
  product: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
  meta: { fontSize: 12, color: colors.textFainter, marginTop: 1 },
  offBadge: { backgroundColor: colors.terracottaBg, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 11 },
  offBadgeText: { fontFamily: fonts.display, fontSize: 15, color: colors.terracotta },

  linkedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 11,
    backgroundColor: colors.greenBg, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 11,
  },
  linkedText: { fontSize: 12, fontFamily: fonts.bodyBold, color: colors.greenDark },
});
