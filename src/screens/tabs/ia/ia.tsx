import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  APP_META,
  AppUsage,
  GeminiChartData,
  SupportedApp,
  detectApp,
  fmtTime,
  setIaState,
} from '@/src/store/ia-store';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

// ─── Gemini API ───────────────────────────────────────────────────────────────

const GEMINI_API_KEY = 'AIzaSyA_jPTWtTLgupNqikD_-o4YjD5WDi6MfmU'; // 🔑 Substitua pela sua chave
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
  GEMINI_API_KEY;

function buildPrompt(userMessage: string, queriedApp: SupportedApp): string {
  return `Você é um assistente de bem-estar digital do app MindDrain.
O usuário disse: "${userMessage}"
O app identificado é: ${APP_META[queriedApp].name}

Sua tarefa é gerar dados de uso para hoje e para a última semana baseados na mensagem do usuário.

IMPORTANTE: 
Se o usuário mencionou um tempo específico (ex: "usei 2 horas", "30 minutos", "1h 20min"), você DEVE usar esse tempo exatamente para o app "${APP_META[queriedApp].name}" no campo "minutes" de hoje.
Se ele não mencionou, simule um valor realista.

Retorne APENAS um JSON válido, sem markdown, sem explicação:
{
  "chatReply": "uma resposta curta e amigável confirmando o tempo que o usuário informou (ou o simulado) para o app consultado",
  "apps": [
    { "key": "instagram", "minutes": <número>, "sessions": <número>, "coaching": "<dica>" },
    { "key": "tiktok",    "minutes": <número>, "sessions": <número>, "coaching": "<dica>" },
    { "key": "youtube",   "minutes": <número>, "sessions": <número>, "coaching": "<dica>" },
    { "key": "whatsapp",  "minutes": <número>, "sessions": <número>, "coaching": "<dica>" },
    { "key": "facebook",  "minutes": <número>, "sessions": <número>, "coaching": "<dica>" }
  ],
  "weeklyData": [
    { "day": "Seg", "minutes": <número> },
    { "day": "Ter", "minutes": <número> },
    { "day": "Qua", "minutes": <número> },
    { "day": "Qui", "minutes": <número> },
    { "day": "Sex", "minutes": <número> },
    { "day": "Sab", "minutes": <número> },
    { "day": "Dom", "minutes": <número> }
  ]
}

Regras:
- Priorize o tempo informado pelo usuário para o app "${APP_META[queriedApp].name}".
- Mantenha os outros apps com valores variados e realistas.
- "weeklyData" deve ser consistente com o uso de hoje (a soma dos minutos de hoje deve ser próxima ao valor de um dos dias da semana).`;
}

async function callGemini(userMessage: string, queriedApp: SupportedApp): Promise<GeminiChartData> {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(userMessage, queriedApp) }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.8 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();

  let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  // Strip markdown fences if present
  raw = raw.replace(/```json|```/g, '').trim();

  const parsed = JSON.parse(raw);

  const apps: AppUsage[] = parsed.apps.map((a: any) => ({
    ...APP_META[a.key as SupportedApp],
    key: a.key as SupportedApp,
    minutes: Number(a.minutes),
    sessions: Number(a.sessions),
    coaching: a.coaching,
  }));

  const totalMinutes = apps.reduce((s, a) => s + a.minutes, 0);

  return {
    apps,
    totalMinutes,
    chatReply: parsed.chatReply,
    queriedApp,
    weeklyData: parsed.weeklyData,
  };
}

// ─── Local fallback (if Gemini fails) ────────────────────────────────────────

function extractMinutes(text: string): number | null {
  const lower = text.toLowerCase();

  // Try "2h 30min" or "2h30" or "2 horas"
  const hourMatch = lower.match(/(\d+)\s*h/);
  const minMatch = lower.match(/(\d+)\s*m/);

  let total = 0;
  let found = false;

  if (hourMatch) {
    total += parseInt(hourMatch[1]) * 60;
    found = true;
  }
  if (minMatch) {
    total += parseInt(minMatch[1]);
    found = true;
  }

  // Try just "30 minutos" or "2 horas"
  if (!found) {
    const onlyHours = lower.match(/(\d+)\s*hora/);
    const onlyMins = lower.match(/(\d+)\s*minuto/);
    if (onlyHours) {
      total = parseInt(onlyHours[1]) * 60;
      found = true;
    } else if (onlyMins) {
      total = parseInt(onlyMins[1]);
      found = true;
    }
  }

  return found ? total : null;
}

function localFallback(userMessage: string, queriedApp: SupportedApp): GeminiChartData {
  const userMinutes = extractMinutes(userMessage);

  const base: Record<SupportedApp, { minutes: number; sessions: number; coaching: string }> = {
    instagram: { minutes: 87, sessions: 14, coaching: 'Tente limitar a 30 min por dia.' },
    tiktok: { minutes: 104, sessions: 22, coaching: 'Defina um timer antes de abrir.' },
    youtube: { minutes: 63, sessions: 7, coaching: 'Desative o autoplay.' },
    whatsapp: { minutes: 45, sessions: 38, coaching: 'Escolha horários fixos para checar.' },
    facebook: { minutes: 43, sessions: 9, coaching: 'Acesse com objetivo definido.' },
  };

  if (userMinutes !== null) {
    base[queriedApp].minutes = userMinutes;
  }

  const apps: AppUsage[] = (Object.keys(base) as SupportedApp[]).map((key) => ({
    ...APP_META[key],
    key,
    ...base[key],
  }));

  const totalMinutes = apps.reduce((s, a) => s + a.minutes, 0);
  const app = apps.find((a) => a.key === queriedApp)!;

  return {
    apps,
    totalMinutes,
    chatReply: `Entendido! Você usou ${fmtTime(app.minutes)} no ${app.name} hoje. Isso representa ${Math.round((app.minutes / totalMinutes) * 100)}% do seu tempo total de tela.`,
    queriedApp,
    weeklyData: [
      { day: 'Seg', minutes: 60 },
      { day: 'Ter', minutes: 120 },
      { day: 'Qua', minutes: 30 },
      { day: 'Qui', minutes: 80 },
      { day: 'Sex', minutes: 150 },
      { day: 'Sab', minutes: 90 },
      { day: 'Dom', minutes: totalMinutes },
    ],
  };
}

// ─── Suggestions ──────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Usei 1h no Instagram',
  'Usei 1h10min no TikTok',
  'Usei 30 minutos no YouTube',
  'Passei 45 min no WhatsApp hoje',
  'Fiquei 2 horas no Instagram',
  'Usei 20 min no Facebook agora',
  '1h20min no TikTok',
  '90 minutos no YouTube',
];

// ─── Component ────────────────────────────────────────────────────────────────

export const Ia: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: 'Olá! Pode me informar quanto tempo você passou nas redes sociais? Assim consigo gerar gráficos e insights para você.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // When entering the IA screen, we "clear" the previous insight from the Pie screen
    // so it starts fresh for the next query, just like the chat messages.
    setIaState({ hasInsight: false });
  }, []);

  const addMessage = (msg: Message) =>
    setMessages((prev) => [...prev, msg]);

  const handleSend = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput('');
    setShowSuggestions(false);
    addMessage({ id: Date.now().toString(), role: 'user', text: userText });
    setLoading(true);

    const appKey = detectApp(userText);

    if (appKey == null) {
      setLoading(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'Ainda não monitoro esse app. Pergunte sobre Instagram, TikTok, YouTube, WhatsApp ou Facebook!',
      });
      return;
    }

    let chartData: GeminiChartData;
    try {
      chartData = await callGemini(userText, appKey);
    } catch {
      chartData = localFallback(userText, appKey);
    }

    setLoading(false);
    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: chartData.chatReply,
    });

    setIaState({
      chartData,
      hasInsight: true,
      ...(chartData.weeklyData ? { weeklyData: chartData.weeklyData } : {})
    });
    setRedirecting(true);

    setTimeout(() => {
      setRedirecting(false);
      router.push('/(tabs)/pie');
    }, 1400);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>
          Mind<Text style={styles.logoBlue}>Drain</Text>
        </Text>
        <Text style={styles.headerSub}>Assistente IA</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubbleRow, msg.role === 'user' ? styles.bubbleRowUser : styles.bubbleRowAi]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.avatarAi}>
                <Text style={styles.avatarText}>🧠</Text>
              </View>
            )}
            <View style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
              <Text style={msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAi}>
                {msg.text}
              </Text>
            </View>
            {msg.role === 'user' && (
              <View style={styles.avatarUser}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View style={[styles.bubbleRow, styles.bubbleRowAi]}>
            <View style={styles.avatarAi}>
              <Text style={styles.avatarText}>🧠</Text>
            </View>
            <View style={[styles.bubble, styles.bubbleAi]}>
              <ActivityIndicator color="#a78bfa" size="small" />
            </View>
          </View>
        )}
      </ScrollView>

      {showSuggestions && (
        <>
          <Text style={styles.helperText}>
            Diga quanto tempo você passou em um app. Exemplos: "1h 20min no Instagram" ou "30 minutos no YouTube".
          </Text>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity key={s} style={styles.chip} onPress={() => handleSend(s)} activeOpacity={0.75}>
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {redirecting && (
        <View style={styles.redirectNotice}>
          <View style={styles.redirectDot} />
          <Text style={styles.redirectText}>Gerando seu gráfico...</Text>
        </View>
      )}

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ex: 1h 20min no Instagram"
          placeholderTextColor="#4a4770"
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
          editable={!loading}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d14' },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  logo: { color: '#f0eeff', fontSize: 28, fontWeight: '700' },
  logoBlue: { color: '#1DA1F2' },
  headerSub: { color: '#7b78a0', fontSize: 13, marginTop: 2 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 10 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  bubbleRowUser: { flexDirection: 'row-reverse' },
  bubbleRowAi: { flexDirection: 'row' },
  avatarAi: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1a1a2e',
    borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.3)',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  avatarUser: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1a2e1a',
    borderWidth: 0.5, borderColor: 'rgba(52,211,153,0.3)',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  avatarText: { fontSize: 13 },
  bubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleAi: {
    backgroundColor: '#1a1a2e',
    borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.15)',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#1a2e22',
    borderWidth: 0.5, borderColor: 'rgba(52,211,153,0.2)',
    borderBottomRightRadius: 4,
  },
  bubbleTextAi: { color: '#d4d0f0', fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: '#c8f0dc', fontSize: 14, lineHeight: 20 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
  chip: {
    backgroundColor: '#1a1a2e',
    borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.25)',
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7,
  },
  chipText: { color: '#a78bfa', fontSize: 12 },
  redirectNotice: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: 'rgba(52,211,153,0.08)',
    borderWidth: 0.5, borderColor: 'rgba(52,211,153,0.25)',
    borderRadius: 12, gap: 8,
  },
  redirectDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#34d399' },
  redirectText: { color: '#34d399', fontSize: 13 },
  helperText: { color: '#9a94b8', fontSize: 12, paddingHorizontal: 16, marginTop: 8, marginBottom: 6 },
  inputArea: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 16, paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 10,
  },
  input: {
    flex: 1, backgroundColor: '#1a1a2e',
    borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.2)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    color: '#e8e6f0', fontSize: 14, maxHeight: 80,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6d5aee', justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  sendIcon: { color: '#fff', fontSize: 16 },
});
