import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

function formatDate(dt) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return dt; }
}

export default function EventCard({ event, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderIcon}>🎉</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaItem}>📅  {formatDate(event.date)}</Text>
          <Text style={styles.metaItem}>📍  {event.location}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(event)}>
            <Text style={styles.btnEditText}>✏️  Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDelete} onPress={() => onDelete(event)}>
            <Text style={styles.btnDeleteText}>🗑  Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#12121a", borderWidth: 1, borderColor: "#ffffff12",
    borderRadius: 16, overflow: "hidden", marginBottom: 16,
  },
  image: { width: "100%", height: 180 },
  imagePlaceholder: {
    width: "100%", height: 160,
    backgroundColor: "#1a1a2e", alignItems: "center", justifyContent: "center",
  },
  imagePlaceholderIcon: { fontSize: 48 },
  body: { padding: 16 },
  title: { fontSize: 17, fontWeight: "700", color: "#f0f0f8", marginBottom: 10 },
  meta: { gap: 5, marginBottom: 14 },
  metaItem: { fontSize: 13, color: "#8888aa" },
  actions: { flexDirection: "row", gap: 10 },
  btnEdit: {
    flex: 1, backgroundColor: "#1a1a26", borderWidth: 1, borderColor: "#ffffff12",
    borderRadius: 8, padding: 9, alignItems: "center",
  },
  btnEditText: { color: "#a78bfa", fontSize: 13, fontWeight: "500" },
  btnDelete: {
    flex: 1, borderWidth: 1, borderColor: "#fc5c7c33",
    borderRadius: 8, padding: 9, alignItems: "center",
  },
  btnDeleteText: { color: "#fc5c7c", fontSize: 13, fontWeight: "500" },
});
