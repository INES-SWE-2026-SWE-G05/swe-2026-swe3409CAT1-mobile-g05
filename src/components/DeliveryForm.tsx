/**
 * M2 · MEMBER 3 · The form where the collector records a can of milk
 *
 * Owner (your GitHub username): @
 * Your AI task in the swe3513-cat1 repository: A3 (model.py)
 *
 * WHAT MEMBER 3 DOES HERE
 * Four inputs, one error message, one Save button. The form never saves bad
 * input: it asks checkDelivery() (Member 4, src/logic.ts) and shows the
 * message it returns. Until Member 4 merges, pressing Save shows an error
 * "M1 ... is not written yet"; that is expected, keep building.
 *
 * Build it like this:
 *   const [farmerId, setFarmerId] = useState('');   // same for litres, tempC, hours ('' each)
 *   const [error, setError] = useState('');
 *
 *   function save() {
 *     const problem = checkDelivery(farmerId, litres, tempC, hours);
 *     if (problem) { setError(problem); return; }
 *     setError('');
 *     onSave({ farmerId: farmerId.trim().toUpperCase(), litres: Number(litres),
 *              tempC: Number(tempC), hours: Number(hours) });
 *     // then empty the four inputs
 *   }
 *
 *   Return a <View> with four <TextInput>s. Each one has: value, onChangeText,
 *   a placeholder and an accessibilityLabel; the three number inputs use
 *   keyboardType="numeric". Show {error} in a red <Text> when it is not empty,
 *   and add <Button title="Save delivery" onPress={save} />.
 *
 * Done means: no "TODO M2" left, npm run typecheck has no errors, and on the
 * phone a bad farmer code shows "Enter a farmer code like FRM-0012".
 */
import { Text, View } from 'react-native';
import type { NewDelivery } from '../logic';

type Props = { onSave: (d: NewDelivery) => void };

export default function DeliveryForm({ onSave }: Props) {
  // TODO M2: replace this placeholder (and delete this line) with the real form.
  return (
    <View>
      <Text>TODO M2: delivery form</Text>
    </View>
  );
}
