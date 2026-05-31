import { forgor } from "@/assets/ForgotStyles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <View style={forgor.container}>
      {/* Logo */}
      <Text style={forgor.logo}>
        Mind<Text style={forgor.logoBlue}>Drain</Text>
      </Text>

      <Text style={forgor.subtitle}>Redefinição de senha</Text>

      {/* Description */}
      <Text style={forgor.description}>
        Informe um email e enviaremos um link para recuperação da sua senha.
      </Text>

      {/* Input */}
      <View style={forgor.inputGroup}>
        <Text style={forgor.label}>
          Insira seu E-mail: <Text style={forgor.required}>*</Text>
        </Text>
        <TextInput
          style={forgor.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={forgor.button}>
        <Text style={forgor.buttonText}>Enviar Link</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={forgor.footer}>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
}