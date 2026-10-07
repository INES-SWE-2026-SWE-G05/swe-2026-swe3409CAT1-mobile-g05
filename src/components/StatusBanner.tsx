import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { checkHealth } from '../health';

type Props = { apiUrl: string };

export default function StatusBanner({ apiUrl }: Props) {
  const [status, setStatus] = useState<'checking' | 'ok' | 'offline'>('checking');
  const check = useCallback(async () => {
    setStatus('checking');
    setStatus(await checkHealth(apiUrl, 3000));
  }, [apiUrl]);

  useEffect(() => { void check(); }, [check]);

  const online = status === 'ok';
  return (
    <View accessibilityLiveRegion="polite" style={[styles.banner, online ? styles.online : status === 'offline' ? styles.offline : styles.checking]}>
      <View style={styles.statusGroup}>
        {status === 'checking' ? <ActivityIndicator color="#214E73" size="small" /> : <Text style={[styles.icon, online ? styles.onlineText : styles.offlineText]}>{online ? '✓' : '!'}</Text>}
        <View style={styles.copy}>
          <Text style={[styles.title, online ? styles.onlineText : styles.offlineText]}>{status === 'checking' ? 'Checking server…' : online ? 'Server OK' : 'Offline mode'}</Text>
          {status === 'offline' ? <Text style={styles.caption}>Deliveries stay on this phone</Text> : null}
        </View>
      </View>
      <Pressable accessibilityRole="button" onPress={check} style={styles.retry}>
        <Text style={styles.retryText}>Check again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { marginHorizontal: 18, borderRadius: 14, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  online: { backgroundColor: '#E6F6EC', borderColor: '#68B985' },
  offline: { backgroundColor: '#FFF1DF', borderColor: '#EAA64B' },
  checking: { backgroundColor: '#EAF3F8', borderColor: '#91B2C5' },
  statusGroup: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { width: 24, height: 24, borderRadius: 12, textAlign: 'center', color: '#FFFFFF', fontWeight: '900', lineHeight: 24, marginRight: 9, overflow: 'hidden' },
  onlineText: { color: '#247647' }, offlineText: { color: '#9A5A14' },
  copy: { flex: 1 }, title: { fontSize: 14, fontWeight: '800' }, caption: { color: '#8B6941', fontSize: 10, marginTop: 1 },
  retry: { paddingHorizontal: 8, paddingVertical: 7 }, retryText: { color: '#214E73', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
});
