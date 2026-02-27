import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import api from '../services/api';

export default function EventModal({ visible, editing, onClose, onSaved }: any) {
  const [title, setTitle] = useState(editing?.title || '');
  const [location, setLocation] = useState(editing?.location || '');
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl || '');
  const [date, setDate] = useState<Date | null>(editing?.date ? new Date(editing.date) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function formatDisplay(d: Date) {
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function toISO(d: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  async function handleSave() {
    setError('');
    if (!title || !date || !location)
      return setError('Preencha título, data e localização.');

    setLoading(true);
    try {
      const body = { title, date: toISO(date), location, imageUrl: imageUrl || null };
      const result = editing
        ? await api.updateEvent(editing.id, body)
        : await api.createEvent(body);
      onSaved(result, !!editing);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{editing ? 'Editar evento' : 'Novo evento'}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {!!error && (
              <View style={styles.alertError}>
                <Text style={styles.alertErrorText}>{error}</Text>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>TÍTULO</Text>
              <TextInput style={styles.input} placeholder="Nome do evento"
                placeholderTextColor="#8888aa" value={title} onChangeText={setTitle} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>DATA E HORÁRIO</Text>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateBtnIcon}>📅</Text>
                <Text style={[styles.dateBtnText, !date && styles.datePlaceholder]}>
                  {date ? formatDisplay(date) : 'Selecionar data e hora'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>LOCALIZAÇÃO</Text>
              <TextInput style={styles.input} placeholder="Endereço ou local"
                placeholderTextColor="#8888aa" value={location} onChangeText={setLocation} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>URL DA IMAGEM (OPCIONAL)</Text>
              <TextInput style={styles.input} placeholder="https://..."
                placeholderTextColor="#8888aa" autoCapitalize="none"
                value={imageUrl} onChangeText={setImageUrl} />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
                <Text style={styles.btnGhostText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleSave} disabled={loading}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnPrimaryText}>{editing ? 'Salvar' : 'Criar'}</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        date={date || new Date()}
        onConfirm={(selected) => { setDate(selected); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
        locale="pt_BR"
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: '#12121a', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '700', color: '#f0f0f8' },
  closeBtn: {
    backgroundColor: '#1a1a26', borderWidth: 1, borderColor: '#ffffff12',
    borderRadius: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: '#8888aa', fontSize: 14 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: '#8888aa', fontWeight: '600', letterSpacing: 1, marginBottom: 7 },
  input: {
    backgroundColor: '#1a1a26', borderWidth: 1, borderColor: '#ffffff12',
    borderRadius: 10, padding: 13, color: '#f0f0f8', fontSize: 15,
  },
  dateBtn: {
    backgroundColor: '#1a1a26', borderWidth: 1, borderColor: '#ffffff12',
    borderRadius: 10, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  dateBtnIcon: { fontSize: 18 },
  dateBtnText: { color: '#f0f0f8', fontSize: 15, flex: 1 },
  datePlaceholder: { color: '#8888aa' },
  alertError: {
    backgroundColor: '#fc5c7c18', borderWidth: 1, borderColor: '#fc5c7c44',
    borderRadius: 8, padding: 12, marginBottom: 14,
  },
  alertErrorText: { color: '#fc5c7c', fontSize: 14 },
  footer: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 8 },
  btnGhost: {
    flex: 1, borderWidth: 1, borderColor: '#ffffff12',
    borderRadius: 10, padding: 13, alignItems: 'center',
  },
  btnGhostText: { color: '#8888aa', fontSize: 15, fontWeight: '500' },
  btnPrimary: { flex: 1, backgroundColor: '#7c5cfc', borderRadius: 10, padding: 13, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});