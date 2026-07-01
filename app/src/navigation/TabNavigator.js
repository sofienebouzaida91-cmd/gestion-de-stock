import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from './TabBar';
import HomeScreen from '../screens/HomeScreen';
import StockScreen from '../screens/StockScreen';
import AlertsScreen from '../screens/AlertsScreen';
import PromosScreen from '../screens/PromosScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Promos" component={PromosScreen} />
    </Tab.Navigator>
  );
}
