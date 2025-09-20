import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'

const Create = () => {
  const [goal, setGoal] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Digital')
  const [image, setImage] = useState(null)
  const { createGoal } = useGoals()
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;

    await createGoal({
      title: goal,            
      progress: 0,
      userId: auth.currentUser.uid,  
      createdAt: new Date(),         
      price: price,
      description: description,
      category: category,
      image: image,   // save image URI
    })

    setGoal('')
    setPrice('')
    setDescription('')
    setCategory('Digital')
    setImage(null)
    Keyboard.dismiss()
    router.push('/goals')
  }

  // open gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add a New Product</Text>

      {/* Product Name */}
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={goal}
        onChangeText={setGoal}
      />

      {/* Price */}
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Description */}
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter product description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Category Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Digital" value="Digital" />
          <Picker.Item label="Analog" value="Analog" />
          <Picker.Item label="Smart" value="Smart" />
        </Picker>
      </View>

      {/* Image Upload */}
      <Pressable onPress={pickImage} style={styles.uploadButton}>
        <Text style={{ color: 'white' }}>
          {image ? 'Change Product Image' : 'Upload Product Image'}
        </Text>
      </Pressable>

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}

      {/* Submit */}
      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Product</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    padding: 18,
    backgroundColor: '#21cc8d',
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  }
})
