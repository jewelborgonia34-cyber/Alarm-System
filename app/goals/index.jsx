import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categoryOptions = ['All', 'Digital', 'Analog', 'Smart'];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // floating menu toggle
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGoals(list);
    });

    return unsubscribe;
  }, []);

  const formatDate = (ts) => {
    if (!ts) return '';
    try {
      if (ts.toDate) return ts.toDate().toLocaleDateString();
      if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleDateString();
      return new Date(ts).toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filter === 'All') return true;
    return (g.category || '').toLowerCase() === filter.toLowerCase();
  });

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'goals', id);
              await deleteDoc(docRef);
              console.log('Alarm deleted:', id);
            } catch (error) {
              console.log('Error deleting alarm:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.goalItem}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.goalText}>{item.title || 'Untitled Alarm'}</Text>
        <Text style={styles.priceText}>{item.price ? `₱${item.price}` : ''}</Text>
      </View>

      <Text style={styles.categoryText}>Category: {item.category || 'Unspecified'}</Text>
      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

      {item.description ? <Text numberOfLines={2} style={styles.desc}>{item.description}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Products</Text>

      {/* Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterToggle} onPress={() => setFilterOpen(o => !o)}>
          <Text style={styles.filterToggleText}>{filter}</Text>
          <Text style={styles.filterToggleText}>{filterOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {filterOpen && (
          <View style={styles.filterOptions}>
            {categoryOptions.map(c => (
              <Pressable
                key={c}
                onPress={() => { setFilter(c); setFilterOpen(false); }}
                style={[styles.filterOption, filter === c && styles.activeFilterOption]}
              >
                <Text style={[styles.filterOptionText, filter === c && styles.activeFilterOptionText]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredGoals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No products yet. Add one!</Text>}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {menuOpen && (
          <>
            <TouchableOpacity style={[styles.fabOption, { backgroundColor: '#21cc8d' }]} onPress={() => {
              if (goals[0]) router.push(`/goals/edit/${goals[0].id}`);
              setMenuOpen(false);
            }}>
              <Ionicons name="create" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fabOption, { backgroundColor: 'red' }]} onPress={() => {
              if (goals[0]) handleDelete(goals[0].id);
              setMenuOpen(false);
            }}>
              <Ionicons name="trash" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fabOption, { backgroundColor: '#555' }]} onPress={() => {
              signOut(auth);
              setMenuOpen(false);
            }}>
              <Ionicons name="log-out" size={22} color="white" />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.fabMain} onPress={() => setMenuOpen(o => !o)}>
          <Ionicons name={menuOpen ? "close" : "menu"} size={26} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, textAlign: 'center', marginVertical: 16 },

  filterRow: { paddingHorizontal: 16 },
  filterToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  filterToggleText: { fontSize: 16 },
  filterOptions: { marginTop: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  filterOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterOptionText: { fontSize: 16 },
  activeFilterOption: { backgroundColor: '#007bff' },
  activeFilterOptionText: { color: '#fff' },

  goalItem: { padding: 12, marginVertical: 8, backgroundColor: '#f9f9f9', borderRadius: 8 },
  image: { width: '100%', height: 160, borderRadius: 8, marginBottom: 8 },
  goalText: { fontSize: 18, fontWeight: 'bold' },
  priceText: { fontSize: 16, color: '#21cc8d', fontWeight: '600' },
  categoryText: { marginTop: 6, color: '#555' },
  dateText: { fontSize: 12, color: '#888', marginTop: 4 },
  desc: { marginTop: 8, color: '#444' },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: 'gray' },

  // Floating Action Button styles
  fabContainer: { position: 'absolute', bottom: 30, right: 20, alignItems: 'center' },
  fabMain: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabOption: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 3 },
});
