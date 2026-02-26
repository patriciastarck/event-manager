import { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import api from '../services/api';

export default function DashboardScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | 'add' | any>(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const data = await api.listEvents();
      setEvents(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSaved(event: any, isEdit: boolean) {
    if (isEdit) {
      setEvents((ev) => ev.map((e) => e.id === event.id ? event : e));
    } else {
      setEvents((ev) => [event, ...ev]);
    }
    setModal(null);
  }

  function handleDelete(event: any) {
    Alert.alert(
      'Excluir evento',
      `Deseja excluir "${event.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteEvent(event.id);
              setEvents((ev) => ev.filter((e) => e.id !== event.id));
            } catch (e: any) {
              Alert.alert('Erro', e.message);
            }
          },
        },
      ]
    );
  }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive',
        onPress: () => {
          api.clearToken();
          router.replace('/');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <Text style={styles.topbarIcon}>🗓</Text>
          <View>
            <Text style={styles.topbarTitle}>EventManager</Text>
            <Text style={styles.topbarSub}>Painel do Administrador</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnLogoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Header da lista */}
      <View style={styles.listHeader}>
        <View style={styles.listHeaderLeft}>
          <Text style={styles.listTitle}>Meus Eventos</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{events.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btnAdd} onPress={() => setModal('add')}>
          <Text style={styles.btnAddText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {!!error && (
        <View style={styles.alertError}>
          <Text style={styles.alertErrorText}>{error}</Text>
        </View>
      )}

      {/* Conteúdo */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#7c5cfc" size="large" />
          <Text style={styles.loadingText}>Carregando eventos...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🎭</Text>
          <Text style={styles.emptyTitle}>Nenhum evento ainda</Text>
          <Text style={styles.emptySub}>Crie seu primeiro evento para começar</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setModal('add')}>
            <Text style={styles.btnPrimaryText}>+ Criar evento</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onEdit={(e: any) => setModal(e)}
              onDelete={handleDelete}
            />
          )}
        />
      )}

      {/* Modal */}
      <EventModal
        visible={modal === 'add' || (modal && !!modal.id)}
        editing={modal === 'add' ? null : modal}
        onClose={() => setModal(null)}
        onSaved={handleSaved}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: '#ffffff12',
  },
  topbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topbarIcon: { fontSize: 26 },
  topbarTitle: { fontSize: 20, fontWeight: '800', color: '#f0f0f8' },
  topbarSub: { fontSize: 12, color: '#8888aa', marginTop: 1 },
  btnLogout: {
    borderWidth: 1, borderColor: '#ffffff12', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  btnLogoutText: { color: '#8888aa', fontSize: 14 },
  listHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  listHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listTitle: { fontSize: 17, fontWeight: '700', color: '#f0f0f8' },
  badge: {
    backgroundColor: '#7c5cfc22', borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  badgeText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  btnAdd: { backgroundColor: '#7c5cfc', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 9 },
  btnAddText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  list: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { color: '#8888aa', marginTop: 12, fontSize: 15 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#f0f0f8', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#8888aa', marginBottom: 24, textAlign: 'center' },
  btnPrimary: { backgroundColor: '#7c5cfc', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  alertError: {
    margin: 16, backgroundColor: '#fc5c7c18', borderWidth: 1,
    borderColor: '#fc5c7c44', borderRadius: 8, padding: 12,
  },
  alertErrorText: { color: '#fc5c7c', fontSize: 14 },
});
