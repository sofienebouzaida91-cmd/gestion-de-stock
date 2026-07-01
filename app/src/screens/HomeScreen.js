import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../context/InventoryContext';
import { usePromos } from '../context/PromosContext';
import { colors, fonts, radii } from '../theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { LeafIcon } from '../components/Icons';

const WEEKDAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function dateLabel() {
  const d = new Date();
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { summary, expiring, consume } = useInventory();
  const { home: promosHome } = usePromos();

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.dateLabel}>{dateLabel()}</Text>
          <Text style={styles.greeting}>Bonjour Camille</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>
      </View>

      <LinearGradient colors={[colors.green, colors.greenDark]} style={styles.hero}>
        <View style={styles.heroCircleBig} />
        <View style={styles.heroCircleSmall} />
        <View style={styles.heroLabelRow}>
          <LeafIcon />
          <Text style={styles.heroLabel}>Anti-gaspi ce mois-ci</Text>
        </View>
        <View style={styles.heroStatRow}>
          <Text style={styles.heroStatValue}>3,2</Text>
          <Text style={styles.heroStatUnit}>kg sauvés</Text>
        </View>
        <Text style={styles.heroSub}>≈ 18 € économisés · 6 produits sauvés à temps</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{summary.total}</Text>
          <Text style={styles.statLabel}>en stock</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.terracotta }]}>{summary.expiringCount}</Text>
          <Text style={styles.statLabel}>à finir vite</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.amber }]}>{summary.lowCount}</Text>
          <Text style={styles.statLabel}>stock bas</Text>
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>À consommer vite</Text>
        <Pressable onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.sectionLink}>Tout voir</Text>
        </Pressable>
      </View>
      {expiring.map((item) => (
        <Card key={item.id} style={styles.row}>
          <View style={styles.rowEmojiBox}>
            <Text style={styles.rowEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowMeta}>{item.qtyLabel}</Text>
            <StatusBadge text={item.statusText} color={item.statusColor} bg={item.statusBg} />
          </View>
          <Pressable style={styles.consumeButton} onPress={() => consume(item.id)}>
            <Text style={styles.consumeButtonText}>Consommé</Text>
          </Pressable>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bons plans pour vous</Text>
        <Pressable onPress={() => navigation.navigate('Promos')}>
          <Text style={styles.sectionLink}>Tout voir</Text>
        </Pressable>
      </View>
      {promosHome.map((p) => (
        <Card key={p.id} style={styles.row}>
          <View style={[styles.rowEmojiBox, { backgroundColor: p.color }]}>
            <Text style={styles.promoInitial}>{p.initial}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowName} numberOfLines={1}>{p.product}</Text>
            <Text style={styles.promoReason}>{p.reason}</Text>
            <Text style={styles.rowMeta}>{p.enseigne}</Text>
          </View>
          <View style={styles.offBadge}>
            <Text style={styles.offBadgeText}>{p.off}</Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.textFaint },
  greeting: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 999, backgroundColor: colors.avatarAmber,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.display, color: '#fff', fontSize: 17 },

  hero: {
    marginTop: 20, borderRadius: 24, padding: 20, overflow: 'hidden',
    shadowColor: colors.green, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.28, shadowRadius: 28, elevation: 6,
  },
  heroCircleBig: {
    position: 'absolute', right: -24, top: -24, width: 120, height: 120, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroCircleSmall: {
    position: 'absolute', right: 24, bottom: -30, width: 80, height: 80, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroLabel: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: '#fff', opacity: 0.9 },
  heroStatRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 10 },
  heroStatValue: { fontFamily: fonts.display, fontSize: 40, color: '#fff', lineHeight: 40 },
  heroStatUnit: { fontFamily: fonts.bodyBold, fontSize: 15, color: '#fff', paddingBottom: 5 },
  heroSub: { marginTop: 10, fontSize: 13, color: '#fff', opacity: 0.92 },

  statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  statCard: { flex: 1, paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', borderRadius: radii.xl },
  statValue: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  statLabel: { fontSize: 11, fontFamily: fonts.bodyBold, color: colors.textFaint, marginTop: 2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 12, marginHorizontal: 2 },
  sectionTitle: { fontFamily: fonts.displaySemi, fontSize: 18, color: colors.text },
  sectionLink: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.green },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 10, borderRadius: radii.xl },
  rowEmojiBox: {
    width: 46, height: 46, borderRadius: 13, backgroundColor: colors.chip,
    alignItems: 'center', justifyContent: 'center',
  },
  rowEmoji: { fontSize: 24 },
  rowBody: { flex: 1 },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
  rowMeta: { fontSize: 12, color: colors.textFainter, marginTop: 1 },
  consumeButton: {
    borderWidth: 1.5, borderColor: colors.green, backgroundColor: '#fff',
    borderRadius: 11, paddingVertical: 9, paddingHorizontal: 12,
  },
  consumeButtonText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.green },

  promoInitial: { fontFamily: fonts.display, color: '#fff', fontSize: 16 },
  promoReason: { fontSize: 11.5, fontFamily: fonts.bodyBold, color: colors.green, marginTop: 2 },
  offBadge: { backgroundColor: colors.terracottaBg, borderRadius: 11, paddingVertical: 8, paddingHorizontal: 10 },
  offBadgeText: { fontFamily: fonts.display, color: colors.terracotta, fontSize: 14 },
});
