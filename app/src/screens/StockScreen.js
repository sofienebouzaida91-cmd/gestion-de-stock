import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../context/InventoryContext';
import { colors, fonts, radii } from '../theme';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { SearchIcon } from '../components/Icons';

const CATEGORIES = ['Tout', 'Frais', 'Fruits & légumes', 'Épicerie', 'Boissons'];

export default function StockScreen() {
  const insets = useSafeAreaInsets();
  const { items } = useInventory();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tout');

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesCategory = category === 'Tout' || it.category === category;
      const matchesQuery = it.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, query, category]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        data={filtered}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Mon stock</Text>
            <View style={styles.searchBar}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un produit"
                placeholderTextColor={colors.textFainter}
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={CATEGORIES}
              keyExtractor={(c) => c}
              contentContainerStyle={styles.chipsRow}
              renderItem={({ item: c }) => {
                const active = c === category;
                return (
                  <Text
                    onPress={() => setCategory(c)}
                    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                  >
                    {c}
                  </Text>
                );
              }}
            />
          </>
        }
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <View style={styles.rowEmojiBox}>
              <Text style={styles.rowEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowMeta}>{item.qtyLabel}</Text>
            </View>
            <StatusBadge text={item.statusText} color={item.statusColor} bg={item.statusBg} style={{ marginTop: 0 }} />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#fff',
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, marginTop: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, fontFamily: fonts.body },
  chipsRow: { gap: 8, paddingVertical: 14, paddingBottom: 4 },
  chip: {
    flexShrink: 0, paddingVertical: 8, paddingHorizontal: 15, borderRadius: radii.round,
    fontSize: 13, fontFamily: fonts.bodyBold, overflow: 'hidden',
  },
  chipActive: { backgroundColor: colors.text, color: '#fff' },
  chipInactive: { backgroundColor: '#fff', color: colors.textMuted },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 11, marginBottom: 9, borderRadius: radii.lg },
  rowEmojiBox: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: colors.chip,
    alignItems: 'center', justifyContent: 'center',
  },
  rowEmoji: { fontSize: 22 },
  rowBody: { flex: 1 },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.text },
  rowMeta: { fontSize: 11.5, color: colors.textFainter, marginTop: 1 },
});
