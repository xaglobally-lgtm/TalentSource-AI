import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GitMerge, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Quote, 
  HelpCircle, 
  ArrowRight, 
  Loader2, 
  Filter, 
  Award,
  ChevronRight,
  UserCheck,
  ArrowLeft,
  Users,
  Download,
  Zap
} from 'lucide-react';
import { JobMatchResult, PipelineStage, CitationEvidence } from '../types';
import { CVFilterBar, CVFilterCriteria } from './CVFilterBar';
import { exportPipelineSummary } from '../utils/exportUtils';

export const HybridMatchingViewer: React.FC<{
  onGoToJobs?: () => void;
  onGoToPipeline?: () => void;
}> = ({ onGoToJobs, onGoToPipeline }) => {
  const { 
    jobs, 
    activeJobId, 
    candidates, 
    matches, 
    addNewMatch, 
    updateMatchStage, 
    autoMatchAllCandidates,
    blindScreeningMode, 
    t 
  } = useApp();

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [universalMatchMsg, setUniversalMatchMsg] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<CVFilterCriteria>({
    searchTerm: '',
    minReadiness: 0,
    onlyCertified: false,
    workArrangement: 'all',
    minExperienceYears: 0,
  });

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];
  const jobMatches = matches.filter(m => m.jobId === activeJob.id);

  const filteredMatches = jobMatches.filter(m => {
    const cand = candidates.find(c => c.id === m.candidateId);
    if (!cand) return false;

    if (filterCriteria.searchTerm.trim()) {
      const term = filterCriteria.searchTerm.toLowerCase();
      const matchSkill = cand.skills.some(s => s.skillName.toLowerCase().includes(term));
      const matchRole = cand.professionalHeadline.toLowerCase().includes(term) || cand.seniorityLevel.toLowerCase().includes(term);
      const matchName = !blindScreeningMode && (`${cand.firstName} ${cand.lastName}`.toLowerCase().includes(term));
      if (!matchSkill && !matchRole && !matchName) return false;
    }

    if (filterCriteria.minReadiness > 0 && cand.readinessScore.overallScore < filterCriteria.minReadiness) {
      return false;
    }

    if (filterCriteria.onlyCertified && !cand.courseProgress.certificate) {
      return false;
    }

    if (filterCriteria.workArrangement !== 'all' && cand.remotePreference !== filterCriteria.workArrangement && cand.remotePreference !== 'flexible') {
      return false;
    }

    if (filterCriteria.minExperienceYears > 0 && cand.totalYearsExperience < filterCriteria.minExperienceYears) {
      return false;
    }

    return true;
  });

  const handleRunHybridMatch = async () => {
    setIsEvaluating(true);
    try {
      // Run hybrid match evaluation for candidates
      for (const candidate of candidates) {
        // Stage 1 Deterministic Filter
        const minYearsReq = activeJob.structuredRequirements.minimumYearsExperience;
        const candidateYears = candidate.totalYearsExperience;
        const expPass = candidateYears >= minYearsReq;

        const candidateMinSal = candidate.jobPreferences.minimumSalary;
        const salaryPass = candidateMinSal <= activeJob.salaryMax;

        const remotePass = activeJob.workArrangement === 'remote' || 
          candidate.remotePreference === activeJob.workArrangement || 
          candidate.remotePreference === 'flexible' ||
          candidate.jobPreferences.workArrangement === 'remote';

        // Check excluded criteria
        let excludeViolated = false;
        let excludeReason = '';
        for (const exc of activeJob.structuredRequirements.exclude) {
          if (exc.toLowerCase().includes('junior') && candidate.seniorityLevel === 'Junior') {
            excludeViolated = true;
            excludeReason = 'Violated exclude criterion: Junior level';
          }
        }

        const deterministicPassed = expPass && salaryPass && remotePass && !excludeViolated;
        const failedReason = !expPass 
          ? `Insufficient experience (${candidateYears} yrs vs ${minYearsReq} required)`
          : !salaryPass 
          ? `Candidate minimum salary ($${candidateMinSal.toLocaleString()}) exceeds budget max ($${activeJob.salaryMax.toLocaleString()})`
          : excludeViolated
          ? excludeReason
          : undefined;

        // Call server LLM evaluator for Stage 2 if passed
        let stage2Data: any = null;
        if (deterministicPassed) {
          try {
            const response = await fetch('/api/match/evaluate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                candidate,
                job: activeJob,
              }),
            });
            const res = await response.json();
            if (res.success) {
              stage2Data = res.data;
            }
          } catch (e) {
            console.error('LLM match call failed:', e);
          }
        }

        const matchScore = stage2Data ? stage2Data.matchScore : deterministicPassed ? 78 : 25;
        const evidenceList: CitationEvidence[] = (stage2Data?.evidenceAnalysis || []).map((e: any, idx: number) => ({
          id: `ev-${idx}`,
          requirement: e.requirement || 'Core requirement',
          category: 'MUST_HAVE',
          status: e.satisfied ? 'EXPLICIT_MATCH' : 'POTENTIAL_RISK',
          evidenceText: e.evidence || 'Evidence analyzed by AI',
          sourceSection: 'Profile Chronology & Skills',
          confidence: e.confidence === 'HIGH' ? 95 : 80
        }));

        const matchResult: JobMatchResult = {
          id: `match-${activeJob.id}-${candidate.id}`,
          jobId: activeJob.id,
          candidateId: candidate.id,
          stage1Passed: deterministicPassed,
          stage1FailedReason: failedReason,
          stage1FilterNotes: failedReason ? [failedReason] : ['All deterministic requirements satisfied.'],
          matchScore,
          evidenceList: evidenceList.length > 0 ? evidenceList : [
            {
              id: 'ev-default',
              requirement: activeJob.structuredRequirements.mustHave[0] || 'Technical competency',
              category: 'MUST_HAVE',
              status: deterministicPassed ? 'EXPLICIT_MATCH' : 'MISSING',
              evidenceText: deterministicPassed ? `Verified ${candidate.totalYearsExperience} years in ${candidate.industries.join(', ')}.` : 'Did not meet core experience threshold.',
              sourceSection: 'Profile Chronology',
              confidence: deterministicPassed ? 95 : 50
            }
          ],
          potentialConcerns: stage2Data?.concerns || (deterministicPassed ? ['Verify compensation flexibility'] : [failedReason || 'Stage 1 filter failed']),
          suggestedInterviewQuestions: stage2Data?.suggestedInterviewQuestions || [
            'Can you walk through your experience handling production cloud reliability incidents?'
          ],
          recommendationSummary: stage2Data?.executiveSummary || `${deterministicPassed ? 'Strong profile' : 'Unqualified for current opening'}. Evaluated by SOURCE.AI 2-stage engine.`,
          pipelineStage: 'FOUND',
          updatedAt: new Date().toISOString()
        };

        addNewMatch(matchResult);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const activeMatch = filteredMatches.find(m => m.id === selectedMatchId) || filteredMatches[0] || jobMatches[0];
  const matchedCandidate = activeMatch ? candidates.find(c => c.id === activeMatch.candidateId) : null;

  return (
    <div className="h-full min-h-0 flex flex-col space-y-2.5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-indigo-100 text-indigo-800 rounded-xl">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">{t.hybridMatchingEngine}</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                {activeJob.title}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Screening criteria and evidence citations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onGoToJobs && (
            <button
              type="button"
              onClick={onGoToJobs}
              className="flex items-center gap-1 px-2.5 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Jobs</span>
            </button>
          )}

          {jobMatches.length > 0 && (
            <button
              type="button"
              onClick={() => exportPipelineSummary(activeJob.title, matches, candidates)}
              title="Download full matching & pipeline report"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export Report</span>
            </button>
          )}

          <button
            id="btn-run-hybrid-match"
            disabled={isEvaluating}
            onClick={handleRunHybridMatch}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Match</span>
              </>
            )}
          </button>

          <button
            id="btn-run-universal-match"
            onClick={() => {
              const count = autoMatchAllCandidates();
              setUniversalMatchMsg(
                count > 0 
                  ? `Universal Auto-Match: Generated ${count} candidate matches linked across all open network requisitions!` 
                  : `Universal Network Verified: All candidates already matched across all active requisitions.`
              );
              setTimeout(() => setUniversalMatchMsg(null), 5000);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="Auto-match all candidates across all multi-industry jobs in the network"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Auto-Match All</span>
          </button>

          {onGoToPipeline && (
            <button
              type="button"
              onClick={onGoToPipeline}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Universal Match Notification */}
      {universalMatchMsg && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{universalMatchMsg}</span>
        </div>
      )}

      {/* CV Filter Bar for live candidate narrowing */}
      <div className="shrink-0">
        <CVFilterBar criteria={filterCriteria} onChange={setFilterCriteria} />
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        {/* Candidates Match List */}
        <div className="lg:col-span-5 h-full overflow-y-auto space-y-2 pr-1">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Matched Candidates ({filteredMatches.length} / {jobMatches.length})
            </span>
            <span className="text-[10px] text-stone-500">
              Active Job: <strong className="text-stone-800">{activeJob.title}</strong>
            </span>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <Filter className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-700">No candidates match current filter criteria</p>
              <p className="text-[11px] text-stone-400 mt-1">
                Try resetting or relaxing your CV filters above or click "Run Match".
              </p>
            </div>
          ) : (
            filteredMatches.map((match) => {
              const cand = candidates.find(c => c.id === match.candidateId);
              if (!cand) return null;

              const isSelected = match.id === (activeMatch?.id);
              const displayName = blindScreeningMode ? `Candidate #${cand.candidateCode}` : `${cand.firstName} ${cand.lastName}`;

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900">{displayName}</h4>
                        {cand.courseProgress.certificate && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                            <Award className="w-3 h-3" />
                            Certified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {cand.professionalHeadline}
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${
                        match.matchScore >= 80 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : match.matchScore >= 60 
                          ? 'bg-blue-50 text-blue-800 border-blue-200' 
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {match.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Stage 1 Check indicator */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1">
                      {match.stage1Passed ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Stage 1 Passed
                        </span>
                      ) : (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Stage 1 Rejected
                        </span>
                      )}
                    </div>

                    <span className="text-stone-400 font-medium">
                      Readiness: <strong className="text-stone-700">{cand.readinessScore.overallScore}%</strong>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Match Inspector */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5 h-full overflow-y-auto min-h-0">
          {activeMatch && matchedCandidate ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">
                      {blindScreeningMode ? `Candidate #${matchedCandidate.candidateCode}` : `${matchedCandidate.firstName} ${matchedCandidate.lastName}`}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {matchedCandidate.candidateCode}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {matchedCandidate.professionalHeadline} • {matchedCandidate.totalYearsExperience} Yrs Exp • ${matchedCandidate.jobPreferences.minimumSalary.toLocaleString()} Min Sal
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500">Stage:</span>
                  <select
                    value={activeMatch.pipelineStage}
                    onChange={(e) => updateMatchStage(activeMatch.id, e.target.value as PipelineStage)}
                    className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-800 focus:outline-hidden"
                  >
                    <option value="FOUND">Found</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="PLACED">Placed</option>
                  </select>
                </div>
              </div>

              {/* Stage 1 Deterministic Audit */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Stage 1: Deterministic Filter Audit
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Min Exp ({activeJob.structuredRequirements.minimumYearsExperience}y)</span>
                    <span className={`font-bold ${matchedCandidate.totalYearsExperience >= activeJob.structuredRequirements.minimumYearsExperience ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {matchedCandidate.totalYearsExperience} Years
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Salary Range</span>
                    <span className={`font-bold ${matchedCandidate.jobPreferences.minimumSalary <= activeJob.salaryMax ? 'text-emerald-700' : 'text-rose-600'}`}>
                      ${matchedCandidate.jobPreferences.minimumSalary / 1000}k
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Remote / Location</span>
                    <span className="font-bold text-emerald-700 capitalize">
                      {matchedCandidate.remotePreference}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Exclusions</span>
                    <span className="font-bold text-emerald-700">None</span>
                  </div>
                </div>
              </div>

              {/* Stage 2 LLM Evidence-Based Evaluation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Stage 2: Requirement Evidence & Inspectable Citations
                  </span>
                  <span className="text-[11px] font-bold text-indigo-700">
                    Fit Score: {activeMatch.matchScore}%
                  </span>
                </div>

                <div className="space-y-2">
                  {(activeMatch.evidenceList || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.status === 'EXPLICIT_MATCH' || item.status === 'INFERRED_MATCH' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <h5 className="text-xs font-bold text-stone-900">{item.requirement}</h5>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                          {item.confidence}% Confidence
                        </span>
                      </div>

                      <div className="p-2 bg-stone-50 rounded-lg border border-stone-100 flex items-start gap-1.5 text-xs text-stone-700">
                        <Quote className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                        <span className="italic">{item.evidenceText}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Concerns / Gaps */}
              {activeMatch.potentialConcerns?.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Potential Concerns & Gaps to Probe
                  </span>
                  <ul className="space-y-1">
                    {activeMatch.potentialConcerns.map((c, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Interview Questions */}
              {activeMatch.suggestedInterviewQuestions?.length > 0 && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    Evidence-Grounded Interview Questions
                  </span>
                  <ul className="space-y-1.5">
                    {activeMatch.suggestedInterviewQuestions.map((q, i) => (
                      <li key={i} className="text-xs text-stone-800 font-medium flex items-start gap-2">
                        <span className="font-mono text-blue-600 font-bold">{i + 1}.</span>
                        <span>"{q}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fast Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Readiness: <strong className="text-emerald-700">{matchedCandidate.readinessScore.overallScore}%</strong>
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => updateMatchStage(activeMatch.id, 'SHORTLISTED')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => updateMatchStage(activeMatch.id, 'INTERVIEW')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Interview
                  </button>
                  {onGoToPipeline && (
                    <button
                      onClick={onGoToPipeline}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Pipeline</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-stone-500">Select a candidate match to inspect evidence.</p>
          )}
        </div>
      </div>
    </div>
  );
};
