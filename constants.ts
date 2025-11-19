
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
  neutral: {
    gradient: 'from-gray-400 to-gray-600',
    shadow: 'shadow-gray-400/30',
  },
  joy: {
    gradient: 'from-yellow-300 to-yellow-500',
    shadow: 'shadow-yellow-400/40',
  },
  anger: {
    gradient: 'from-red-600 to-red-800',
    shadow: 'shadow-red-600/50',
  },
  sad: {
    gradient: 'from-blue-400 to-blue-700',
    shadow: 'shadow-blue-500/40',
  },
  ennui: {
    gradient: 'from-indigo-400 to-indigo-700',
    shadow: 'shadow-indigo-600/40',
  },
  anxiety: {
    gradient: 'from-orange-400 to-orange-600',
    shadow: 'shadow-orange-500/40',
  },
  disgust: {
    gradient: 'from-green-500 to-green-700',
    shadow: 'shadow-green-600/40',
  },
  fear: {
    gradient: 'from-purple-500 to-purple-800',
    shadow: 'shadow-purple-600/40',
  },
  sarcasm: {
    // Brown
    gradient: 'from-amber-800 to-amber-950',
    shadow: 'shadow-amber-900/40',
  },
  embarrassment: {
    // Pink
    gradient: 'from-pink-300 to-pink-500',
    shadow: 'shadow-pink-400/30',
  },
  envy: {
    // Aquamarine
    gradient: 'from-teal-200 to-teal-400',
    shadow: 'shadow-teal-300/30',
  },
  burnout: {
    // Orange with fire visuals
    gradient: 'from-orange-600 to-red-700',
    shadow: 'shadow-orange-700/50',
    specialEffect: 'fire',
  },
};
