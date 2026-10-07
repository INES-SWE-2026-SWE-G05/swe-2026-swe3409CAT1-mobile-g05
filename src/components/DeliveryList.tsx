
import { FlatList, Text, View } from 'react-native';
import { riskLabel, totals } from '../logic';
import type { Delivery } from '../logic';

type Props = { deliveries: Delivery[] };

export default function DeliveryList({ deliveries }: Props) {
  if (deliveries.length === 0) {
    return <Text>No deliveries yet. Use the form above.</Text>;
  }

  const t = totals(deliveries);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>
        {t.count} deliveries · {t.litres} L · {t.highRisk} high risk
      </Text>

      <FlatList
        data={deliveries}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
            }}
          >
            <Text>
              {item.farmerId} · {item.litres} L
            </Text>

            <Text>
              {riskLabel(item.risk)} ·{' '}
              {item.sent ? 'Sent' : 'Saved on phone'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

