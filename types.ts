
export type Emotion = 
  | 'joy' 
  | 'anger' 
  | 'sad' 
  | 'ennui' 
  | 'anxiety' 
  | 'disgust' 
  | 'fear' 
  | 'sarcasm' 
  | 'embarrassment'
  | 'envy'
  | 'burnout'
  | 'neutral'
  | 'default';

export const emotionList: Emotion[] = [
  'joy', 
  'anger', 
  'sad', 
  'ennui', 
  'anxiety', 
  'disgust', 
  'fear', 
  'sarcasm',
  'embarrassment',
  'envy',
  'burnout',
  'neutral'
];

export type Page = 'dashboard' | 'gamification' | 'history';

export interface WeeklyTask {
  id: number;
  text: string;
  completed: boolean;
  icon: React.ElementType;
}
