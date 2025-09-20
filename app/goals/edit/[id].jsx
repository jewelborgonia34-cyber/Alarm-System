import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Keyboard, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const EditGoal = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Digital");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setPrice(data.price ? String(data.price) : "");
          setDescription(data.description || "");
          setCategory(data.category || "Digital");
          setImage(data.image || null);
        }
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,
        price: Number(price),
        description,
        category,
        image,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.pickerWrapper}>
        <Picker selectedValue={category} onValueChange={(val) => setCategory(val)}>
          <Picker.Item label="Digital" value="Digital" />
          <Picker.Item label="Analog" value="Analog" />
          <Picker.Item label="Smart" value="Smart" />
        </Picker>
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Pressable onPress={pickImage} style={[styles.button, { backgroundColor: "#007bff" }]}>
        <Text style={styles.buttonText}>{image ? "Change Image" : "Upload Image"}</Text>
      </Pressable>

      <Pressable onPress={handleUpdate} style={[styles.button, { backgroundColor: "#21cc8d" }]}>
        <Text style={styles.buttonText}>Update Product</Text>
      </Pressable>
    </View>
  );
};

export default EditGoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  pickerWrapper: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    marginTop: 15,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
