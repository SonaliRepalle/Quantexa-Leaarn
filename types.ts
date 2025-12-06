export enum BoardType {
  CBSE = 'CBSE',
  IB = 'IB',
  Cambridge = 'Cambridge',
  JEE = 'JEE',
  NEET = 'NEET',
}

export enum SubscriptionTier {
  Basic = 'Basic',
  Standard = 'Standard',
  Premium = 'Premium',
}

export interface User {
  username: string;
  board: BoardType;
  subscription: SubscriptionTier;
  coins: number;
  studyStreak: number;
  totalFocusTime: number; // in minutes
}

export interface StudyDay {
  day: number;
  subject: string;
  focusTopic: string;
  practiceTime: string;
  revisionTime: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export interface PastPaperQuestion {
  id: string;
  year: string;
  subject: string;
  topic: string;
  question: string;
  source: string;
}

export interface YouTubeSummary {
  title: string;
  keyPoints: string[];
  studyTips: string[];
}
