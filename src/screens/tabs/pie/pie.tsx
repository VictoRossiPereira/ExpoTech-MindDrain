import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNotifications } from '@/components/Notifications';
import PieChart from 'react-native-pie-chart';
import {
  AppUsage,
  IaState,
  fmtTime,
  getIaState,
  subscribeIaState,
  resetAllData,
} from '@/src/store/ia-store';
import { estilos } from './styles';

const widthAndHeight = 140;

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <View style={emptyStyles.wrap}>
    <Text style={emptyStyles.icon}>🤖</Text>
    <Text style={emptyStyles.title}>Nenhum dado ainda</Text>
    <Text style={emptyStyles.sub}>
      Vá até a aba IA e pergunte sobre um app para gerar seu gráfico.
    </Text>
  </View>
);

const emptyStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  icon: { fontSize: 48, marginBottom: 12, opacity: 0.4 },
  title: { color: '#f0eeff', fontSize: 17, fontWeight: '700', marginBottom: 6 },
  sub: { color: '#7b78a0', fontSize: 13, textAlign: 'center', lineHeight: 19 },
});

// ─── Insight Card ─────────────────────────────────────────────────────────────

const InsightCard: React.FC<{ iaState: IaState }> = ({ iaState }) => {
  if (!iaState.hasInsight || !iaState.chartData) return null;

  const { chartData } = iaState;
  const app = chartData.apps.find((a) => a.key === chartData.queriedApp);
  if (!app) return null;

  const pct = Math.round((app.minutes / chartData.totalMinutes) * 100);
  const avgOthers = Math.round(
    (chartData.totalMinutes - app.minutes) / (chartData.apps.length - 1)
  );
  const aboveAvg = app.minutes > avgOthers;
  const recovered = Math.round(app.minutes * 0.35);

  return (
    <View style={insightStyles.card}>
      <View style={insightStyles.accentBar} />

      <View style={insightStyles.badge}>
        <Text style={insightStyles.badgeText}>🧠 Insight IA</Text>
      </View>

      <View style={insightStyles.appRow}>
        <View style={[insightStyles.appIcon, { backgroundColor: app.bgColor }]}>
          <Text style={insightStyles.appIconText}>{app.icon}</Text>
        </View>
        <View>
          <Text style={insightStyles.appName}>{app.name}</Text>
          <Text style={insightStyles.appMeta}>
            {fmtTime(app.minutes)} hoje · {app.sessions} sessões
          </Text>
        </View>
      </View>

      <View style={insightStyles.statsGrid}>
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>Tempo total</Text>
          <Text style={[insightStyles.statVal, insightStyles.purple]}>{fmtTime(app.minutes)}</Text>
        </View>
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>% do dia</Text>
          <Text style={[insightStyles.statVal, aboveAvg ? insightStyles.amber : insightStyles.green]}>
            {pct}%
          </Text>
        </View>
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>Vs. outros apps</Text>
          <Text style={[insightStyles.statValSm, aboveAvg ? insightStyles.amber : insightStyles.green]}>
            {aboveAvg ? 'acima da média' : 'abaixo da média'}
          </Text>
        </View>
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>Sessões</Text>
          <Text style={insightStyles.statVal}>{app.sessions}x</Text>
        </View>
      </View>

      <Text style={insightStyles.coaching}>{app.coaching}</Text>

      <View style={insightStyles.recoveredBanner}>
        <Text style={insightStyles.recoveredIcon}>⏱️</Text>
        <Text style={insightStyles.recoveredText}>
          Reduzindo 35% do uso, você{' '}
          <Text style={insightStyles.recoveredBold}>recupera {fmtTime(recovered)}</Text>
          {' '}por dia — tempo para ler, criar ou descansar de verdade.
        </Text>
      </View>
    </View>
  );
};

// ─── Main Pie Screen ──────────────────────────────────────────────────────────

export const Pie: React.FC = () => {
  const [iaState, setLocalIaState] = useState<IaState>(getIaState());
  const { showConfirm } = useNotifications();

  useEffect(() => {
    const unsub = subscribeIaState((s) => setLocalIaState({ ...s }));
    return unsub;
  }, []);

  const { chartData } = iaState;
  const hasData = iaState.hasInsight && chartData != null;

  // Sort apps by minutes in descending order
  const sortedApps = hasData
    ? [...chartData!.apps].sort((a, b) => b.minutes - a.minutes)
    : [];

  // Build pie series from sorted data
  const pieSeries = hasData
    ? sortedApps.map((a) => ({ value: a.minutes, color: a.color }))
    : [];

  const totalTime = hasData ? fmtTime(chartData!.totalMinutes) : '--';

  return (
    <View style={estilos.backg}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 20,
          paddingHorizontal: 16
        }}
      >

        {/* LOGO */}
        <Text style={estilos.logo}>
          Mind<Text style={estilos.logoBlue}>Drain</Text>
        </Text>

        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* SOCIAL USAGE LIST */}
            <View style={estilos.containerI}>
              <Text style={estilos.sectionTitle}>Uso por rede sociais</Text>
              {sortedApps.map((item, index) => (
                <View
                  key={item.key}
                  style={[estilos.socialRow, index !== sortedApps.length - 1 && estilos.rowBorder]}
                >
                  <View style={estilos.socialLeft}>
                    <View style={[estilos.iconCircle, { backgroundColor: item.color }]}>
                      <Text style={estilos.iconText}>{item.icon}</Text>
                    </View>
                    <Text style={estilos.socialName}>{item.name}</Text>
                  </View>
                  <Text style={estilos.socialTime}>{fmtTime(item.minutes)}</Text>
                </View>
              ))}
            </View>

            {/* PIE CHART */}
            <View style={estilos.containerP}>
              <Text style={estilos.sectionTitle}>Distribuição do tempo</Text>
              <View style={estilos.chartWrapper}>
                <PieChart
                  widthAndHeight={widthAndHeight}
                  series={pieSeries}
                  coverRadius={0.62}
                />
                <Text style={chartStyles.totalLabel}>{totalTime}</Text>
              </View>
              <View style={estilos.legendContainer}>
                {sortedApps.map((item) => (
                  <View key={item.key} style={estilos.legendItem}>
                    <View style={[estilos.legendColor, { backgroundColor: item.color }]} />
                    <Text style={estilos.legendText}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* IA INSIGHT CARD */}
            <InsightCard iaState={iaState} />

            {/* RESET BUTTON */}
            <TouchableOpacity
              style={pieStyles.resetBtn}
              onPress={() => {
                showConfirm({
                  title: 'Limpar Histórico',
                  message: 'Deseja apagar todos os dados salvos e começar do zero?',
                  onConfirm: resetAllData,
                });
              }}
            >
              <Text style={pieStyles.resetBtnText}>🗑️ Limpar Histórico de Uso</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Extra Styles ─────────────────────────────────────────────────────────────

const pieStyles = StyleSheet.create({
  resetBtn: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#ff453a',
    fontWeight: '600',
    fontSize: 14,
  },
});

// ─── Chart styles ─────────────────────────────────────────────────────────────

const chartStyles = StyleSheet.create({
  totalLabel: {
    color: '#f0eeff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});

// ─── Insight Card Styles ──────────────────────────────────────────────────────

const insightStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
    backgroundColor: '#6d5aee',
    borderTopLeftRadius: 12, borderTopRightRadius: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(167,139,250,0.12)',
    borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.3)',
    borderRadius: 8, paddingHorizontal: 9, paddingVertical: 3,
    marginBottom: 12, marginTop: 4,
  },
  badgeText: { color: '#a78bfa', fontSize: 11, fontWeight: '600' },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  appIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  appIconText: { fontSize: 18 },
  appName: { color: '#f0eeff', fontSize: 16, fontWeight: '700' },
  appMeta: { color: '#7b78a0', fontSize: 12, marginTop: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  statBox: {
    flex: 1, minWidth: '45%',
    backgroundColor: '#0d0d14',
    borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.07)',
    padding: 10,
  },
  statLabel: { color: '#5a5780', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  statVal: { color: '#f0eeff', fontSize: 18, fontWeight: '700', marginTop: 2 },
  statValSm: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  purple: { color: '#a78bfa' },
  green: { color: '#34d399' },
  amber: { color: '#fbbf24' },
  coaching: { color: '#9d9bbf', fontSize: 13, lineHeight: 19, marginBottom: 14 },
  recoveredBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: 'rgba(52,211,153,0.08)',
    borderWidth: 0.5, borderColor: 'rgba(52,211,153,0.2)',
    borderRadius: 10, padding: 12,
  },
  recoveredIcon: { fontSize: 18 },
  recoveredText: { color: '#34d399', fontSize: 12, lineHeight: 17, flex: 1 },
  recoveredBold: { fontWeight: '700' },
});
