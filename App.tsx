/**
 * App.tsx  –  Root component & screen orchestrator
 *
 * Owner (M4): @umkalsumkarim72
 *
 * Wires together:
 *  – DeliveryForm   (Member 3 / M2)
 *  – DeliveryList   (Member 1 / M3)
 *  – StatusBanner   (Member 5 / M5)
 *
 * Flow:
 *  1. On mount, ping /health via health.ts (Member 5).
 *  2. Show StatusBanner at the top.
 *  3. User fills DeliveryForm → onSave:
 *     a. Call getRisk() for a risk score.
 *     b. Attempt sendDelivery(); mark item as sent/saved.
 *     c. Prepend delivery to the list.
 */
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRisk, sendDelivery } from './src/api';
import DeliveryForm from './src/components/DeliveryForm';
import DeliveryList from './src/components/DeliveryList';
import StatusBanner from './src/components/StatusBanner';
import { checkDelivery, riskLabel } from './src/logic';
import type { Delivery, NewDelivery } from './src/logic';

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async (form: NewDelivery) => {
    setSaving(true);
    const errors = checkDelivery(form);
    if (Object.keys(errors).length) return; // form handles display

    // 1. Get risk score from server (or use local fallback 0.5)
    const riskResp = await getRisk(form);
    const score    = riskResp?.risk_score ?? 0.5;

    // 2. Try to send to server
    const sent = await sendDelivery(form, score);

    // 3. Add to local list
    const delivery: Delivery = {
      ...form,
      riskScore: score,
      riskLabel: riskLabel(score),
      sent,
    };
    setDeliveries(prev => [delivery, ...prev]);
    setSaving(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>🥛 Milk Collect</Text>
          <StatusBanner />
        </View>
        <DeliveryForm onSave={handleSave} />
        <DeliveryList deliveries={deliveries} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20, paddingBottom: 48 },
  header:    { marginBottom: 20 },
  appTitle:  { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
});
