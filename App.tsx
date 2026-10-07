/**
 * M4 · MEMBER 2 · Put the screens together and connect them to the API
 *
 * Owner (your GitHub username): @
 *
 * This file already runs: a saved delivery is added to the list with no risk
 * and "Saved on phone". Your job, after src/api.ts works and Members 1, 3 and 4
 * have merged (git pull):
 * 1. In addDelivery, make it async and call
 *        const result = await getRisk(API_URL, d.tempC, d.hours);
 *        const sent = await sendDelivery(API_URL, d);
 *    then save risk: result ? result.risk : null, and sent.
 *    (import { getRisk, sendDelivery } from './src/api';)
 * 2. Put the laptop's address in src/config.ts.
 * 3. Run on a phone (npx expo start, scan with Expo Go). Save one cold, fresh
 *    can (6 °C, 1 h) and one warm, old can (28 °C, 6 h). Take a screenshot,
 *    save it as docs/screenshot.png and push it through a pull request.
 */
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import DeliveryForm from './src/components/DeliveryForm';
import DeliveryList from './src/components/DeliveryList';
import StatusBanner from './src/components/StatusBanner';
import { API_URL } from './src/config';
import type { Delivery, NewDelivery } from './src/logic';

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  function addDelivery(d: NewDelivery) {
    // TODO M4: get the risk and send the delivery to the API (see step 1 above), then delete this line.
    const saved: Delivery = { ...d, id: String(Date.now()), risk: null, sent: false };
    setDeliveries((old) => [saved, ...old]);
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Milk Check</Text>
      <StatusBanner apiUrl={API_URL} />
      <DeliveryForm onSave={addDelivery} />
      <DeliveryList deliveries={deliveries} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginTop: 32 },
});
