export enum AppStep {
  LANDING = 'LANDING',
  ANALYSIS_LOADING = 'ANALYSIS_LOADING',
  ANALYSIS_RESULT = 'ANALYSIS_RESULT',
  AUDIT_INTRO = 'AUDIT_INTRO',
  AUDIT_QUESTIONS = 'AUDIT_QUESTIONS',
  AUDIT_RESULT = 'AUDIT_RESULT',
  EXPERT_REQUEST = 'EXPERT_REQUEST',
}

export enum ViabilityLevel {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High',
}

export enum TrendDirection {
  DECLINING = 'Declining',
  STABLE = 'Stable',
  INCREASING = 'Increasing',
}

export interface TopicTrendData {
  year: string;
  activity: number; // 0-100 scale
}

export interface PaperSummary {
  title: string;
  summary: string;
  keyFindings: string[];
}

export interface LandscapeAnalysis {
  saturation: 'Low' | 'Moderate' | 'High';
  trend: TrendDirection;
  viability: ViabilityLevel;
  justification: string;
  refinements: string[];
  topicKeywords: string[];
  trendData: TopicTrendData[];
  sources: { title: string; url: string }[];
  paperSummaries: PaperSummary[];
}

export interface ImprovementAnalysis {
  potential: 'Low' | 'Medium' | 'High';
  advice: string;
  improvements: string[];
}

export interface UserContext {
  topic: string;
  field: string;
  level: string;
}

export interface AuditAnswers {
  [key: string]: string;
}

export interface Diagnosis {
  score: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  cards: {
    title: string;
    status: 'Good' | 'Warning' | 'Critical';
    text: string;
  }[];
}

export interface ResearchLead {
  id: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  profile: {
    academicLevel: string;
    field: string;
  };
  researchContext: {
    topic: string;
    viability: string;
    improvementPotential: string;
    readinessScore: number;
  };
  status: 'new' | 'contacted' | 'closed';
  submittedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}