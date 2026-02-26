import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [savePass, setSavePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('saved_creds').then((val) => {
      if (val) {
        const { email, password } = JSON.parse(val);
        setForm((f) => ({ ...f, email, password }));
        setSavePass(true);
      }
    });
  }, []);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit() {
    setError('');

    if (mode === 'register') {
      if (!form.name || !form.email || !form.password)
        return setError('Preencha todos os campos.');
      if (form.password !== form.confirm)
        return setError('As senhas não coincidem.');
      setLoading(true);
      try {
        await api.register(form.name, form.email, form.password);
        Alert.alert('Sucesso!', 'Cadastro realizado. Faça o login.');
        setMode('login');
        setForm((f) => ({ ...f, name: '', confirm: '' }));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!form.email || !form.password)
        return setError('Preencha email e senha.');
      setLoading(true);
      try {
        const token = await api.login(form.email, form.password);
        api.setToken(token);
        if (savePass) {
          await AsyncStorage.setItem('saved_creds', JSON.stringify({ email: form.email, password: form.password }));
        } else {
          await AsyncStorage.removeItem('saved_creds');
        }
        router.replace('/dashboard');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Text style={styles.brandIcon}>🗓</Text>
          <Text style={styles.brandName}>EventManager</Text>
        </View>

        <Text style={styles.title}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Acesse seu painel de eventos' : 'Registre-se como administrador'}
        </Text>

        {!!error && (
          <View style={styles.alertError}>
            <Text style={styles.alertErrorText}>{error}</Text>
          </View>
        )}

        {mode === 'register' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>NOME</Text>
            <TextInput style={styles.input} placeholder="Seu nome completo"
              placeholderTextColor="#8888aa" value={form.name} onChangeText={set('name')} />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput style={styles.input} placeholder="admin@email.com"
            placeholderTextColor="#8888aa" keyboardType="email-address"
            autoCapitalize="none" value={form.email} onChangeText={set('email')} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>SENHA</Text>
          <TextInput style={styles.input} placeholder="••••••••"
            placeholderTextColor="#8888aa" secureTextEntry
            value={form.password} onChangeText={set('password')} />
        </View>

        {mode === 'register' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>CONFIRMAR SENHA</Text>
            <TextInput style={styles.input} placeholder="••••••••"
              placeholderTextColor="#8888aa" secureTextEntry
              value={form.confirm} onChangeText={set('confirm')} />
          </View>
        )}

        {mode === 'login' && (
          <TouchableOpacity style={styles.checkRow} onPress={() => setSavePass((v) => !v)}>
            <View style={[styles.checkbox, savePass && styles.checkboxChecked]}>
              {savePass && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>Gravar senha</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnPrimaryText}>{mode === 'login' ? 'Entrar' : 'Cadastrar-se'}</Text>
          }
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {mode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
          </Text>
          <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            <Text style={styles.footerLink}>
              {mode === 'login' ? 'Cadastrar-se' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  brandIcon: { fontSize: 28 },
  brandName: { fontSize: 22, fontWeight: '800', color: '#a78bfa' },
  title: { fontSize: 28, fontWeight: '700', color: '#f0f0f8', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#8888aa', marginBottom: 28 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 12, color: '#8888aa', fontWeight: '600', letterSpacing: 1, marginBottom: 7 },
  input: {
    backgroundColor: '#1a1a26', borderWidth: 1, borderColor: '#ffffff12',
    borderRadius: 10, padding: 13, color: '#f0f0f8', fontSize: 15,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: '#8888aa', alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#7c5cfc', borderColor: '#7c5cfc' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  checkLabel: { fontSize: 14, color: '#8888aa' },
  btnPrimary: {
    backgroundColor: '#7c5cfc', borderRadius: 10,
    padding: 14, alignItems: 'center', marginBottom: 20,
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  alertError: {
    backgroundColor: '#fc5c7c18', borderWidth: 1, borderColor: '#fc5c7c44',
    borderRadius: 8, padding: 12, marginBottom: 16,
  },
  alertErrorText: { color: '#fc5c7c', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  footerText: { color: '#8888aa', fontSize: 14 },
  footerLink: { color: '#7c5cfc', fontSize: 14, fontWeight: '600' },
});
