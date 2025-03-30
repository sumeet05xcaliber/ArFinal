import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export default function ImageUploader() {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  // Function to pick an image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need permission to access your media.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset.uri);
      setImageName(asset.fileName || "uploaded_image.png"); // Set image name
    }
  };

  // Function to upload the image
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No image selected", "Please select an image first.");
      return;
    }

    try {
      const response = await fetch(image);
      const blob = await response.blob(); // Convert URI to Blob

      let formData = new FormData();
      formData.append("image", blob, imageName); // Append Blob to FormData

      const uploadResponse = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await uploadResponse.json();
      console.log("Upload success:", data);
      Alert.alert("Success", "Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", "Something went wrong while uploading.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Upload Image</Text>

      {/* Image Picker Button */}
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>

      {/* Display Selected Image */}
      {image && (
        <View style={{ marginTop: 16 }}>
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          <Text style={{ marginTop: 8 }}>{imageName}</Text>
        </View>
      )}

      {/* Upload Button */}
      <TouchableOpacity onPress={uploadImage} style={styles.button}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
    </View>
  );
}

// Basic styles
const styles = {
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
};
