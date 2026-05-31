import { loginestilos } from "@/assets/LoginStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotifications } from '@/components/Notifications';
import { setIaState } from "@/src/store/ia-store";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const { showToast } = useNotifications();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log("--- Início do Login ---");
    const trimmedEmail = email.trim();
    console.log("Tentando login com:", trimmedEmail);

    if (!trimmedEmail || !password) {
      console.log("Erro: Email ou senha faltando");
      const msg = "Por favor, preencha todos os campos.";
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      // Tenta usar o IP da máquina para melhor compatibilidade com dispositivos físicos
      const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
      console.log(`Conectando ao servidor: ${serverUrl}/api/login`);

      const response = await fetch(`${serverUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      console.log("Status da resposta de login:", response.status);
      const data = await response.json();
      console.log("Dados recebidos do servidor:", data);

      if (response.ok) {
        console.log("Login bem-sucedido! Redirecionando para (tabs)...");
        // Salva o nome do usuário no estado global
        if (data.user && data.user.name) {
          setIaState({ userName: data.user.name, userEmail: trimmedEmail });
        }
        try {
          if (remember) {
            await AsyncStorage.setItem('@minddrain_session', JSON.stringify({ userName: data.user?.name || '', userEmail: trimmedEmail, remember: true }));
          } else {
            await AsyncStorage.removeItem('@minddrain_session');
          }
        } catch (e) {
          console.error('Failed to persist session', e);
        }
        router.replace("/(tabs)");
      } else {
        console.log("Erro no login:", data.message);
        const msg = data.message || "Erro ao fazer login.";
        showToast(msg, 'error');
      }
    } catch (error) {
      console.error("Erro catastrófico no login:", error);
      const msg = "Não foi possível conectar ao servidor. Verifique se o backend está rodando e se o endereço está correto.";
      showToast(msg, 'error');
    } finally {
      setLoading(false);
      console.log("--- Fim do Processo de Login ---");
    }
  };

  // Ao montar, verifica se já existe sessão salva (lembrar de mim)
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const saved = await AsyncStorage.getItem('@minddrain_session');
        if (mounted && saved) {
          const sess = JSON.parse(saved);
          if (sess?.userEmail) {
            setIaState({ userName: sess.userName, userEmail: sess.userEmail });
            router.replace("/(tabs)");
          }
        }
      } catch (e) {
        console.error('Failed to load saved session', e);
      }
    };
    checkSession();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={loginestilos.container}>
      {/* Logo */}
      <Text style={loginestilos.logo}>
        Mind<Text style={loginestilos.logoBlue}>Drain</Text>
      </Text>

      <Text style={loginestilos.subtitle}>
        Simulação de Impacto das{"\n"}Redes Sociais
      </Text>

      {/* Email */}
      <View style={loginestilos.inputGroup}>
        <Text style={loginestilos.label}>
          Insira seu E-mail: <Text style={loginestilos.required}>*</Text>
        </Text>
        <TextInput
          style={loginestilos.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Senha */}
      <View style={loginestilos.inputGroup}>
        <Text style={loginestilos.label}>
          Insira sua senha: <Text style={loginestilos.required}>*</Text>
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[loginestilos.input, { paddingRight: 40 }]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, top: 8 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Row */}
      <View style={loginestilos.row}>
        <TouchableOpacity onPress={() => setRemember(!remember)}>
          <Text style={loginestilos.checkbox}>
            {remember ? "☑" : "☐"} Lembrar de mim
          </Text>
        </TouchableOpacity>
        <Pressable onPress={() => router.replace("/forgot")}>
          <Text style={loginestilos.link}>Esqueceu sua senha?</Text>
        </Pressable>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[loginestilos.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={loginestilos.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      {/* Register */}
      <Text style={loginestilos.footer}>
        Não possui cadastro?{" "}
        <Pressable onPress={() => router.replace("/register")}>
          <Text style={loginestilos.link}>Cadastre-se!</Text>
        </Pressable>
      </Text>
    </View>
  );
}