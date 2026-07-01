import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../context/InventoryContext';
import { colors, fonts, radii } from '../theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { LeafIcon, ListLinesIcon } from '../components/Icons';

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { summary, expiring, low, consume, addToList } = useInventory();

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Alertes</Text>
      <Text style={styles.subtitle}>Ce qui a besoin de votre attention.</Text>

      <View style={styles.sectionHeader}>
        <LeafIcon color={colors.terracotta} size={18} />
        <Text style={styles.sectionTitle}>Périme bientôt</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.terracottaBg }]}>
          <Text style={[styles.countBadgeText, { color: colors.terracotta }]}>{summary.expiringCount}</Text>
        </View>
      </View>
      {expiring.map((item) => (
        <Card key={item.id} style={[styles.row, { borderLeftWidth: 4, borderLeftColor: item.statusColor }]}>
          <View style={styles.rowEmojiBox}>
            <Text style={styles.rowEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowName}>{item.name}</Text>
            <StatusBadge text={item.statusText} color={item.statusColor} bg={item.statusBg} />
          </View>
          <View style={styles.actionCol}>
            <Pressable style={styles.consumeButton} onPress={() => consume(item.id)}>
              <Text style={styles.consumeButtonText}>Consommé</Text>
            </Pressable>
            <Pressable style={styles.recipeButton}>
              <Text style={styles.recipeButtonText}>Recette</Text>
            </Pressable>
          </View>
        </Card>
      ))}

      <View style={[styles.sectionHeader, { marginTop: 26 }]}>
        <ListLinesIcon color={colors.amber} size={18} />
        <Text style={styles.sectionTitle}>Stock bas</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.amberBg }]}>
          <Text style={[styles.countBadgeText, { color: colors.amber }]}>{summary.lowCount}</Text>
        </View>
      </View>
      {low.map((item) => (
        <Card key={item.id} style={styles.row}>
          <View style={styles.rowEmojiBox}>
            <Text style={styles.rowEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowMeta}>Il reste {item.qtyLabel}</Text>
          </View>
          <Pressable
            style={[styles.listButton, item.addedToList ? styles.listButtonAdded : styles.listButtonDefault]}
            onPress={() => addToList(item.id)}
          >
            <Text style={[styles.listButtonText, item.addedToList ? { color: colors.greenText } : { color: '#fff' }]}>
              {item.addedToList ? '✓ Ajouté' : '+ Liste'}
            </Text>
          </Pressable>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12, marginHorizontal: 2 },
  sectionTitle: { fontFamily: fonts.displaySemi, fontSize: 17, color: colors.text },
  countBadge: { borderRadius: 999, paddingVertical: 2, paddingHorizontal: 9 },
  countBadgeText: { fontFamily: fonts.bodyExtraBold, fontSize: 12 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 10, borderRadius: radii.xl },
  rowEmojiBox: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.chip,
    alignItems: 'center', justifyContent: 'center',
  },
  rowEmoji: { fontSize: 23 },
  rowBody: { flex: 1 },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
  rowMeta: { fontSize: 12, color: colors.textFainter, marginTop: 1 },

  actionCol: { gap: 6 },
  consumeButton: { backgroundColor: colors.green, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  consumeButtonText: { fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' },
  recipeButton: { borderWidth: 1.5, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  recipeButtonText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.textMuted },

  listButton: { borderRadius: 11, paddingVertical: 10, paddingHorizontal: 13 },
  listButtonDefault: { backgroundColor: colors.amber },
  listButtonAdded: { backgroundColor: colors.greenBg },
  listButtonText: { fontFamily: fonts.bodyBold, fontSize: 12.5 },
});
