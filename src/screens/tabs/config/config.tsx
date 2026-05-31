import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Switch,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native";
import { ConfigRow } from "./components/config-row";
import { styles } from "./styles";
import { getIaState, setIaState, fmtTime, subscribeIaState, resetAllData } from '@/src/store/ia-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '@/components/Notifications';
import { Platform } from 'react-native';


export const Config = () => {
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null as any);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { showToast } = useNotifications();
  const [limitHours, setLimitHours] = useState("2");
  const [limitMinutes, setLimitMinutes] = useState("0");
  const [displayLimit, setDisplayLimit] = useState(fmtTime(120));

  const [limitDate, setLimitDate] = useState(new Date());

  useEffect(() => {
    const unsub = subscribeIaState((s) => {
      if (s.dailyLimitMinutes) {
        setDisplayLimit(fmtTime(s.dailyLimitMinutes));
        setLimitHours(String(Math.floor(s.dailyLimitMinutes / 60)));
        setLimitMinutes(String(s.dailyLimitMinutes % 60));
      }
    });
    return unsub;
  }, []);

  return (
    <ScrollView contentContainerStyle={{
      paddingBottom: 120
    }} style={styles.container}>

      <Text style={styles.header}>
        Configurações
      </Text>

      {/* NOTIFICATIONS */}
      <Text style={styles.sectionTitle}>
        Notificações
      </Text>

      <View style={styles.card}>
        <ConfigRow
          icon="🔔"
          title="Ativar notificações"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          }
        />

        <ConfigRow
          icon="🕒"
          title="Lembrete diário"
          subtitle="Receber aviso de uso diário"
          right={
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
            />
          }
        />
      </View>

      {/* LIMIT */}
      <Text style={styles.sectionTitle}>
        Limite de uso
      </Text>

      <View style={styles.card}>
        <ConfigRow
          icon="⌛"
          title="Limite diário"
          right={
            <Text style={styles.rightText}>
              {displayLimit}
            </Text>
          }
        />

        <TouchableOpacity
          onPress={() => setShowModal(true)}
        >
          <ConfigRow
            icon="🕒"
            title="Definir limite"
            right={
              <Text style={styles.arrow}>
                ›
              </Text>
            }
          />
        </TouchableOpacity>
      </View>

      {/* ACCOUNT */}
      <Text style={styles.sectionTitle}>
        Conta
      </Text>

      <View style={styles.card}>
        <TouchableOpacity onPress={async () => {
          const state = getIaState();
          const email = state.userEmail;
          if (!email) {
            showToast('Nenhum usuário logado', 'error');
            return;
          }
          setLoadingProfile(true);
          try {
            const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
            const res = await fetch(`${serverUrl}/api/user?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (res.ok) {
              setProfileData(data.user);
              setShowProfileModal(true);
            } else {
              showToast(data.message || 'Erro ao buscar perfil', 'error');
            }
          } catch (err) {
            console.error(err);
            showToast('Erro ao conectar ao servidor', 'error');
          } finally {
            setLoadingProfile(false);
          }
        }}>
          <ConfigRow
            icon="👤"
            title="Informações Pessoais"
            right={
              <Text style={styles.arrow}>
                ›
              </Text>
            }
          />
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          try {
            await AsyncStorage.removeItem('@minddrain_session');
          } catch (e) {
            console.error('Failed to remove session', e);
          }
          // Limpa informações do usuário no estado global
          setIaState({ userName: undefined, userEmail: undefined });
          // Reseta dados de uso locais
          resetAllData();
          router.replace("/login");
        }}
      >
        <Text style={styles.logoutText}>
          Sair da conta
        </Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Definir limite diário
            </Text>

            <View style={{ width: '100%', marginBottom: 16 }}>
              <Text style={styles.modalLabel}>Horas</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={limitHours}
                onChangeText={setLimitHours}
              />
            </View>

            <View style={{ width: '100%', marginBottom: 16 }}>
              <Text style={styles.modalLabel}>Minutos</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={limitMinutes}
                onChangeText={(val) => {
                  const num = parseInt(val) || 0;
                  setLimitMinutes(String(Math.min(num, 59)));
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                const hours = parseInt(limitHours) || 0;
                const mins = parseInt(limitMinutes) || 0;
                const totalMinutes = hours * 60 + mins;
                if (totalMinutes > 0) {
                  setIaState({ dailyLimitMinutes: totalMinutes });
                  setDisplayLimit(fmtTime(totalMinutes));
                  setShowModal(false);
                  showToast('Limite atualizado com sucesso', 'success');
                } else {
                  showToast('Digite um limite válido', 'error');
                }
              }}
            >
              <Text style={styles.saveButtonText}>
                Salvar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal visible={showProfileModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Informações Pessoais</Text>
            {loadingProfile ? (
              <Text style={{ color: '#999' }}>Carregando...</Text>
            ) : profileData ? (
              <View style={{ width: '100%' }}>
                <Text style={{ color: '#fff', marginBottom: 8 }}>Nome: {profileData.name}</Text>
                <Text style={{ color: '#fff', marginBottom: 8 }}>E-mail: {profileData.email}</Text>
                <Text style={{ color: '#fff', marginBottom: 8 }}>Data de Nascimento: {new Date(profileData.birthDate).toLocaleDateString()}</Text>
                <Text style={{ color: '#fff', marginBottom: 8 }}>Gênero: {profileData.gender}</Text>
              </View>
            ) : (
              <Text style={{ color: '#999' }}>Nenhum dado disponível</Text>
            )}
            <TouchableOpacity style={styles.saveButton} onPress={() => setShowProfileModal(false)}>
              <Text style={styles.saveButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

}