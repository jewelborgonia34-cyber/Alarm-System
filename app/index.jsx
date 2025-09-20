import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alarm-outline" size={64} color="#21cc8d" />
        <ActivityIndicator size="large" color="#21cc8d" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Loading AlarmSystem...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🔔 AlarmSystem</Text>
      <Text style={styles.subtitle}>Sell and manage alarm clocks — products, prices, images.</Text>

      {/* Navigation Cards */}
      <Link href="/goals" asChild>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="list-outline" size={28} color="#21cc8d" />
          <Text style={styles.cardText}>View Your Products</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/goals/create" asChild>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="add-circle-outline" size={28} color="#21cc8d" />
          <Text style={styles.cardText}>Add a New Product</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 12,
    width: "85%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default Home;
