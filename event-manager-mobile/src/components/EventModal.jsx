import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, ActivityIndicator, ScrollView, Alert
} from "react-native";
import api from "../services/api";

function fromISOLocal(dt) {
  if (!dt) return "";
  return typeof dt === "string" ? dt.slice(0, 16).replace("T", " ") : "";
}

export default function EventModal({ visible, editing, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: editing?.title || "",
    date: fromISOLocal(editing?.date) || "",
    location: editing?.location || "",
    imageUrl: editing?.imageUrl || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reseta form quando abre o modal
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setError("");
    if (!form.title || !form.date || !form.location)
      return setError("Preencha título, data e localização.");

    // Converte "YYYY-MM-DD HH:mm" → "YYYY-MM-DDTHH:mm:00"
    const isoDate = form.date.trim().replace(" ", "T") + ":00";

    setLoading(true);
    try {
      const body = {
        title: form.title,
        date: isoDate,
        location: form.location,
        imageUrl: form.imageUrl || null,
      };
      const result = editing
        ? await api.updateEvent(editing.id, body)
        : await api.createEvent(body);
      onSaved(result, !!editing);
    } catch (e) {
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
            <Text style={styles.title}>{editing ? "Editar evento" : "Novo evento"}</Text>
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
                placeholderTextColor="#8888aa" value={form.title} onChangeText={set("title")} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>DATA E HORÁRIO</Text>
              <TextInput style={styles.input} placeholder="2025-12-31 20:00"
                placeholderTextColor="#8888aa" value={form.date} onChangeText={set("date")} />
              <Text style={styles.hint}>Formato: AAAA-MM-DD HH:mm</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>LOCALIZAÇÃO</Text>
              <TextInput style={styles.input} placeholder="Endereço ou local"
                placeholderTextColor="#8888aa" value={form.location} onChangeText={set("location")} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>URL DA IMAGEM (OPCIONAL)</Text>
              <TextInput style={styles.input} placeholder="https://..."
                placeholderTextColor="#8888aa" autoCapitalize="none"
                value={form.imageUrl} onChangeText={set("imageUrl")} />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
                <Text style={styles.btnGhostText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleSave} disabled={loading}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnPrimaryText}>{editing ? "Salvar" : "Criar"}</Text>
                }
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "#000000aa",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#12121a", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: "90%",
  },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#f0f0f8" },
  closeBtn: {
    backgroundColor: "#1a1a26", borderWidth: 1, borderColor: "#ffffff12",
    borderRadius: 8, width: 32, height: 32, alignItems: "center", justifyContent: "center",
  },
  closeBtnText: { color: "#8888aa", fontSize: 14 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: "#8888aa", fontWeight: "600", letterSpacing: 1, marginBottom: 7 },
  input: {
    backgroundColor: "#1a1a26", borderWidth: 1, borderColor: "#ffffff12",
    borderRadius: 10, padding: 13, color: "#f0f0f8", fontSize: 15,
  },
  hint: { fontSize: 11, color: "#8888aa", marginTop: 4 },
  alertError: {
    backgroundColor: "#fc5c7c18", borderWidth: 1, borderColor: "#fc5c7c44",
    borderRadius: 8, padding: 12, marginBottom: 14,
  },
  alertErrorText: { color: "#fc5c7c", fontSize: 14 },
  footer: { flexDirection: "row", gap: 12, marginTop: 8, marginBottom: 8 },
  btnGhost: {
    flex: 1, borderWidth: 1, borderColor: "#ffffff12",
    borderRadius: 10, padding: 13, alignItems: "center",
  },
  btnGhostText: { color: "#8888aa", fontSize: 15, fontWeight: "500" },
  btnPrimary: {
    flex: 1, backgroundColor: "#7c5cfc",
    borderRadius: 10, padding: 13, alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
