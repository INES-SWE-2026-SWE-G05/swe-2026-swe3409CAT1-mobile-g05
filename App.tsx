import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import DeliveryForm from './src/components/DeliveryForm';
import DeliveryList from './src/components/DeliveryList';
import StatusBanner from './src/components/StatusBanner';
import { getRisk, sendDelivery } from './src/api';
import { API_URL } from './src/config';
import { riskLabel } from './src/logic';
import type { Delivery, NewDelivery } from './src/logic';

type Tab = 'Home' | 'Summary' | 'Profile';

export default function App() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('Home');

  async function addDelivery(delivery: NewDelivery) {
    const [result, sent] = await Promise.all([
      getRisk(API_URL, delivery.tempC, delivery.hours, 3000),
      sendDelivery(API_URL, delivery, 3000),
    ]);
    const fallbackRisk = delivery.tempC > 25 || delivery.hours > 4 ? 0.75 : 0.15;
    const saved: Delivery = { ...delivery, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, risk: result?.risk ?? fallbackRisk, sent };
    setDeliveries((current) => [saved, ...current]);
  }

  function renderContent() {
    if (activeTab === 'Home') return <><DeliveryForm onSave={addDelivery} /><DeliveryList deliveries={deliveries} /></>;
    if (activeTab === 'Summary') {
      const high = deliveries.filter((delivery) => riskLabel(delivery.risk) === 'High').length;
      const sent = deliveries.filter((delivery) => delivery.sent).length;
      return <View style={styles.placeholderCard}><Text style={styles.placeholderTitle}>Today’s summary</Text><Text style={styles.placeholderMetric}>{deliveries.length} deliveries recorded</Text><Text style={styles.placeholderCopy}>{high} high risk · {sent} sent · {deliveries.length - sent} saved locally</Text></View>;
    }
    return <View style={styles.placeholderCard}><Text style={styles.placeholderTitle}>Profile</Text><Text style={styles.placeholderCopy}>Collector profile and collection-centre details.</Text></View>;
  }

  const tabs: Array<{ name: Tab; icon: string }> = [
    { name: 'Home', icon: '⌂' }, { name: 'Summary', icon: '▤' }, { name: 'Profile', icon: '●' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brandMark}><Text style={styles.brandIcon}>K</Text></View>
            <View style={styles.brandCopy}><Text style={styles.title}>Kinigi Milk Collection Centre</Text><Text style={styles.subtitle}>INES-Ruhengeri · Milk Check</Text></View>
            <View style={styles.avatar}><Text style={styles.avatarText}>KC</Text></View>
          </View>
          <StatusBanner apiUrl={API_URL} />
          <View style={styles.contentGap}>{renderContent()}</View>
        </ScrollView>
        <View style={styles.nav}>
          {tabs.map((tab) => {
            const selected = tab.name === activeTab;
            return <Pressable accessibilityRole="tab" accessibilityState={{ selected }} key={tab.name} onPress={() => setActiveTab(tab.name)} style={styles.navItem}><Text style={[styles.navIcon, selected && styles.navSelected]}>{tab.icon}</Text><Text style={[styles.navLabel, selected && styles.navSelected]}>{tab.name}</Text>{selected ? <View style={styles.navLine} /> : null}</Pressable>;
          })}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EAF3F8' }, page: { flex: 1 },
  scrollContent: { paddingTop: Platform.OS === 'android' ? 34 : 10 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
  brandMark: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#2E8B62', borderWidth: 4, borderColor: '#CFE8DA', alignItems: 'center', justifyContent: 'center' },
  brandIcon: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' }, brandCopy: { flex: 1, marginLeft: 11 },
  title: { color: '#142631', fontSize: 17, fontWeight: '800' }, subtitle: { color: '#526873', fontSize: 12, marginTop: 2 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#D8E6ED', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#214E73', fontSize: 11, fontWeight: '800' }, contentGap: { marginTop: 16 },
  placeholderCard: { margin: 18, backgroundColor: '#FFFFFF', padding: 22, borderRadius: 18, minHeight: 180 },
  placeholderTitle: { color: '#17232D', fontSize: 22, fontWeight: '800' }, placeholderMetric: { color: '#214E73', fontSize: 25, fontWeight: '800', marginTop: 28 },
  placeholderCopy: { color: '#65737E', fontSize: 14, marginTop: 8, lineHeight: 21 },
  nav: { height: 74, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#DCE5EA', flexDirection: 'row', shadowColor: '#16324A', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }, navIcon: { color: '#75838B', fontSize: 21, fontWeight: '700' },
  navLabel: { color: '#75838B', fontSize: 11, marginTop: 3 }, navSelected: { color: '#214E73', fontWeight: '800' },
  navLine: { position: 'absolute', top: 0, width: 48, height: 3, borderRadius: 2, backgroundColor: '#214E73' },
});
