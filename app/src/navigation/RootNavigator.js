import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ScanFlowScreen from '../screens/scan/ScanFlowScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Scan" component={ScanFlowScreen} options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
