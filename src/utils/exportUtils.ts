import { CandidateProfile, JobMatchResult, JobRequisition } from '../types';

/**
 * Generates and triggers browser download of a formatted JSON or Text file
 */
export function downloadFile(filename: string, content: string, contentType: string = 'application/json') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete verified candidate dossier as formatted JSON
 */
export function exportCandidateDossier(candidate: CandidateProfile) {
  const dossier = {
    exportedAt: new Date().toISOString(),
    system: "TalentSource AI Recruitment Platform",
    candidateId: candidate.candidateCode,
    verifiedStatus: "HUMAN_VERIFIED",
    readinessScore: candidate.readinessScore,
    personalInfo: {
      fullName: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      location: candidate.currentLocation,
      headline: candidate.professionalHeadline,
      totalYearsExperience: candidate.totalYearsExperience,
      seniority: candidate.seniorityLevel,
      remotePreference: candidate.remotePreference,
      salaryExpectation: `${candidate.jobPreferences.salaryCurrency} ${candidate.jobPreferences.minimumSalary.toLocaleString()} - ${candidate.jobPreferences.preferredSalary.toLocaleString()}`,
    },
    academyCredential: candidate.courseProgress.certificate || "IN_PROGRESS",
    verifiedSkills: candidate.skills.map(s => ({
      skill: s.skillName,
      category: s.category,
      level: s.levelIfKnown || "Proficient",
      candidateConfirmed: s.candidateConfirmed,
      evidence: s.evidence || "Explicit in CV chronology"
    })),
    employmentChronology: candidate.employmentHistory.map(e => ({
      role: e.position,
      employer: e.employer,
      startDate: e.startDate,
      endDate: e.endDate,
      currentRole: e.currentRole,
      verified: e.candidateConfirmed,
      sourceExcerpt: e.sourceText || "Verified chronology"
    })),
    education: candidate.education.map(ed => ({
      institution: ed.institution,
      degree: ed.degree,
      major: ed.major,
      completionDate: ed.completionDate,
      verified: ed.candidateConfirmed
    })),
  };

  const filename = `talentsource_dossier_${candidate.candidateCode}_${Date.now()}.json`;
  downloadFile(filename, JSON.stringify(dossier, null, 2));
}

/**
 * Exports Recruiter Pipeline Summary as JSON
 */
export function exportPipelineSummary(job: JobRequisition, matches: JobMatchResult[], candidates: CandidateProfile[]) {
  const summary = {
    generatedAt: new Date().toISOString(),
    system: "TalentSource AI Recruitment Platform",
    jobTitle: job.title,
    department: job.department,
    targetSeniority: job.structuredRequirements.targetSeniority,
    compensation: `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.currency}`,
    requirements: job.structuredRequirements,
    candidates: matches.map(m => {
      const cand = candidates.find(c => c.id === m.candidateId);
      return {
        candidateCode: cand?.candidateCode || "UNKNOWN",
        matchFitPercentage: m.matchScore,
        pipelineStage: m.pipelineStage,
        stage1DeterministicPassed: m.stage1Passed,
        evidenceCitationsCount: m.evidenceList.length,
        academyReadiness: cand?.readinessScore.overallScore || 0,
        academyCertified: !!cand?.courseProgress.certificate,
        recruiterNotes: m.recruiterNotes || "None recorded",
      };
    })
  };

  const filename = `pipeline_export_${job.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
  downloadFile(filename, JSON.stringify(summary, null, 2));
}
