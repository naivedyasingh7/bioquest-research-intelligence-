import React, { useState } from 'react';
import { AppStep, UserContext, LandscapeAnalysis, ImprovementAnalysis, AuditAnswers, Diagnosis } from './types';
import { TopicInput } from './components/TopicInput';
import { AnalysisView } from './components/AnalysisView';
import { AuditFlow } from './components/AuditFlow';
import { AuditResults } from './components/AuditResults';
import { ExpertForm } from './components/ExpertForm';
import { ChatWidget } from './components/ChatWidget';
import { analyzeLandscape, analyzeImprovement } from './services/geminiService';
import { calculateReadiness, APP_NAME } from './constants';
import { Microscope } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  
  // Data States
  const [landscape, setLandscape] = useState<LandscapeAnalysis | null>(null);
  const [improvement, setImprovement] = useState<ImprovementAnalysis | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);

  const handleTopicSubmit = async (context: UserContext) => {
    setUserContext(context);
    setStep(AppStep.ANALYSIS_LOADING);

    try {
      // 1. Get Landscape (Flash + Search)
      const landscapeResult = await analyzeLandscape(context);
      setLandscape(landscapeResult);

      // 2. Get Improvement (Pro + Thinking) - Pass landscape context for better advice
      const improvementResult = await analyzeImprovement(context, landscapeResult);
      setImprovement(improvementResult);
      
      setStep(AppStep.ANALYSIS_RESULT);
    } catch (error) {
      console.error("Chain failed", error);
      // Handle error state gracefully in real app
      setStep(AppStep.LANDING);
    }
  };

  const handleAuditComplete = (answers: AuditAnswers) => {
    const { percentage, risk } = calculateReadiness(answers);
    setDiagnosis({ 
      score: percentage, 
      riskLevel: risk,
      cards: [] // In a real app, populate dynamically based on answers
    });
    setStep(AppStep.AUDIT_RESULT);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-teal-600 p-1.5 rounded-lg">
               <Microscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">{APP_NAME}</span>
          </div>
          {step !== AppStep.LANDING && (
            <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
              {step === AppStep.ANALYSIS_RESULT ? 'Phase 1: Analysis' : 
               step === AppStep.AUDIT_QUESTIONS ? 'Phase 2: Audit' :
               step === AppStep.AUDIT_RESULT ? 'Phase 3: Diagnosis' : 'Processing...'}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {step === AppStep.LANDING && (
          <TopicInput onSubmit={handleTopicSubmit} isLoading={false} />
        )}

        {step === AppStep.ANALYSIS_LOADING && (
          <div className="flex-grow flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600 mb-6"></div>
            <h3 className="text-xl font-semibold text-slate-800">Analyzing Research Landscape...</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs text-center">
              Scanning recent publications and evaluating topic saturation using AI.
            </p>
          </div>
        )}

        {step === AppStep.ANALYSIS_RESULT && landscape && improvement && (
          <AnalysisView 
            landscape={landscape} 
            improvement={improvement} 
            onContinue={() => setStep(AppStep.AUDIT_QUESTIONS)} 
          />
        )}

        {step === AppStep.AUDIT_QUESTIONS && (
          <AuditFlow onComplete={handleAuditComplete} />
        )}

        {step === AppStep.AUDIT_RESULT && diagnosis && (
          <AuditResults 
            score={diagnosis.score} 
            risk={diagnosis.riskLevel} 
            onConsult={() => setStep(AppStep.EXPERT_REQUEST)} 
          />
        )}

        {step === AppStep.EXPERT_REQUEST && userContext && landscape && improvement && diagnosis && (
          <div className="flex flex-col items-center justify-center py-12">
            <ExpertForm 
              userContext={userContext}
              landscape={landscape}
              improvement={improvement}
              diagnosis={diagnosis}
              onSuccess={() => {
                // Optional: redirect or reload logic if handled inside component
              }} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
              <span className="font-bold">Disclaimer:</span> This analysis is indicative and based on publicly available research data. 
              It does not guarantee publication success. Outcomes depend on methodology, novelty, and journal scope.
            </p>
            <p className="text-xs text-slate-300">© 2024 BioQuest Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;