import AsyncStorage from '@react-native-async-storage/async-storage';

// Shared client-side state for IA chat → Pie redirect flow

export type SupportedApp =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'whatsapp'
  | 'facebook';

export interface AppUsage {
  key: SupportedApp;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  minutes: number;
  sessions: number;
  coaching: string;
}

export interface GeminiChartData {
  apps: AppUsage[];
  totalMinutes: number;
  chatReply: string;       // short friendly reply shown in chat
  queriedApp: SupportedApp; // which app the user asked about
  weeklyData?: DayUsage[];  // optional weekly data from Gemini
}

export interface DayUsage {
  day: string;
  minutes: number;
}

export interface IaState {
  chartData: GeminiChartData | null;
  weeklyData: DayUsage[];
  hasInsight: boolean;
  userName?: string;
  userEmail?: string;
  dailyLimitMinutes?: number;
}

// App meta (colors, icons) — never changes, only usage numbers come from Gemini
export const APP_META: Record<SupportedApp, Pick<AppUsage, 'name' | 'icon' | 'color' | 'bgColor'>> = {
  instagram: { name: 'Instagram', icon: '📸', color: '#E1306C', bgColor: '#3a1020' },
  tiktok:    { name: 'TikTok',    icon: '🎵', color: '#69C9D0', bgColor: '#0e2526' },
  youtube:   { name: 'YouTube',   icon: '▶️', color: '#FF0000', bgColor: '#2a0e0e' },
  whatsapp:  { name: 'WhatsApp',  icon: '💬', color: '#25D366', bgColor: '#0e2a19' },
  facebook:  { name: 'Facebook',  icon: '👍', color: '#1877F2', bgColor: '#0e1a2a' },
};

// Synonyms for local app detection (navigation never depends on Gemini)
export const APP_SYNONYMS: Record<SupportedApp, string[]> = {
  instagram: ['instagram', 'insta', 'ig'],
  tiktok:    ['tiktok', 'tik tok', 'tik-tok'],
  youtube:   ['youtube', 'yt', 'you tube'],
  whatsapp:  ['whatsapp', 'whats', 'wpp', 'zap'],
  facebook:  ['facebook', 'fb', 'face'],
};

// Module-level store
let _state: IaState = {
  chartData: null,
  weeklyData: [
    { day: 'Seg', minutes: 0 },
    { day: 'Ter', minutes: 0 },
    { day: 'Qua', minutes: 0 },
    { day: 'Qui', minutes: 0 },
    { day: 'Sex', minutes: 0 },
    { day: 'Sab', minutes: 0 },
    { day: 'Dom', minutes: 0 },
  ],
  hasInsight: false,
  dailyLimitMinutes: 120,
};

const STORAGE_KEY = '@minddrain_ia_state';

const _listeners: Array<(s: IaState) => void> = [];

export function getIaState(): IaState {
  return _state;
}

// Load state from storage on startup
export async function loadStoredState(): Promise<void> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // We load the data but keep hasInsight false so it starts "clean" like the IA screen
      _state = { ...parsed, hasInsight: false };
      _listeners.forEach((fn) => fn(_state));
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
}

export function resetAllData(): void {
  _state = {
    chartData: null,
    weeklyData: [
      { day: 'Seg', minutes: 0 },
      { day: 'Ter', minutes: 0 },
      { day: 'Qua', minutes: 0 },
      { day: 'Qui', minutes: 0 },
      { day: 'Sex', minutes: 0 },
      { day: 'Sab', minutes: 0 },
      { day: 'Dom', minutes: 0 },
    ],
    hasInsight: false,
    userName: _state.userName, // Preserva o nome ao resetar dados de uso
    userEmail: _state.userEmail,
    dailyLimitMinutes: _state.dailyLimitMinutes,
  };
  _listeners.forEach((fn) => fn(_state));
  AsyncStorage.removeItem(STORAGE_KEY).catch(e => console.error('Failed to clear state', e));
}

export function setIaState(partial: Partial<IaState>): void {
  // If we are updating chartData, we need to ensure we don't lose previous apps' data during the session
  if (partial.chartData) {
    const queriedAppKey = partial.chartData.queriedApp;
    const newApps = partial.chartData.apps;

    let mergedApps: AppUsage[];

    if (_state.chartData) {
      // Merge with existing data in memory
      mergedApps = _state.chartData.apps.map(oldApp => {
        if (oldApp.key === queriedAppKey) {
          const updated = newApps.find(n => n.key === queriedAppKey);
          return updated ? updated : oldApp;
        }
        return oldApp;
      });
    } else {
      // Initial state: start everything at 0 except the queried app
      mergedApps = (Object.keys(APP_META) as SupportedApp[]).map(key => {
        const meta = APP_META[key];
        const updated = newApps.find(n => n.key === key);
        
        if (key === queriedAppKey && updated) {
          return updated;
        }

        return {
          ...meta,
          key,
          minutes: 0,
          sessions: 0,
          coaching: 'Sem dados ainda.'
        };
      });
    }

    partial.chartData.apps = mergedApps;
    partial.chartData.totalMinutes = mergedApps.reduce((sum, a) => sum + a.minutes, 0);
  }

  _state = { ..._state, ...partial };
  _listeners.forEach((fn) => fn(_state));
  
  // Persistence removed per user request: "Apos eu atualizar a pagina vc tem que excluir as informações antigamente salvas"
}

export function subscribeIaState(fn: (s: IaState) => void): () => void {
  _listeners.push(fn);
  return () => {
    const idx = _listeners.indexOf(fn);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}

export function fmtTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

export function detectApp(text: string): SupportedApp | null {
  const lower = text.toLowerCase();
  for (const [key, aliases] of Object.entries(APP_SYNONYMS) as [SupportedApp, string[]][]) {
    if (aliases.some((alias) => lower.includes(alias))) return key;
  }
  return null;
}
