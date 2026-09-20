import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  X, 
  Briefcase, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  Award, 
  Building2, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { JobRequisition, PipelineStage, JobMatchResult } from '../types';

export const CandidateNetworkMatchesView: React.FC<{
  onClose?: () => void;
  isEmbedded?: boolean;
  onBackToAcademy?: () => void;
}> = ({ onClose, isEmbedded = false, onBackToAcademy }) => {
  const { 
    activeCandidate, 
    jobs, 
    matches, 
    updateMatchStage, 
    addNewMatch, 
    updateCandidate,
    addAuditEvent 
  } = useApp();

  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [justAppliedJobId, setJustAppliedJobId] = useState<string | null>(null);
  const [passActivatedSuccess, setPassActivatedSuccess] = useState<boolean>(false);

  // Calculate or find match for every job
  const candidateMatches = jobs.map(job => {
    const existing = matches.find(m => m.jobId === job.id && m.candidateId === activeCandidate.id);
    
    // Calculate alignment
    const minExp = job.structuredRequirements?.minimumYearsExperience || 3;
    const passedExp = activeCandidate.totalYearsExperience >= minExp;
    const matchedSkills = activeCandidate.skills.filter(s => 
      job.structuredRequirements?.mustHave.some(req => 
        req.toLowerCase().includes(s.skillName.toLowerCase()) || 
        s.skillName.toLowerCase().includes(req.toLowerCase())
      )
    );

    const score = existing ? existing.matchScore : Math.min(98, Math.max(74, 
      (passedExp ? 42 : 28) + 
      Math.min(34, matchedSkills.length * 12) + 
      Math.round(activeCandidate.readinessScore.overallScore * 0.24)
    ));

    return {
      job,
      existingMatch: existing,
      score,
      matchedSkills,
      passedExp,
      stage: existing ? existing.pipelineStage : ('FOUND' as PipelineStage)
    };
  }).sort((a, b) => b.score - a.score);

  // Filter by sector
  const filteredMatches = candidateMatches.filter(item => {
    if (selectedSector === 'All Sectors') return true;
    const term = selectedSector.toLowerCase();
    return (
      item.job.industry?.toLowerCase().includes(term) ||
      item.job.department.toLowerCase().includes(term) ||
      item.job.title.toLowerCase().includes(term)
    );
  });

  const handleApplyInterest = (item: typeof candidateMatches[0]) => {
    if (item.existingMatch) {
      updateMatchStage(item.existingMatch.id, 'INTERESTED', 'Candidate submitted 1-click express interest from Universal Talent Network.');
    } else {
      const newMatch: JobMatchResult = {
        id: `match-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        jobId: item.job.id,
        candidateId: activeCandidate.id,
        matchScore: item.score,
        stage1Passed: item.passedExp,
        stage1FilterNotes: [
          `Candidate expressed direct interest via Universal Network.`,
          `Experience: ${activeCandidate.totalYearsExperience} yrs satisfies requirement of ${item.job.structuredRequirements?.minimumYearsExperience || 3}+ yrs.`
        ],
        evidenceList: item.matchedSkills.map((sk, idx) => ({
          id: `ev-cand-${idx}-${Date.now()}`,
          requirement: sk.skillName,
          category: 'MUST_HAVE',
          status: 'EXPLICIT_MATCH',
          evidenceText: `Verified skill in ${sk.category}: "${sk.skillName}" with ${sk.aiConfidence}% confidence.`,
          sourceSection: 'Candidate Profile & CV',
          confidence: sk.aiConfidence
        })),
        potentialConcerns: [],
        recommendationSummary: `High interest expressed directly by candidate. Candidate holds verified ${item.score}% skill alignment.`,
        pipelineStage: 'INTERESTED',
        updatedAt: new Date().toISOString()
      };
      addNewMatch(newMatch);
    }

    setJustAppliedJobId(item.job.id);
    addAuditEvent('CANDIDATE_EXPRESSED_INTEREST', `Candidate ${activeCandidate.firstName} ${activeCandidate.lastName} submitted 1-click express interest for job "${item.job.title}".`);
    setTimeout(() => setJustAppliedJobId(null), 3000);
  };

  const handleActivateFastTrackPass = () => {
    updateCandidate({
      ...activeCandidate,
      hasFastTrackPass: true,
      fastTrackActivatedAt: new Date().toISOString(),
      readinessScore: {
        ...activeCandidate.readinessScore,
        verificationStatus: 100,
        overallScore: Math.min(100, activeCandidate.readinessScore.overallScore + 4)
      }
    });

    addAuditEvent('FAST_TRACK_PASS_PURCHASED', `Candidate ${activeCandidate.firstName} ${activeCandidate.lastName} activated Universal Fast-Track Pass ($49). Priority employer routing unlocked.`);
    setPassActivatedSuccess(true);
    setTimeout(() => setPassActivatedSuccess(false), 4000);
  };

  return (
    <div className={`bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col ${
      isEmbedded ? 'h-full min-h-0' : 'max-w-4xl w-full max-h-[92vh] my-auto'
    }`}>
      {/* TOP HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shrink-0 border-b border-indigo-900/50 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
            <Globe className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white">
                Universal AI Network Matches
              </h2>
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                100% Automated Matching
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Evaluated for {activeCandidate.firstName} {activeCandidate.lastName} ({activeCandidate.readinessScore.overallScore}% Readiness) across all multi-industry employer feeds.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* FAST-TRACK PASS BANNER */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border-b border-purple-200/80 p-3 sm:p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-stone-900">
                Universal Fast-Track Priority Pass
              </h3>
              {activeCandidate.hasFastTrackPass ? (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Pass
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                  $49 One-Time
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Places your profile at the top of screening queues for 1,420+ connected employers across all 6 sectors.
            </p>
          </div>
        </div>

        {!activeCandidate.hasFastTrackPass ? (
          <button
            onClick={handleActivateFastTrackPass}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Activate Fast-Track ($49)</span>
          </button>
        ) : (
          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Priority Status Active</span>
            <span className="text-[11px] text-stone-500 font-mono">Verified Dossier Attached</span>
          </div>
        )}
      </div>

      {passActivatedSuccess && (
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fast-Track Pass Activated: Your profile is now prioritized across all hiring partner pipelines.</span>
        </div>
      )}

      {/* SECTOR FILTER TABS */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-stone-200 bg-stone-50/70 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        {['All Sectors', 'Tech', 'Healthcare', 'Executive', 'Finance', 'RevOps', 'Legal'].map((sec) => {
          const isSelected = selectedSector === sec || (sec === 'Tech' && selectedSector === 'Technology & Cloud');
          return (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec === 'Tech' ? 'Technology & Cloud' : sec)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-white text-stone-600 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              {sec}
            </button>
          );
        })}
      </div>

      {/* MATCHES LIST */}
      <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3 flex-1 min-h-0">
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>Showing {filteredMatches.length} matching requisitions for your skill profile</span>
          <span className="text-[11px] text-emerald-700 font-bold">Zero Industry Borders</span>
        </div>

        {filteredMatches.map(({ job, existingMatch, score, matchedSkills, passedExp, stage }) => {
          const isInterested = stage === 'INTERESTED' || stage === 'SHORTLISTED' || stage === 'INTERVIEW' || stage === 'OFFER' || stage === 'PLACED';
          const justApplied = justAppliedJobId === job.id;

          return (
            <div
              key={job.id}
              className="p-4 rounded-2xl border border-stone-200 hover:border-indigo-300 bg-white shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-stone-900">{job.title}</h3>
                    {job.industry && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {job.industry}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-stone-500">
                      {job.department}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-600 mt-1 flex-wrap">
                    <span className="font-semibold text-emerald-800">
                      ${(job.salaryMin / 1000)}k - ${(job.salaryMax / 1000)}k {job.currency}
                    </span>
                    <span>•</span>
                    <span>{job.location} ({job.workArrangement})</span>
                    <span>•</span>
                    <span>{job.structuredRequirements?.minimumYearsExperience || 3}+ Yrs Experience</span>
                  </div>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block leading-none">Match</span>
                    <span className={`text-base font-black leading-none mt-0.5 ${
                      score >= 85 ? 'text-emerald-700' : 'text-blue-700'
                    }`}>
                      {score}%
                    </span>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                    score >= 85 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                      : 'border-blue-500 bg-blue-50 text-blue-800'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>

              {/* Overlapping Verified Skills */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400 block">
                  Verified Competencies Matched from CV ({matchedSkills.length})
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {matchedSkills.slice(0, 6).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-stone-100 text-stone-800 px-2 py-0.5 rounded-lg border border-stone-200 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{sk.skillName}</span>
                    </span>
                  ))}
                  {matchedSkills.length === 0 && (
                    <span className="text-xs text-stone-400 italic">
                      Cross-functional leadership & domain experience aligned
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 text-[11px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Deterministic matching verified against job requisition criteria</span>
                </div>

                <div className="flex items-center gap-2">
                  {isInterested ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Interest Registered ({stage})</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyInterest({ job, existingMatch, score, matchedSkills, passedExp, stage })}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        justApplied 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>{justApplied ? 'Interest Sent!' : '1-Click Express Interest'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToAcademy && (
            <button
              onClick={onBackToAcademy}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              ← Back to Academy
            </button>
          )}
          <span className="hidden sm:inline">Universal AI Talent Network • Multi-Sector Talent Exchange</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Close Matches
          </button>
        )}
      </div>
    </div>
  );
};

export const CandidateNetworkMatchesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <CandidateNetworkMatchesView onClose={onClose} isEmbedded={false} />
    </div>
  );
};
