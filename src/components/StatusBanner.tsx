/**
 * M5 · MEMBER 5 · Banner: "Server OK" or "Offline"  (with src/health.ts)
 *
 * Owner (your GitHub username): @
 *
 * Build it like this:
 *   const [status, setStatus] = useState<'checking' | 'ok' | 'offline'>('checking');
 *   async function check() { setStatus('checking'); setStatus(await checkHealth(apiUrl)); }
 *   useEffect(() => { check(); }, []);
 *   Return a <View> whose background colour depends on status, with a <Text>:
 *     checking -> "Checking server..."     ok -> "Server OK"
 *     offline  -> "Offline: deliveries stay on this phone"
 *   and a <Button title="Check again" onPress={check} />.
 *   Show the status in words, not colour alone (some people cannot tell colours apart).
 *
 * Check on the phone: API running -> "Server OK". Stop the API, press
 * "Check again" -> the offline message.
 */
import { Text, View } from 'react-native';

type Props = { apiUrl: string };

export default function StatusBanner({ apiUrl }: Props) {
  // TODO M5: replace this placeholder (and delete this line) with the real banner.
  return (
    <View>
      <Text>TODO M5: server status for {apiUrl}</Text>
    </View>
  );
}
