import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { checkDelivery, isValidFarmerId } from '../logic';
import type { NewDelivery } from '../logic';

type Props = { onSave: (delivery: NewDelivery) => void | Promise<void> };
type Field = 'farmerId' | 'litres' | 'tempC' | 'hours';

export default function DeliveryForm({ onSave }: Props) {
  const [farmerId, setFarmerId] = useState('');
  const [litres, setLitres] = useState('');
  const [tempC, setTempC] = useState('');
  const [hours, setHours] = useState('');
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => ({
    farmerId: farmerId && !isValidFarmerId(farmerId.trim().toUpperCase()) ? 'Use the format FRM-0012' : '',
    litres: litres && !(Number(litres) > 0 && Number(litres) <= 60) ? 'Enter 0.1 to 60 litres' : '',
    tempC: tempC && !(Number(tempC) >= 0 && Number(tempC) <= 45) ? 'Enter a temperature from 0 to 45 °C' : '',
    hours: hours && !(Number(hours) >= 0 && Number(hours) <= 24) ? 'Enter a time from 0 to 24 hours' : '',
  }), [farmerId, litres, tempC, hours]);

  async function save() {
    setTouched({ farmerId: true, litres: true, tempC: true, hours: true });
    if (checkDelivery(farmerId, litres, tempC, hours)) return;
    setSubmitting(true);
    try {
      await onSave({ farmerId: farmerId.trim().toUpperCase(), litres: Number(litres), tempC: Number(tempC), hours: Number(hours) });
      setFarmerId(''); setLitres(''); setTempC(''); setHours(''); setTouched({});
    } finally {
      setSubmitting(false);
    }
  }

  const inputs = [
    { field: 'farmerId' as const, label: 'Farmer code', placeholder: 'FRM-0012', value: farmerId, change: setFarmerId, numeric: false },
    { field: 'litres' as const, label: 'Litres', placeholder: 'e.g. 18.5', value: litres, change: setLitres, numeric: true },
    { field: 'tempC' as const, label: 'Temperature (°C)', placeholder: 'e.g. 7', value: tempC, change: setTempC, numeric: true },
    { field: 'hours' as const, label: 'Hours since milking', placeholder: 'e.g. 1.5', value: hours, change: setHours, numeric: true },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>MILK INTAKE</Text>
      <Text style={styles.heading}>Add new delivery</Text>
      <Text style={styles.intro}>Record the can details exactly as received.</Text>
      {inputs.map((input) => {
        const error = touched[input.field]
          ? (input.value.trim() === '' ? `${input.label} is required` : errors[input.field])
          : '';
        return (
          <View key={input.field} style={styles.field}>
            <Text style={styles.label}>{input.label}</Text>
            <TextInput
              accessibilityLabel={input.label}
              autoCapitalize={input.field === 'farmerId' ? 'characters' : 'none'}
              keyboardType={input.numeric ? 'decimal-pad' : 'default'}
              onBlur={() => setTouched((old) => ({ ...old, [input.field]: true }))}
              onChangeText={(value) => {
                input.change(input.field === 'farmerId' ? value.toUpperCase() : value);
                setTouched((old) => ({ ...old, [input.field]: true }));
              }}
              placeholder={input.placeholder}
              placeholderTextColor="#8A97A0"
              style={[styles.input, error ? styles.inputError : null]}
              value={input.value}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        );
      })}
      <Pressable accessibilityRole="button" disabled={submitting} onPress={save} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, submitting && styles.buttonDisabled]}>
        {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Save delivery</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginHorizontal: 18, shadowColor: '#16324A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12, elevation: 3 },
  eyebrow: { color: '#2E8B62', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  heading: { color: '#17232D', fontSize: 22, fontWeight: '800' },
  intro: { color: '#65737E', fontSize: 13, marginTop: 4, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: '#344852', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: { height: 48, borderWidth: 1, borderColor: '#C9D5DB', borderRadius: 11, backgroundColor: '#F9FBFC', color: '#17232D', paddingHorizontal: 14, fontSize: 16 },
  inputError: { borderColor: '#C94B4B', backgroundColor: '#FFF9F9' },
  error: { color: '#B83A3A', fontSize: 12, marginTop: 5 },
  button: { height: 50, borderRadius: 11, backgroundColor: '#214E73', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  buttonPressed: { backgroundColor: '#173A57' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
