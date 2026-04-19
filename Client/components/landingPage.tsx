// app/WelcomeScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Nosotros obtenemos el ancho de la pantalla para ajustar los logos
const { width } = Dimensions.get('window');

export default function LandingPage() {
  // Nosotros definimos la ruta de la imagen una sola vez para reutilizarla
  const imgLineas = require('../assets/images/lineasLanding.png');

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Decoración Superior */}
      <Image 
        source={imgLineas} 
        style={[styles.cornerDecoration, styles.topRight]}
        resizeMode="contain" 
      />

      {/* Logo de UpBeat ensamblado y centrado */}
      <View style={styles.mainContent}>
        {/* Ensamblado del Logo */}
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.textLogo}
          resizeMode="contain"
        />
        <Image 
          source={require('../assets/images/cronoPesas.png')} 
          style={styles.iconLogo}
          resizeMode="contain"
        />
      </View>

      {/* Decoración Inferior */}
      <Image 
        source={imgLineas} 
        style={[styles.cornerDecoration, styles.bottomLeft]}
        resizeMode="contain" 
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco limpio
  },
  // Estilo base para las imágenes de las esquinas
  cornerDecoration: {
    position: 'absolute',
    width: 180, 
    height: 180,
  },
  topRight: {
    top: 0,
    right:-30,
  },
  bottomLeft: {
    bottom: 0,
    left: -30,
    transform: [{ rotate: '180deg' }],
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center', // Centramos el bloque del logo verticalmente
    alignItems: 'center',     // Centramos horizontalmente
    paddingHorizontal: 20,
    // Aseguramos que el logo esté por encima si las esquinas crecen mucho
    zIndex: 1, 
  },
  textLogo: {
    width: width * 0.65, 
    height: 80,          
    marginBottom: 5,     
  },
  iconLogo: {
    width: width * 0.4,  
    height: width * 0.4, 
  },
});