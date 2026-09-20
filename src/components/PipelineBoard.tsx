import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PipelineStage } from '../types';
import { 
  Users, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  EyeOff,
  User,
  MessageSquare,
  X,
  Briefcase,
  GraduationCap,
  Quote,
  Copy,
  Check,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  GitMerge,
  Zap
} from 'lucide-react';

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'FOUND', label: 'Found', color: 'border-stone-200' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'border-blue-300' },
  { id: 'CONTACTED', label: 'Contacted', color: 'border-indigo-300' },
  { id: 'INTERESTED', label: 'Interested', color: 'border-purple-300' },
  { id: 'SCREENING', label: 'Screening', color: 'border-amber-300' },
  { id: 'INTERVIEW', label: 'Interview', color: 'border-emerald-300' },
  { id: 'OFFER', label: 'Offer', color: 'border-teal-300' },
  { id: 'PLACED', label: 'Placed', color: 'border-green-400' },
];

export const PipelineBoard: React.FC<{
  onGoToMatching?: () => void;
  onGoToJobs?: () => void;
}> = ({ onGoToMatching, onGoToJobs }) => {
  const { 
    matches, 
    updateMatchStage, 
    candidates, 
    jobs, 
    activeJobId,
    setActiveJobId,
    blindScreeningMode, 
    t 
  } = useApp();

  const [minReadiness, setMinReadiness] = useState<number>(50);
  const [onlyCertified, setOnlyCertified] = useState<boolean>(false);
  const [onlyFastTrack, setOnlyFastTrack] = useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [interviewerNote, setInterviewerNote] = useState<string>('');

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  const selectedCandidate = selectedCandidateId ? candidates.find(c => c.id === selectedCandidateId) : null;
  const selectedCandidateMatch = selectedCandidate ? matches.find(m => m.candidateId === selectedCandidate.id && m.jobId === activeJob.id) : null;

  // Filter matches for the active job
  const relevantMatches = matches.filter(m => {
    if (m.jobId !== activeJob.id) return false;
    const cand = candidates.find(c => c.id === m.candidateId);
    if (!cand) return false;
    if (cand.readinessScore.overallScore < minReadiness) return false;
    if (onlyCertified && !cand.courseProgress.certificate) return false;
    if (onlyFastTrack && !cand.hasFastTrackPass) return false;
    return true;
  });

  return (
    <div className="h-full min-h-0 flex flex-col space-y-2.5">
      {/* Top Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">{t.pipelineBoard}</h2>
              <select
                value={activeJob.id}
                onChange={(e) => setActiveJobId(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-800 cursor-pointer focus:outline-hidden"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-stone-500">
              {relevantMatches.length} candidates in pipeline
            </p>
          </div>
        </div>

        {/* Filter Controls & Pathways */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Readiness Score Threshold */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-600">Min Readiness:</span>
            <span className="font-bold text-stone-900">{minReadiness}%</span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minReadiness}
              onChange={(e) => setMinReadiness(Number(e.target.value))}
              className="w-20 accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Only Certified Toggle */}
          <button
            onClick={() => setOnlyCertified(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              onlyCertified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certified Only</span>
          </button>

          {/* Fast-Track Priority Only Toggle */}
          <button
            onClick={() => setOnlyFastTrack(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              onlyFastTrack
                ? 'bg-purple-100 text-purple-900 border-purple-400 shadow-2xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${onlyFastTrack ? 'text-purple-600 fill-current' : 'text-stone-400'}`} />
            <span>Fast-Track</span>
          </button>

          {onGoToMatching && (
            <button
              type="button"
              onClick={onGoToMatching}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <GitMerge className="w-3.5 h-3.5 text-blue-400" />
              <span>Matching</span>
            </button>
          )}
        </div>
      </div>

      {/* Blind Screening Active Notice */}
      {blindScreeningMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-600" />
            <span>
              <strong>Blind Screening:</strong> Personal names and contact details are masked.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-200/60 px-2 py-0.5 rounded text-amber-950">
            Bias Protection
          </span>
        </div>
      )}

      {/* Horizontal Kanban Board (Cockpit Panel) */}
      <div className="flex-1 min-h-0 flex gap-2.5 overflow-x-auto overflow-y-hidden pb-1">
        {STAGES.map((stage) => {
          const stageMatches = relevantMatches
            .filter(m => m.pipelineStage === stage.id)
            .sort((a, b) => {
              const candA = candidates.find(c => c.id === a.candidateId);
              const candB = candidates.find(c => c.id === b.candidateId);
              const ftA = candA?.hasFastTrackPass ? 1 : 0;
              const ftB = candB?.hasFastTrackPass ? 1 : 0;
              if (ftA !== ftB) return ftB - ftA;
              return b.matchScore - a.matchScore;
            });

          return (
            <div
              key={stage.id}
              className="bg-stone-50/70 border border-stone-200 rounded-2xl p-2.5 w-[215px] min-w-[215px] h-full flex flex-col shrink-0 overflow-hidden"
            >
              <div className="flex flex-col h-full min-h-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                  <span className="text-xs font-bold text-stone-800 tracking-wide uppercase">
                    {stage.label}
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-white text-stone-600 px-1.5 py-0.2 rounded-full border border-stone-200">
                    {stageMatches.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-0.5">
                  {stageMatches.map((match) => {
                    const cand = candidates.find(c => c.id === match.candidateId);
                    if (!cand) return null;

                    const displayName = blindScreeningMode ? `Candidate #${cand.candidateCode}` : `${cand.firstName} ${cand.lastName}`;
                    const verifiedSkillCount = cand.skills.filter(s => s.candidateConfirmed).length;

                    return (
                      <div
                        key={match.id}
                        className={`bg-white rounded-xl p-3 border shadow-2xs hover:shadow-xs transition-all space-y-2.5 ${
                          cand.hasFastTrackPass 
                            ? 'border-purple-300 ring-1 ring-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.12)]' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {/* Top Card Line */}
                        <div 
                          className="cursor-pointer"
                          onClick={() => setSelectedCandidateId(cand.id)}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="flex items-center gap-1">
                                <h4 className="text-xs font-bold text-stone-900 line-clamp-1 hover:text-emerald-600 transition-colors">
                                  {displayName}
                                </h4>
                              </div>
                              <p className="text-[10px] text-stone-500 line-clamp-1">
                                {cand.professionalHeadline}
                              </p>
                            </div>

                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              match.matchScore >= 80 ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                            }`}>
                              {match.matchScore}%
                            </span>
                          </div>
                        </div>

                        {/* Badges: Readiness + Certified + Fast-Track */}
                        <div 
                          className="flex items-center gap-1.5 flex-wrap cursor-pointer"
                          onClick={() => setSelectedCandidateId(cand.id)}
                        >
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                            {cand.readinessScore.overallScore}% Ready
                          </span>

                          {cand.courseProgress.certificate && (
                            <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-0.5">
                              <Award className="w-3 h-3 text-amber-600" />
                              Certified
                            </span>
                          )}

                          {cand.hasFastTrackPass && (
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-md border border-purple-200 flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 text-purple-600 fill-current" />
                              Fast-Track
                            </span>
                          )}
                        </div>

                        {/* Verified facts indicator */}
                        <div 
                          className="text-[10px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-100 cursor-pointer"
                          onClick={() => setSelectedCandidateId(cand.id)}
                        >
                          <span>{verifiedSkillCount}/{cand.skills.length} verified</span>
                          <span>{cand.totalYearsExperience}y exp</span>
                        </div>

                        {/* Quick stage transition dropdown */}
                        <div className="pt-1">
                          <select
                            value={match.pipelineStage}
                            onChange={(e) => updateMatchStage(match.id, e.target.value as PipelineStage)}
                            className="w-full text-[10px] font-semibold bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-md py-1 px-1.5 text-stone-700 cursor-pointer"
                          >
                            {STAGES.map(s => (
                              <option key={s.id} value={s.id}>
                                Move to {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {stageMatches.length === 0 && (
                    <div className="py-6 text-center text-[11px] text-stone-400 border border-dashed border-stone-200/80 rounded-xl my-auto">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Selected Candidate Inspection Modal */}
        {selectedCandidate && selectedCandidateMatch && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-stone-200 bg-stone-50/70 flex items-start justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-base font-bold shrink-0">
                    {blindScreeningMode ? '#' : `${selectedCandidate.firstName[0]}${selectedCandidate.lastName[0]}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900">
                        {blindScreeningMode ? `Candidate #${selectedCandidate.candidateCode}` : `${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                      </h3>
                      {blindScreeningMode && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Blind Mode
                        </span>
                      )}
                      {selectedCandidate.courseProgress.certificate && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Certified
                        </span>
                      )}
                      {selectedCandidate.hasFastTrackPass && (
                        <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full border border-purple-300 flex items-center gap-1 shadow-2xs">
                          <Zap className="w-3 h-3 text-purple-600 fill-current" />
                          Fast-Track Priority Routing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {selectedCandidate.professionalHeadline} • {blindScreeningMode ? 'Location Hidden' : selectedCandidate.currentLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs">
                    <span className="text-xs text-stone-500 font-semibold">Stage:</span>
                    <select
                      value={selectedCandidateMatch.pipelineStage}
                      onChange={(e) => updateMatchStage(selectedCandidateMatch.id, e.target.value as PipelineStage)}
                      className="text-xs font-bold text-stone-800 bg-transparent cursor-pointer focus:outline-hidden"
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedCandidateId(null)}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Fit Score</span>
                      <p className="text-xl font-bold text-emerald-950 font-mono mt-0.5">
                        {selectedCandidateMatch.matchScore}%
                      </p>
                    </div>
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Academy Readiness</span>
                      <p className="text-xl font-bold text-blue-950 font-mono mt-0.5">
                        {selectedCandidate.readinessScore.overallScore}%
                      </p>
                    </div>
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Stage 1 Filter</span>
                      <p className="text-xs font-bold text-stone-900 mt-1">
                        {selectedCandidateMatch.stage1Passed ? 'Satisfied All Criteria' : 'Failed Filter'}
                      </p>
                    </div>
                    <CheckCircle2 className={`w-6 h-6 ${selectedCandidateMatch.stage1Passed ? 'text-emerald-600' : 'text-stone-400'}`} />
                  </div>
                </div>

                {/* Evidence Citations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-emerald-600" />
                    AI Verifiable Evidence Citations ({selectedCandidateMatch.evidenceList.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedCandidateMatch.evidenceList.map((ev, i) => (
                      <div key={i} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-stone-900">{ev.requirement}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ev.status === 'EXPLICIT_MATCH' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : ev.status === 'PARTIAL_MATCH'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ev.status.replace('_', ' ')} • {ev.confidence}%
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 italic">"{ev.evidenceText}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Interview Questions */}
                {selectedCandidateMatch.suggestedInterviewQuestions?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      Suggested Interview Questions
                    </h4>

                    <div className="space-y-2">
                      {selectedCandidateMatch.suggestedInterviewQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-blue-50/30 border border-blue-200 rounded-xl flex items-start justify-between gap-3">
                          <p className="text-xs font-medium text-stone-800">
                            <strong className="text-blue-700 font-mono mr-1.5">Q{idx + 1}:</strong>
                            "{q}"
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(q);
                              setCopiedIdx(idx);
                              setTimeout(() => setCopiedIdx(null), 2000);
                            }}
                            className="text-stone-400 hover:text-blue-700 p-1 shrink-0"
                            title="Copy Question"
                          >
                            {copiedIdx === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Skills Preview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Verified Skills ({selectedCandidate.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((s) => (
                      <span
                        key={s.id}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 ${
                          s.candidateConfirmed
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {s.skillName}
                        {s.candidateConfirmed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Evaluation Notes */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Recruiter Assessment Note
                  </label>
                  <textarea
                    rows={2}
                    value={interviewerNote}
                    onChange={(e) => setInterviewerNote(e.target.value)}
                    placeholder="Add feedback, compensation notes, or interview observations..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-stone-400 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Modal Footer Quick Actions */}
              <div className="p-4 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between gap-2 shrink-0">
                <span className="text-xs text-stone-500 font-medium">
                  Candidate: <code className="font-mono">{blindScreeningMode ? `#${selectedCandidate.candidateCode}` : `${selectedCandidate.firstName} ${selectedCandidate.lastName}`}</code>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateMatchStage(selectedCandidateMatch.id, 'SCREENING', interviewerNote || undefined);
                      setInterviewerNote('');
                      setSelectedCandidateId(null);
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Screening
                  </button>
                  <button
                    onClick={() => {
                      updateMatchStage(selectedCandidateMatch.id, 'INTERVIEW', interviewerNote || undefined);
                      setInterviewerNote('');
                      setSelectedCandidateId(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Interview
                  </button>
                  <button
                    onClick={() => {
                      updateMatchStage(selectedCandidateMatch.id, 'OFFER', interviewerNote || undefined);
                      setInterviewerNote('');
                      setSelectedCandidateId(null);
                    }}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
