import { FlatList, StyleSheet, Text, View } from 'react-native';
import { riskLabel, totals } from '../logic';
import type { Delivery } from '../logic';

type Props = { deliveries: Delivery[] };

export default function DeliveryList({ deliveries }: Props) {
  const summary = totals(deliveries);
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.eyebrow}>TODAY</Text>
          <Text style={styles.heading}>Recent deliveries</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{summary.count}</Text></View>
      </View>
      <View style={styles.summary}>
        <View><Text style={styles.summaryValue}>{summary.litres} L</Text><Text style={styles.summaryLabel}>Total milk</Text></View>
        <View style={styles.divider} />
        <View><Text style={styles.summaryValue}>{summary.highRisk}</Text><Text style={styles.summaryLabel}>High risk</Text></View>
        <View style={styles.divider} />
        <View><Text style={styles.summaryValue}>{summary.count}</Text><Text style={styles.summaryLabel}>Deliveries</Text></View>
      </View>

      {deliveries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>◷</Text>
          <Text style={styles.emptyTitle}>No deliveries yet</Text>
          <Text style={styles.emptyCopy}>Use the form above to record today’s first milk can.</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(delivery) => delivery.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          renderItem={({ item }) => {
            const label = riskLabel(item.risk);
            const riskStyle = label === 'High' ? styles.high : label === 'Medium' ? styles.medium : label === 'Low' ? styles.low : styles.unknown;
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.farmer}>Farmer: {item.farmerId}</Text>
                    <Text style={styles.recordId}>Delivery #{item.id.slice(-6)}</Text>
                  </View>
                  <View style={[styles.pill, riskStyle]}><Text style={styles.pillText}>Risk: {label}</Text></View>
                </View>
                <View style={styles.details}>
                  <Text style={styles.detail}>◉  {item.litres} litres</Text>
                  <Text style={styles.detail}>♨  {item.tempC} °C</Text>
                  <Text style={styles.detail}>◷  {item.hours} hours</Text>
                </View>
                <View style={[styles.syncPill, item.sent ? styles.sent : styles.saved]}>
                  <Text style={styles.syncText}>{item.sent ? '✓  Sent to server' : '⌁  Saved on phone'}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 18, paddingBottom: 108 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 },
  eyebrow: { color: '#2E8B62', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  heading: { color: '#17232D', fontSize: 21, fontWeight: '800', marginTop: 2 },
  countBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#DCECF5', alignItems: 'center', justifyContent: 'center' },
  countText: { color: '#214E73', fontWeight: '800' },
  summary: { backgroundColor: '#214E73', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 14 },
  summaryValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  summaryLabel: { color: '#CFE0EC', fontSize: 11, marginTop: 3, textAlign: 'center' },
  divider: { width: 1, height: 34, backgroundColor: '#4F7290' },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 28, alignItems: 'center' },
  emptyIcon: { color: '#8BA6B5', fontSize: 28 },
  emptyTitle: { color: '#263A45', fontWeight: '800', fontSize: 16, marginTop: 6 },
  emptyCopy: { color: '#74838C', textAlign: 'center', marginTop: 5 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E1E8EC', shadowColor: '#16324A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  gap: { height: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  farmer: { color: '#17232D', fontSize: 16, fontWeight: '800' },
  recordId: { color: '#8A969D', fontSize: 11, marginTop: 3 },
  pill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { color: '#18352A', fontSize: 12, fontWeight: '700' },
  high: { backgroundColor: '#F8D8D8' }, medium: { backgroundColor: '#FBE8B8' }, low: { backgroundColor: '#D4EFDE' }, unknown: { backgroundColor: '#E3E8EB' },
  details: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 14, marginBottom: 13 },
  detail: { color: '#465A65', fontSize: 13 },
  syncPill: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  sent: { backgroundColor: '#D4EFDE' }, saved: { backgroundColor: '#DCECF5' },
  syncText: { color: '#23495D', fontSize: 12, fontWeight: '700' },
});
