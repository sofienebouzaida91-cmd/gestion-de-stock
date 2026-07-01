import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInventory } from '../context/InventoryContext';
import { colors, fonts } from '../theme';
import { AlertsIcon, HomeIcon, PromosIcon, ScanIcon, StockIcon } from '../components/Icons';

const TAB_META = {
  Home: { label: 'Accueil', Icon: HomeIcon },
  Stock: { label: 'Stock', Icon: StockIcon },
  Alerts: { label: 'Alertes', Icon: AlertsIcon },
  Promos: { label: 'Promos', Icon: PromosIcon },
};

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { summary } = useInventory();

  const routes = state.routes;
  const activeName = routes[state.index].name;
  const leftRoutes = routes.slice(0, 2);
  const rightRoutes = routes.slice(2);

  const renderTabButton = (route) => {
    const meta = TAB_META[route.name];
    const isActive = activeName === route.name;
    const color = isActive ? colors.text : colors.tabInactive;
    return (
      <Pressable
        key={route.name}
        onPress={() => navigation.navigate(route.name)}
        style={styles.tabButton}
      >
        <View>
          <meta.Icon color={color} />
          {route.name === 'Alerts' && summary.alertTotal > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{summary.alertTotal}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color }]}>{meta.label}</Text>
      </Pressable>
    );
  };

  return (
    <BlurView intensity={40} tint="light" style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
      <View style={styles.row}>
        {leftRoutes.map(renderTabButton)}
        <View style={styles.scanSlot}>
          <Pressable onPress={() => navigation.getParent().navigate('Scan')} style={styles.scanButton}>
            <ScanIcon />
          </Pressable>
        </View>
        {rightRoutes.map(renderTabButton)}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 999,
    backgroundColor: colors.terracotta,
    borderWidth: 1.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9.5,
    fontFamily: fonts.bodyExtraBold,
  },
  scanSlot: {
    flex: 1,
    alignItems: 'center',
  },
  scanButton: {
    width: 60,
    height: 60,
    marginTop: -30,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: colors.bg,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 6,
  },
});
