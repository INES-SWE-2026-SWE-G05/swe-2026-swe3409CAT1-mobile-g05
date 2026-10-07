/**
 * M5 · MEMBER 5 · Server status banner
 *
 * Owner (GitHub): @gueylo
 * AI task       : A5 (evaluate.py) in swe3513-cat1 repository
 *
 * Shows a coloured strip at the top of the screen:
 *   🟢 "Server OK"  (green)   – /health returned 200
 *   🔴 "Offline"    (red)     – /health timed out or failed
 *       + [Retry] button that triggers another ping
 *
 * Uses the useServerHealth() hook from health.ts.
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useServerHealth } from '../health';

export default function StatusBanner() {
  const { online, checking, retry } = useServerHealth();

  if (checking) {
    return (
      <View style={[styles.banner, styles.checking]}>
        <ActivityIndicator size="small" color="#64748b" />
        <Text style={[styles.text, styles.textChecking]}>  Checking server…</Text>
      </View>
    );
  }

  if (online) {
    return (
      <View style={[styles.banner, styles.online]}>
        <Text style={[styles.text, styles.textOnline]}>🟢  Server OK</Text>
      </View>
    );
  }

  return (
    <View style={[styles.banner, styles.offline]}>
      <Text style={[styles.text, styles.textOffline]}>🔴  Offline – running on local data</Text>
      <TouchableOpacity onPress={retry} style={styles.retryBtn}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  checking:     { backgroundColor: '#f1f5f9' },
  online:       { backgroundColor: '#dcfce7' },
  offline:      { backgroundColor: '#fee2e2' },
  text:         { fontSize: 13, fontWeight: '600' },
  textChecking: { color: '#64748b' },
  textOnline:   { color: '#166534' },
  textOffline:  { color: '#991b1b' },
  retryBtn:     { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  retryText:    { color: '#ef4444', fontSize: 12, fontWeight: '700' },
});
