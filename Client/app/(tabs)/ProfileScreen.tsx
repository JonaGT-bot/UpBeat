import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // Usamos la IP local
  const API_BASE_URL = 'http://192.168.100.3:8088'; 

  // Cargamos datos al entrar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/perfil/1`);
        const data = await res.json();
        // Si el servidor responde con datos, los ponemos en el estado
        if (data && data.name) {
          setNombre(data.name);
        }
      } catch (error: any) {
        // Imprimimos el error
        console.error("Error al cargar datos:", error.message);
      }
    };
    cargarDatos();
  }, []);

  const nosotrosGuardarCambios = async () => {
    console.log("Iniciando petición de guardado...");
    try {
      const response = await fetch(`${API_BASE_URL}/user/update/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: nombre, 
          password: password 
        }),
      });

      if (response.ok) {
        Alert.alert(
          "¡Cambios guardados!", 
          "Tu perfil de UpBeat ha sido actualizado con éxito. ✨",
          [{ text: "Excelente" }]
        );
        setIsEditingPass(false);
        setPassword(''); // Limpiamos la contraseña por seguridad
      } else {
        Alert.alert("Error", "No se pudo actualizar el perfil. Verifica el ID del usuario.");
      }
    } catch (error: any) {
      console.error("Error de conexión:", error.message);
      Alert.alert("Error de Conexión", "Asegúrate de que el servidor esté activo.");
    }
  };

  const nosotrosCambiarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso necesario", "Necesitamos acceso a tus fotos para personalizar el perfil.");
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      aspect: [1, 1],
      quality: 0.8 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['rgba(123, 31, 162, 0.1)', 'rgba(26, 35, 126, 0.1)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.gradientLine}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1A237E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      {/* Avatar Personalizable */}
      <TouchableOpacity onPress={nosotrosCambiarFoto} style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Image 
            source={image ? { uri: image } : require('../../assets/images/defaultAvatar.jpg')} 
            style={styles.avatarImage} 
          />
        </View>
        <View style={styles.editBadge}>
          <Ionicons name="camera" size={16} color="white" />
        </View>
      </TouchableOpacity>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de usuario:</Text>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input} 
            value={nombre} 
            onChangeText={setNombre} 
          />
          <TouchableOpacity onPress={nosotrosGuardarCambios} style={styles.iconAction}>
            <Ionicons name="send" size={22} color="#1A237E" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nueva Contraseña:</Text>
        <View style={[styles.inputGroup, isEditingPass && styles.inputEditing]}>
          <TextInput 
            style={styles.input} 
            value={isEditingPass ? password : "••••••••"} 
            onChangeText={setPassword}
            secureTextEntry={!isEditingPass}
            editable={isEditingPass}
            placeholder="Nueva contraseña..."
          />
          <TouchableOpacity onPress={() => setIsEditingPass(!isEditingPass)} style={styles.iconAction}>
            <Ionicons 
              name={isEditingPass ? "close-circle" : "pencil"} 
              size={22} 
              color={isEditingPass ? "#E53935" : "#1A237E"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { height: 70, justifyContent: 'center', paddingHorizontal: 15, marginTop: 10 },
  gradientLine: { position: 'absolute', left: 0, right: 0, height: 45, borderRadius: 25, marginHorizontal: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A237E', textAlign: 'center', zIndex: 1 },
  backButton: { position: 'absolute', left: 20, zIndex: 2 },
  avatarContainer: { alignSelf: 'center', marginVertical: 35 },
  avatarCircle: { width: 160, height: 160, borderRadius: 80, overflow: 'hidden', borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  avatarImage: { width: '100%', height: '100%' },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#7B1FA2', padding: 8, borderRadius: 20 },
  form: { paddingHorizontal: 25 },
  label: { fontSize: 16, color: '#64748B', marginBottom: 8, fontWeight: '600' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, marginBottom: 20 },
  inputEditing: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#6366F1' },
  input: { flex: 1, padding: 15, fontSize: 16, color: '#1E293B' },
  iconAction: { padding: 15 }
});