import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { namee } from "@/assets/NameStyles";
import { useRouter } from "expo-router";


export default function EditName() {
  const router = useRouter();

  const [name, setName] = useState("XXXXXXXXX");

  return (
    <View style={namee.container}>

      {/* HEADER */}
      <View style={namee.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={namee.backArrow}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={namee.headerTitle}>
          Nome
        </Text>
      </View>

      {/* CONTENT */}
      <View style={namee.content}>
        <Text style={namee.label}>
          Edite seu nome:
        </Text>

        <TextInput
          style={namee.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          placeholderTextColor="#666"
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={namee.saveButton}>
        <Text style={namee.saveButtonText}>
          Salvar
        </Text>
      </TouchableOpacity>

    </View>
  );
}