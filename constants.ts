
import { Emotion } from './types';

type EmotionStyle = {
  gradient: string;
  shadow: string;
  specialEffect?: string;
};

export const EMOTION_STYLES: Record<Emotion, EmotionStyle> = {
  default: {
    gradient: 'from-gray-500 to-gray-700',
    shadow: 'shadow-gray-500/30',
  },
  joy: {
    gradient: 'from-yellow-300 to-amber-500',
    shadow: 'shadow-yellow-400/40',
  },
  anger: {
    gradient: 'from-red-500 to-red-700',
    shadow: 'shadow-red-500/50',
    specialEffect: 'fire',
  },
  sad: {
    gradient: 'from-blue-400 to-indigo-600',
    shadow: 'shadow-blue-500/40',
  },
  ennui: {
    gradient: 'from-indigo-600 to-slate-800',
    shadow: 'shadow-indigo-600/40',
  },
  anxiety: {
    gradient: 'from-orange-400 to-amber-600',
    shadow: 'shadow-orange-500/40',
  },
  disgust: {
    gradient: 'from-green-500 to-emerald-700',
    shadow: 'shadow-green-600/40',
  },
  fear: {
    gradient: 'from-purple-500 to-violet-800',
    shadow: 'shadow-purple-600/40',
  },
  sarcasm: {
    gradient: 'from-pink-300 to-rose-400',
    shadow: 'shadow-pink-400/30',
  },
};
