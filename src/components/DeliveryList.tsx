/**
 * M3 · MEMBER 1 · Today's deliveries, with totals
 *
 * Owner (your GitHub username): @
 * Your AI task in the swe3513-cat1 repository: A1 (data.py)
 *
 * WHAT MEMBER 1 DOES HERE
 * The collector must see every can recorded today, its risk in words and
 * whether it reached the server, plus one line of totals at the top.
 * You reuse riskLabel() and totals() from src/logic.ts (Member 4).
 *
 * Build it like this:
 *   if (deliveries.length === 0) return <Text>No deliveries yet. Use the form above.</Text>;
 *   const t = totals(deliveries);
 *   return (
 *     <View style={{ flex: 1 }}>
 *       <Text>{t.count} deliveries · {t.litres} L · {t.highRisk} high risk</Text>
 *       <FlatList
 *         data={deliveries}
 *         keyExtractor={(d) => d.id}
 *         renderItem={({ item }) => (
 *           <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
 *             <Text>{item.farmerId} · {item.litres} L</Text>
 *             <Text>{riskLabel(item.risk)} · {item.sent ? 'Sent' : 'Saved on phone'}</Text>
 *           </View>
 *         )}
 *       />
 *     </View>
 *   );
 *
 * Done means: no "TODO M3" left, npm run typecheck has no errors, and on the
 * phone saved deliveries appear with their risk word and "Sent"/"Saved on phone".
 */
import { Text, View } from 'react-native';
import type { Delivery } from '../logic';

type Props = { deliveries: Delivery[] };

export default function DeliveryList({ deliveries }: Props) {
  // TODO M3: replace this placeholder (and delete this line) with the real list.
  return (
    <View>
      <Text>TODO M3: delivery list ({deliveries.length} deliveries)</Text>
    </View>
  );
}
