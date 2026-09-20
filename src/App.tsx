import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ReUploadConflictModal } from './components/ReUploadConflictModal';
import { ResumeWorkspace } from './components/ResumeWorkspace';
import { MultimodalDiffViewer } from './components/MultimodalDiffViewer';
import { ReadinessScoreWidget } from './components/ReadinessScoreWidget';
import { CandidateProfileEditor } from './components/CandidateProfileEditor';
import { ProfessionalDevelopmentAcademy } from './components/ProfessionalDevelopmentAcademy';
import { JobRequisitionManager } from './components/JobRequisitionManager';
import { HybridMatchingViewer } from './components/HybridMatchingViewer';
import { PipelineBoard } from './components/PipelineBoard';
import { AgencyWhiteLabelSettings } from './components/AgencyWhiteLabelSettings';
import { CandidateNetworkMatchesView } from './components/CandidateNetworkMatchesModal';
import { 
  FileCheck, 
  ShieldCheck, 
  User, 
  GraduationCap, 
  Briefcase, 
  GitMerge, 
  Users, 
  Building2,
  Sparkles,
  Award,
  EyeOff,
  ArrowRight,
  Globe,
  Zap
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeRole, blindScreeningMode, activeCandidate, jobs, t } = useApp();

  // Candidate Steps: 'resume' | 'profile' | 'academy' | 'matches'
  const [candidateStep, setCandidateStep] = useState<'resume' | 'profile' | 'academy' | 'matches'>('resume');
  const [showDiffViewer, setShowDiffViewer] = useState<boolean>(false);
  const [hasUploadedResume, setHasUploadedResume] = useState<boolean>(false);

  // Recruiter Steps: 'jobs' | 'matching' | 'pipeline'
  const [recruiterStep, setRecruiterStep] = useState<'jobs' | 'matching' | 'pipeline'>('jobs');

  const pendingSkillsCount = activeCandidate.skills.filter(s => !s.candidateConfirmed).length;

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-stone-100/60 text-stone-900 flex flex-col">
      <Header />
      <ReUploadConflictModal />

      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-3 sm:px-6 py-2 flex flex-col overflow-hidden">
        {/* CANDIDATE ROLE VIEW */}
        {activeRole === 'CANDIDATE' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-2 overflow-hidden">
            {/* Centered 4-Step Candidate Pathway Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-2xl border border-stone-200 shadow-2xs shrink-0">
              <div className="hidden sm:block min-w-[140px]" /> {/* Centering spacer */}

              <nav aria-label="Candidate workflow steps" className="flex items-center gap-2 mx-auto flex-wrap justify-center">
                {[
                  { id: 'resume', stepNum: '1', label: 'Resume', icon: FileCheck },
                  { 
                    id: 'profile', 
                    stepNum: '2', 
                    label: 'Profile', 
                    icon: ShieldCheck, 
                    count: pendingSkillsCount 
                  },
                  { 
                    id: 'academy', 
                    stepNum: '3', 
                    label: 'Academy', 
                    icon: GraduationCap, 
                    badge: `${activeCandidate.readinessScore.overallScore}%` 
                  },
                  { 
                    id: 'matches', 
                    stepNum: '4', 
                    label: 'Matches', 
                    icon: Globe, 
                    badge: `${jobs.length} Live` 
                  },
                ].map((step) => {
                  const Icon = step.icon;
                  const isActive = candidateStep === step.id;
                  return (
                    <button
                      key={step.id}
                      id={`btn-step-${step.id}`}
                      onClick={() => {
                        setCandidateStep(step.id as any);
                        setShowDiffViewer(false);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border-2 ${
                        isActive
                          ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_14px_rgba(249,115,22,0.45)] ring-1 ring-orange-400 font-bold'
                          : 'bg-orange-50/40 text-stone-700 border-orange-400/80 hover:border-orange-500 hover:bg-orange-100/60 font-semibold'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isActive ? 'bg-white text-orange-600' : 'bg-orange-200 text-orange-900'
                      }`}>
                        {step.stepNum}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                      <span>{step.label}</span>
                      {step.count !== undefined && step.count > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {step.count}
                        </span>
                      )}
                      {step.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {step.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 shrink-0 sm:min-w-[140px] sm:justify-end">
                {candidateStep === 'resume' && (
                  <button
                    id="btn-proceed-to-profile-header"
                    type="button"
                    onClick={() => setCandidateStep('profile')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hasUploadedResume
                        ? 'text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_18px_rgba(249,115,22,0.65)] ring-2 ring-orange-400 animate-pulse transform hover:scale-[1.02] active:scale-[0.98]'
                        : 'text-stone-500 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <span>Continue to Profile</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${hasUploadedResume ? 'text-white' : 'text-stone-400'}`} />
                  </button>
                )}
                {candidateStep === 'profile' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDiffViewer(prev => !prev)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        showDiffViewer
                          ? 'bg-purple-50 text-purple-900 border-purple-200'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {showDiffViewer ? 'Hide Quotes' : 'Inspect Quotes'}
                    </button>
                    <button
                      id="btn-proceed-to-academy-header"
                      type="button"
                      onClick={() => setCandidateStep('academy')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_14px_rgba(249,115,22,0.5)] ring-2 ring-orange-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Continue to Academy</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                )}
                {candidateStep === 'academy' && (
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-back-to-profile-header"
                      type="button"
                      onClick={() => setCandidateStep('profile')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
                    >
                      <span>← Profile</span>
                    </button>
                    <button
                      id="btn-proceed-to-matches-header"
                      type="button"
                      onClick={() => setCandidateStep('matches')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_14px_rgba(249,115,22,0.5)] ring-2 ring-orange-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>Matches</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                )}
                {candidateStep === 'matches' && (
                  <div className="flex items-center gap-2">
                    {activeCandidate.hasFastTrackPass && (
                      <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-xl flex items-center gap-1">
                        <Zap className="w-3 h-3 text-purple-600 fill-current" />
                        Fast-Track Active
                      </span>
                    )}
                    <button
                      id="btn-back-to-academy-header"
                      type="button"
                      onClick={() => setCandidateStep('academy')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
                    >
                      <span>← Academy</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Views */}
            {candidateStep === 'resume' && (
              <ResumeWorkspace 
                onProceedToProfile={() => setCandidateStep('profile')}
                onUploadComplete={() => setHasUploadedResume(true)}
              />
            )}

            {candidateStep === 'profile' && (
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {showDiffViewer && (
                  <div className="mb-2 shrink-0 max-h-48 overflow-y-auto">
                    <MultimodalDiffViewer onDone={() => setShowDiffViewer(false)} />
                  </div>
                )}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <CandidateProfileEditor 
                    onGoToCV={() => setCandidateStep('resume')} 
                    onGoToAcademy={() => setCandidateStep('academy')} 
                  />
                </div>
              </div>
            )}

            {candidateStep === 'academy' && (
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden">
                <div className="lg:col-span-4 h-full min-h-0 overflow-hidden">
                  <ReadinessScoreWidget onStartCourse={() => {}} />
                </div>
                <div className="lg:col-span-8 h-full min-h-0 overflow-hidden">
                  <ProfessionalDevelopmentAcademy onGoToMatches={() => setCandidateStep('matches')} />
                </div>
              </div>
            )}

            {candidateStep === 'matches' && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <CandidateNetworkMatchesView 
                  isEmbedded={true} 
                  onBackToAcademy={() => setCandidateStep('academy')} 
                />
              </div>
            )}
          </div>
        )}

        {/* RECRUITER ROLE VIEW */}
        {activeRole === 'RECRUITER' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-2 overflow-hidden">
            {/* Centered 3-Step Recruiter Pathway Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-2xl border border-stone-200 shadow-2xs shrink-0">
              <div className="hidden sm:block w-24" /> {/* Centering spacer */}

              <nav aria-label="Recruiter workflow steps" className="flex items-center gap-1.5 mx-auto flex-wrap justify-center">
                {[
                  { id: 'jobs', stepNum: '1', label: 'Jobs', icon: Briefcase },
                  { id: 'matching', stepNum: '2', label: 'Matching', icon: GitMerge },
                  { id: 'pipeline', stepNum: '3', label: 'Pipeline', icon: Users },
                ].map((step) => {
                  const Icon = step.icon;
                  const isActive = recruiterStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setRecruiterStep(step.id as any);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-stone-900 text-white shadow-xs font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {step.stepNum}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-stone-400'}`} />
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 shrink-0 sm:w-24 sm:justify-end">
                {blindScreeningMode && (
                  <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xl">
                    <EyeOff className="w-3 h-3 text-amber-600" />
                    <span className="font-semibold text-[10px]">Blind Mode</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recruiter Views */}
            {recruiterStep === 'jobs' && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <JobRequisitionManager 
                  onGoToMatching={() => setRecruiterStep('matching')} 
                  onGoToPipeline={() => setRecruiterStep('pipeline')} 
                />
              </div>
            )}

            {recruiterStep === 'matching' && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <HybridMatchingViewer 
                  onGoToJobs={() => setRecruiterStep('jobs')} 
                  onGoToPipeline={() => setRecruiterStep('pipeline')} 
                />
              </div>
            )}

            {recruiterStep === 'pipeline' && (
              <div className="flex-1 min-h-0 overflow-hidden">
                <PipelineBoard 
                  onGoToMatching={() => setRecruiterStep('matching')} 
                  onGoToJobs={() => setRecruiterStep('jobs')} 
                />
              </div>
            )}
          </div>
        )}

        {/* AGENCY ADMIN VIEW */}
        {activeRole === 'AGENCY_ADMIN' && (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <AgencyWhiteLabelSettings />
          </div>
        )}
      </main>

      {/* Sleek, Compact Footer (fits on one page without forced scrolling) */}
      <footer className="border-t border-stone-200/80 bg-white/95 backdrop-blur-xs py-1 mt-auto shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-900 tracking-tight">{t.appName}</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-600">Verifiable AI Sourcing & DMT</span>
          </div>

          <div className="flex items-center gap-2 text-stone-400 text-[10px] flex-wrap justify-center">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Human Confirmation Enforced
            </span>
            <span>•</span>
            <span>Deterministic Filtering</span>
            <span>•</span>
            <span>Zero Hallucinations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
