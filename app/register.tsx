import { estiloCadastro } from "@/assets/RegisterStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotifications } from '@/components/Notifications';
import { Ionicons } from "@expo/vector-icons";


export default function Register() {
  const { showToast } = useNotifications();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const [gender, setGender] = useState("Fem");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    console.log("--- Início do Cadastro ---");

    // Verificação detalhada de campos para log
    const campos = { name, email, password, confirmPassword, date, gender };
    console.log("Verificando campos:", campos);

    const camposFaltando = Object.keys(campos).filter(key => !campos[key]);
    if (camposFaltando.length > 0) {
      console.log("Campos faltando:", camposFaltando);
      const msg = "Por favor, preencha todos os campos: " + camposFaltando.join(", ");
      showToast(msg, 'error');
      return;
    }

    if (password !== confirmPassword) {
      console.log("Erro: Senhas não coincidem");
      const msg = "As senhas não coincidem.";
      showToast(msg, 'error');
      return;
    }

    // Validação: senha deve conter letras, números e caracteres especiais
    const pwdRegex = /(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    if (!pwdRegex.test(password)) {
      showToast("Sua senha deve incluir letras, números e caracteres especiais para garantir mais segurança.", 'error');
      return;
    }
    setLoading(true);
    try {
      const serverUrl = Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';
      console.log(`Tentando conectar em: ${serverUrl}/api/register`);
      const response = await fetch(`${serverUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          birthDate: date,
          gender,
        }),
      });

      console.log("Status da resposta:", response.status);
      const data = await response.json();
      console.log("Dados recebidos do servidor:", data);

      if (response.ok) {
        console.log("Cadastro OK! Redirecionando...");
        const msg = "Cadastro realizado com sucesso!";
        showToast(msg, 'success');
        router.replace("/login");
      } else {
        console.log("Erro retornado pelo servidor:", data.message);
        const msg = data.message || "Erro ao realizar cadastro.";
        showToast(msg, 'error');
      }
    } catch (error) {
      console.error("Erro catastrófico na requisição:", error);
      const msg = "Não foi possível conectar ao servidor. Se estiver no celular, use o IP da máquina em vez de localhost.";
      showToast(msg, 'error');
    } finally {
      setLoading(false);
      console.log("--- Fim do Processo ---");
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={estiloCadastro.container}>
      {/* Logo */}
      <Text style={estiloCadastro.logo}>
        Mind<Text style={estiloCadastro.logoBlue}>Drain</Text>
      </Text>

      <Text style={estiloCadastro.subtitle}>Cadastro</Text>

      {/* Inputs */}
      <Input label="Insira seu nome:" value={name} onChangeText={setName} />
      <Input label="Insira seu E-mail:" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      {/* Senha */}
      <View style={estiloCadastro.inputGroup}>
        <Text style={estiloCadastro.label}>
          Crie sua senha: <Text style={estiloCadastro.required}>*</Text>
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[estiloCadastro.input, { paddingRight: 40 }]}
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

      {/* Confirmar Senha */}
      <View style={estiloCadastro.inputGroup}>
        <Text style={estiloCadastro.label}>
          Confirme sua senha: <Text style={estiloCadastro.required}>*</Text>
        </Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[estiloCadastro.input, { paddingRight: 40 }]}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 0, top: 8 }}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date */}
      <Text style={estiloCadastro.section}>Data de Nascimento</Text>

      {Platform.OS === 'web' ? (
        <input
          type="date"
          onChange={(e) => setDate(new Date(e.target.value))}
          style={{
            backgroundColor: "#222",
            color: "#ccc",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            width: "100%",
            marginBottom: "20px",
            fontSize: "16px"
          }}
        />
      ) : (
        <>
          <TouchableOpacity
            style={estiloCadastro.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={estiloCadastro.dateText}>
              {date
                ? date.toLocaleDateString("pt-BR")
                : "Selecionar data"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </>
      )}

      {/* Gender */}
      <Text style={estiloCadastro.section}>Gênero</Text>
      <View style={estiloCadastro.row}>
        {["Fem", "Mas", "Outros"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              estiloCadastro.pill,
              gender === g && estiloCadastro.pillActive,
            ]}
            onPress={() => setGender(g)}
          >
            <Text
              style={[
                estiloCadastro.pillText,
                gender === g && estiloCadastro.pillTextActive,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[estiloCadastro.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={estiloCadastro.buttonText}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={estiloCadastro.footer}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}

/* --- Small reusable components --- */

const Input = ({ label, secure, value, onChangeText, ...props }) => (
  <View style={estiloCadastro.inputGroup}>
    <Text style={estiloCadastro.label}>
      {label} <Text style={estiloCadastro.required}>*</Text>
    </Text>
    <TextInput
      style={estiloCadastro.input}
      secureTextEntry={secure}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  </View>
);

const Dropdown = ({ label }) => (
  <View style={estiloCadastro.dropdown}>
    <Text style={estiloCadastro.dropdownText}>{label}</Text>
  </View>
);