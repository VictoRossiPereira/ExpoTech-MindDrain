import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { emailstyle } from "@/assets/mailstyles";
import { useRouter } from "expo-router";


export default function EditEmail() {
  const router = useRouter();

  const [email, setEmail] = useState(
    "XXXXXXXXX@gmail.com"
  );

  const [password, setPassword] = useState("");

  return (
    <View style={emailstyle.container}>

      {/* HEADER */}
      <View style={emailstyle.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={emailstyle.backArrow}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={emailstyle.headerTitle}>
          E-mail
        </Text>
      </View>

      {/* CONTENT */}
      <View style={emailstyle.content}>

        {/* EMAIL */}
        <View style={emailstyle.inputGroup}>
          <Text style={emailstyle.label}>
            Edite seu E-mail:
          </Text>

          <View style={emailstyle.inputRow}>
            <TextInput
              style={emailstyle.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu E-mail"
              placeholderTextColor="#666"
              keyboardType="email-address"
            />

            <Text style={emailstyle.icon}>
              ✉
            </Text>
          </View>
        </View>

        {/* PASSWORD */}
        <View style={emailstyle.inputGroup}>
          <Text style={emailstyle.label}>
            Insira sua senha atual:
          </Text>

          <View style={emailstyle.inputRow}>
            <TextInput
              style={emailstyle.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor="#666"
              secureTextEntry
            />

            <Text style={emailstyle.icon}>
              ⌨
            </Text>
          </View>
        </View>

      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={emailstyle.saveButton}>
        <Text style={emailstyle.saveButtonText}>
          Salvar
        </Text>
      </TouchableOpacity>

    </View>
  );
}