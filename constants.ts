import { LucideIcon, BookOpen, GraduationCap, Microscope, FileText, CheckCircle2, AlertTriangle, XCircle, Search, BarChart3, ArrowRight } from "lucide-react";

export const APP_NAME = "BioQuest";

export const CONTACT_INFO = {
  name: "Priyanka Singh",
  email: "priyanka.singh.29@gmail.com",
  whatsapp: "8887559312" // +91 added automatically
};

export const AUDIT_QUESTIONS = [
  {
    id: 'q1',
    text: "What is your current academic level?",
    options: ["Undergraduate", "Postgraduate / Resident", "PhD Scholar", "Faculty / Consultant"]
  },
  {
    id: 'q2',
    text: "What type of paper are you planning?",
    options: ["Original Research", "Systematic Review / Meta-analysis", "Case Report / Series", "Narrative Review", "Letter to Editor"]
  },
  {
    id: 'q3',
    text: "Have you identified a target journal?",
    options: ["Yes, checking author guidelines", "Yes, but haven't checked guidelines", "No, not yet", "Not sure how to select"]
  },
  {
    id: 'q4',
    text: "What is the status of your Ethics Approval (IRB)?",
    options: ["Approved", "Submitted / Pending", "Not required (Review/Case Rpt)", "Not started"]
  },
  {
    id: 'q5',
    text: "How complete is your data collection?",
    options: ["Completed & Cleaned", "In progress (>50%)", "Just started (<50%)", "Not started"]
  },
  {
    id: 'q6',
    text: "Have you performed a formal sample size calculation?",
    options: ["Yes, with statistician", "Yes, calculated online", "No, estimating based on past studies", "Not applicable"]
  },
  {
    id: 'q7',
    text: "Have you run a plagiarism check on your draft?",
    options: ["Yes, <15% similarity", "Yes, >15% similarity", "No, not yet written", "No, plan to do later"]
  },
  {
    id: 'q8',
    text: "Are your references managed via software (EndNote/Zotero)?",
    options: ["Yes, fully managed", "Partially", "No, doing it manually"]
  }
];

// Helper to calculate score
export const calculateReadiness = (answers: Record<string, string>) => {
  let score = 0;
  const maxScore = AUDIT_QUESTIONS.length * 10;

  Object.values(answers).forEach(ans => {
    if (ans.includes("Yes") || ans.includes("Approved") || ans.includes("Completed")) score += 10;
    else if (ans.includes("In progress") || ans.includes("Partially")) score += 5;
    else if (ans.includes("Not required")) score += 10; // Neutral good
    else score += 0;
  });

  const percentage = Math.round((score / maxScore) * 100);

  let risk: 'Low' | 'Moderate' | 'High' = 'High';
  if (percentage > 75) risk = 'Low';
  else if (percentage > 40) risk = 'Moderate';

  return { percentage, risk };
};
