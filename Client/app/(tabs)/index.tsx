import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Login from './login';
import HomePage from './home';

type ScreenStep = 'landing' | 'form' | 'summary' | 'login' | 'home';

type RegisteredUser = {
  id?: number;
  name: string;
  email: string;
};

const API_BASE_URL = 'http://192.168.1.9:8088';

export default function HomeScreen() {
  const [step, setStep] = useState<ScreenStep>('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function addUser() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing data', 'Please complete name, email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      const payload = await response.json();
      const userId = typeof payload === 'number' ? payload : payload?.id;

      setRegisteredUser({
        id: typeof userId === 'number' ? userId : undefined,
        name: name.trim(),
        email: email.trim(),
      });

      setName('');
      setEmail('');
      setPassword('');

      Alert.alert('Success', 'Account created! Now please log in.');
      setStep('login');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Registration error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#D9D9D9' }}> 
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
          
          {step === 'landing' && (
            <View style={styles.formContainer}>
              <ThemedText style={styles.title}>Welcome to upBeat</ThemedText>
              <TouchableOpacity style={styles.mainButton} onPress={() => setStep('form')}>
                <ThemedText style={styles.buttonText}>Get Started</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {step === 'form' && (
            <>
              <View style={styles.header}>
                <Image 
                  source={require('../../assets/images/logoUpBeat.png')}
                  style={styles.logo} 
                  resizeMode="contain"
                />
              </View>

              <View style={styles.formContainer}>
                <ThemedText style={styles.title}>Create your account!</ThemedText>
                <ThemedText style={styles.subtitle}>Start taking care of your body today</ThemedText>

                <ThemedText style={styles.label}>Username</ThemedText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                  />
                  <MaterialCommunityIcons name="account" size={24} color="#555" />
                </View>

                <ThemedText style={styles.label}>Email</ThemedText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="example@mail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                  />
                  <MaterialCommunityIcons name="email-outline" size={24} color="#555" />
                </View>

                <ThemedText style={styles.label}>Password</ThemedText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputStyle}
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} 
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={24} 
                      color="#555" 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.mainButton, loading && styles.disabledButton]}
                  onPress={addUser}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <ThemedText style={styles.buttonText}>Create account</ThemedText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep('login')}>
                  <ThemedText style={styles.linkText}>Already have an account?</ThemedText>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 'login' && (
            <Login 
              onLoginSuccess={(user: RegisteredUser) => {
                setRegisteredUser(user);
                setStep('home');
              }}
              onGoToRegister={() => setStep('form')}
            />
          )}
          
          {step === 'home' && (
            <HomePage 
              user={registeredUser} 
              onLogout={() => setStep('landing')} 
            />
          )}

        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    height: 150,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? -50 : 0, 
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  logo: {
    width: 150,
    height: 80,
  },
  formContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9', 
    opacity: 0.35,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 55,
    width: '100%',
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  mainButton: {
    backgroundColor: '#2C99FF',
    width: '100%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkText: {
    color: '#9901BF',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});