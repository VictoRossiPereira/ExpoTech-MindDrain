import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { StatCard } from "./components/strat-card";
import { styles } from "./styles";
import { getIaState, subscribeIaState, fmtTime, IaState } from "@/src/store/ia-store";

const screenWidth = Dimensions.get("window").width;

export const Home = () => {
  const [iaState, setLocalIaState] = useState<IaState>(getIaState());

  useEffect(() => {
    const unsub = subscribeIaState((s) => setLocalIaState({ ...s }));
    return unsub;
  }, []);

  const { chartData, weeklyData, userName, dailyLimitMinutes } = iaState;

  // Data for apps bar chart
  const appsData = {
    labels: chartData?.apps.map(a => a.name.substring(0, 5)) || ["Insta", "TikTok", "YT", "WPP", "FB"],
    datasets: [
      {
        data: chartData?.apps.map(a => a.minutes) || [0, 0, 0, 0, 0]
      }
    ]
  };

  // Data for weekly usage
  const weeklyUsageData = {
    labels: weeklyData.map(d => d.day),
    datasets: [
      {
        data: weeklyData.map(d => d.minutes)
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: "#1a1a2e",
    backgroundGradientTo: "#1a1a2e",
    color: (opacity = 1) => `rgba(83, 107, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const totalToday = chartData?.totalMinutes || 0; // Zerado por padrão
  const maxUsageDay = weeklyData.reduce((prev, current) => (prev.minutes > current.minutes) ? prev : current, weeklyData[0]);
  const limit = dailyLimitMinutes || 120;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <Text style={styles.logo}>
          Mind<Text style={styles.logoBlue}>Drain</Text>
        </Text>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>
              Olá, {userName || "Usuário"}
            </Text>

            <Text style={styles.subtitle}>
              Resumo do seu uso
            </Text>
          </View>

          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
            <Ionicons name="person" size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>
            Tempo de uso hoje
          </Text>

          <Text style={styles.bigTime}>
            {fmtTime(totalToday)}
          </Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((totalToday / limit) * 100, 100)}%` }]} />
          </View>

          <Text style={styles.goal}>
            Limite diário {fmtTime(limit)}
          </Text>
        </View>

        {/* Apps Usage Chart */}
        <Text style={styles.section}>
          Uso por Redes Sociais
        </Text>
        <View style={styles.chartCard}>
          <BarChart
            data={appsData}
            width={screenWidth - 64}
            height={220}
            yAxisLabel=""
            yAxisSuffix="m"
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero={true}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>

        {/* Weekly Report */}
        <Text style={styles.section}>
          Relatório Semanal
        </Text>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Minutos por dia
          </Text>
          <LineChart
            data={weeklyUsageData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(0, 242, 254, ${opacity})`,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard title="Média diária" value={fmtTime(Math.round(weeklyData.reduce((a, b) => a + b.minutes, 0) / 7))} />
          <StatCard title="Dia mais ativo" value={maxUsageDay.day} />
          <StatCard title="Total semana" value={fmtTime(weeklyData.reduce((a, b) => a + b.minutes, 0))} />
        </View>

        {/* Resume */}
        <View style={styles.resumeCard}>
          <Text style={styles.resumeTitle}>
            Resumo por dia
          </Text>

          {weeklyData.map((item) => (
            <View style={styles.resumeRow} key={item.day}>
              <Text style={styles.resumeDay}>{item.day}</Text>
              <Text style={styles.resumeValue}>{fmtTime(item.minutes)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

