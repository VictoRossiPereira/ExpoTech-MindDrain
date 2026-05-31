import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { info } from "@/assets/InfoStyles";
import { useRouter } from "expo-router";

export default function PersonalInfo() {
  const router = useRouter();

  return (
    <View style={info.container}>

      {/* HEADER */}
      <View style={info.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={info.backArrow}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={info.headerTitle}>
          Informações Pessoais
        </Text>
      </View>

      {/* PROFILE */}
      <View style={info.profileSection}>
        <View style={info.avatar}>
          <Text style={info.avatarIcon}>
            👤
          </Text>
        </View>

        <TouchableOpacity style={info.photoButton}>
          <Text style={info.photoButtonText}>
            Alterar foto
          </Text>
        </TouchableOpacity>
      </View>

      {/* INFO LIST */}
      <View style={info.infoContainer}>
        <InfoRow title="Nome" />
        <InfoRow title="E-mail" />
        <InfoRow title="Nascimento e Gênero" />
        <InfoRow title="Gênero" />
      </View>

      {/* PASSWORD */}
      <TouchableOpacity style={info.passwordRow}>
        <Text style={info.passwordText}>
          Alterar a senha
        </Text>

        <Text style={info.arrow}>
          ›
        </Text>
      </TouchableOpacity>

      {/* DELETE ACCOUNT */}
      <TouchableOpacity style={info.deleteButton}>
        <Text style={info.deleteButtonText}>
          Excluir Conta
        </Text>
      </TouchableOpacity>

    </View>
  );
}

function InfoRow({ title }) {
  return (
    <View style={info.infoRow}>
      <Text style={info.infoTitle}>
        {title}
      </Text>

      <TouchableOpacity style={info.editButton}>
        <Text style={info.editButtonText}>
          Editar
        </Text>
      </TouchableOpacity>
    </View>
  );
}