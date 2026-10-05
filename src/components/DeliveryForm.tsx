/**
 * M2 · MEMBER 3 · Delivery entry form
 *
 * Owner (GitHub): @souleymanyayagouni
 * AI task       : A3 (model.py) in swe3513-cat1 repository
 *
 * 4 inputs with numeric keypads:
 *   – Farmer ID          (text, pattern FRM-NNNN)
 *   – Litres             (number, must be > 0)
 *   – Temperature °C     (number, range 0–45)
 *   – Hours since milking (number, range 0–24)
 *
 * Inline validation errors appear on blur.
 * "Save Delivery" button is enabled only when all inputs are valid.
 * onSave() is called with a typed NewDelivery object.
 */
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { checkDelivery } from '../logic';
import type { NewDelivery } from '../logic';

type Field = keyof NewDelivery;
type Errors = Partial<Record<Field, string>>;
type Touched = Partial<Record<Field, boolean>>;

const INITIAL: NewDelivery = {
  farmerId: '',
  litres: 0,
  tempC: 0,
  hoursSinceMilking: 0,
};

type Props = { onSave: (delivery: NewDelivery) => void };

export default function DeliveryForm({ onSave }: Props) {
  const [form,    setForm]    = useState<NewDelivery>(INITIAL);
  const [touched, setTouched] = useState<Touched>({});
  const [errors,  setErrors]  = useState<Errors>({});

  // Validate all fields; returns true when clean
  const validate = useCallback((current: NewDelivery): boolean => {
    const errs = checkDelivery(current);
    setErrors(errs as Errors);
    return Object.keys(errs).length === 0;
  }, []);

  const handleChange = (field: Field, raw: string) => {
    const updated: NewDelivery = {
      ...form,
      [field]: field === 'farmerId' ? raw.trim().toUpperCase() : parseFloat(raw) || 0,
    };
    setForm(updated);
    if (touched[field]) validate(updated);
  };

  const handleBlur = (field: Field) => {
    setTouched(t => ({ ...t, [field]: true }));
    validate(form);
  };

  const handleSubmit = () => {
    const allTouched: Touched = { farmerId: true, litres: true, tempC: true, hoursSinceMilking: true };
    setTouched(allTouched);
    if (validate(form)) {
      onSave(form);
      setForm(INITIAL);
      setTouched({});
      setErrors({});
    }
  };

  const isValid = Object.keys(checkDelivery(form)).length === 0;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.heading}>New Delivery</Text>

        <Field
          label="Farmer ID"
          placeholder="FRM-0001"
          value={form.farmerId}
          onChangeText={t => handleChange('farmerId', t)}
          onBlur={() => handleBlur('farmerId')}
          error={touched.farmerId ? errors.farmerId : undefined}
          keyboardType="default"
          autoCapitalize="characters"
        />

        <Field
          label="Litres"
          placeholder="e.g. 25.5"
          value={form.litres ? String(form.litres) : ''}
          onChangeText={t => handleChange('litres', t)}
          onBlur={() => handleBlur('litres')}
          error={touched.litres ? errors.litres : undefined}
          keyboardType="decimal-pad"
        />

        <Field
          label="Temperature (°C)"
          placeholder="0 – 45"
          value={form.tempC ? String(form.tempC) : ''}
          onChangeText={t => handleChange('tempC', t)}
          onBlur={() => handleBlur('tempC')}
          error={touched.tempC ? errors.tempC : undefined}
          keyboardType="decimal-pad"
        />

        <Field
          label="Hours since milking"
          placeholder="0 – 24"
          value={form.hoursSinceMilking ? String(form.hoursSinceMilking) : ''}
          onChangeText={t => handleChange('hoursSinceMilking', t)}
          onBlur={() => handleBlur('hoursSinceMilking')}
          error={touched.hoursSinceMilking ? errors.hoursSinceMilking : undefined}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>💾  Save Delivery</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Internal field component ─────────────────────────────────
type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  onBlur: () => void;
  error?: string;
  keyboardType?: TextInput['props']['keyboardType'];
  autoCapitalize?: TextInput['props']['autoCapitalize'];
};

function Field({ label, placeholder, value, onChangeText, onBlur, error, keyboardType, autoCapitalize }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'none'}
        returnKeyType="done"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card:           { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  heading:        { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  field:          { marginBottom: 14 },
  label:          { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input:          { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 15, color: '#1e293b', backgroundColor: '#f8fafc' },
  inputError:     { borderColor: '#ef4444' },
  error:          { color: '#ef4444', fontSize: 12, marginTop: 4 },
  button:         { backgroundColor: '#3b82f6', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#93c5fd' },
  buttonText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
