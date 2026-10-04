/**
 * M3 · MEMBER 1 · Delivery list screen
 *
 * Owner (GitHub): @parvinehuguetteissimbi
 * AI task       : A1 (data.py) in swe3513-cat1 repository
 *
 * Shows today's deliveries with:
 *  – status badge   : "Sent" (green) or "Saved on phone" (amber)
 *  – risk label     : LOW / MEDIUM / HIGH coloured chips
 *  – total litres summary bar at the top
 *
 * Done means: all items render, badges are correct colour, summary
 * updates when a new delivery is saved.
 */
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { riskLabel, totals } from '../logic';
import type { Delivery } from '../logic';

type Props = { deliveries: Delivery[] };

// ── Status badge ────────────────────────────────────────────
function StatusBadge({ sent }: { sent: boolean }) {
  return (
    <View style={[styles.badge, sent ? styles.badgeSent : styles.badgeSaved]}>
      <Text style={styles.badgeText}>{sent ? 'Sent' : 'Saved on phone'}</Text>
    </View>
  );
}

// ── Risk chip ────────────────────────────────────────────────
function RiskChip({ risk }: { risk: string }) {
  const colour =
    risk === 'HIGH' ? '#ef4444' : risk === 'MEDIUM' ? '#f59e0b' : '#22c55e';
  return (
    <View style={[styles.riskChip, { backgroundColor: colour + '22', borderColor: colour }]}>
      <Text style={[styles.riskText, { color: colour }]}>{risk}</Text>
    </View>
  );
}

// ── Row ──────────────────────────────────────────────────────
function DeliveryRow({ item }: { item: Delivery }) {
  const risk = riskLabel(item.riskScore ?? 0);
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.farmerId}>{item.farmerId}</Text>
        <Text style={styles.meta}>{item.litres.toFixed(1)} L · {item.tempC}°C · {item.hoursSinceMilking}h</Text>
      </View>
      <View style={styles.rowRight}>
        <RiskChip risk={risk} />
        <StatusBadge sent={item.sent ?? false} />
      </View>
    </View>
  );
}

// ── Main component ───────────────────────────────────────────
export default function DeliveryList({ deliveries }: Props) {
  const summary = totals(deliveries);

  return (
    <View style={styles.section}>
      {/* Summary bar */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.eyebrow}>TODAY</Text>
          <Text style={styles.heading}>Recent deliveries</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{summary.count}</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryValue}>{summary.litres} L</Text>
          <Text style={styles.summaryLabel}>Total milk</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.summaryValue}>{summary.rejected}</Text>
          <Text style={styles.summaryLabel}>Rejected</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.summaryValue}>{summary.highRisk}</Text>
          <Text style={styles.summaryLabel}>High risk</Text>
        </View>
      </View>

      {/* List */}
      {deliveries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No deliveries recorded today</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <DeliveryRow item={item} />}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  section:       { marginTop: 8 },
  titleRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  eyebrow:       { fontSize: 11, fontWeight: '600', color: '#64748b', letterSpacing: 1 },
  heading:       { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  countBadge:    { backgroundColor: '#3b82f6', borderRadius: 14, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  countText:     { color: '#fff', fontSize: 13, fontWeight: '700' },
  summary:       { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 12 },
  summaryValue:  { fontSize: 20, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  summaryLabel:  { fontSize: 12, color: '#64748b', textAlign: 'center' },
  divider:       { width: 1, backgroundColor: '#e2e8f0' },
  row:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  rowLeft:       { flex: 1 },
  rowRight:      { alignItems: 'flex-end', gap: 4 },
  farmerId:      { fontSize: 14, fontWeight: '600', color: '#334155' },
  meta:          { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  badge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeSent:     { backgroundColor: '#dcfce7' },
  badgeSaved:    { backgroundColor: '#fef9c3' },
  badgeText:     { fontSize: 11, fontWeight: '600', color: '#334155' },
  riskChip:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  riskText:      { fontSize: 11, fontWeight: '700' },
  empty:         { alignItems: 'center', paddingVertical: 32 },
  emptyText:     { color: '#94a3b8', fontSize: 14 },
});
