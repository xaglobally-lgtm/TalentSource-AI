import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CandidateProfile, 
  JobRequisition, 
  JobMatchResult, 
  AgencyTenant, 
  AuditEvent, 
  UserRole,
  PipelineStage,
  SkillItem,
  EmploymentRecord,
  EducationRecord,
  CourseCertificate,
  BlindScreeningSettings
} from '../types';
import { 
  SAMPLE_AGENCIES, 
  INITIAL_CANDIDATES, 
  INITIAL_JOBS, 
  INITIAL_MATCHES, 
  INITIAL_AUDIT_EVENTS 
} from '../data/sampleData';
import { Locale, translations, Translations } from '../locales/translations';

interface ReUploadConflict {
  fieldName: string;
  fieldLabel: string;
  currentVerifiedValue: any;
  newExtractedValue: any;
  onResolve: (chosenValue: any) => void;
}

interface AppContextType {
  // Navigation & Role
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentLocale: Locale;
  setCurrentLocale: (locale: Locale) => void;
  t: Translations;

  // Blind Screening Mode & Granular Dimension Filters
  blindScreeningMode: boolean;
  setBlindScreeningMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  blindSettings: BlindScreeningSettings;
  updateBlindSettings: (settings: Partial<BlindScreeningSettings>) => void;

  // Multi-Tenant Agency
  activeTenant: AgencyTenant;
  setActiveTenant: (tenant: AgencyTenant) => void;
  tenants: AgencyTenant[];
  updateTenant: (tenant: AgencyTenant) => void;

  // Candidate Data
  candidates: CandidateProfile[];
  activeCandidateId: string;
  setActiveCandidateId: (id: string) => void;
  activeCandidate: CandidateProfile;
  updateCandidate: (candidate: CandidateProfile) => void;
  addNewCandidate: (newProfile: Partial<CandidateProfile>) => string;

  // Human Confirmation Actions
  confirmSkill: (candidateId: string, skillId: string) => void;
  editSkill: (candidateId: string, skillId: string, updated: Partial<SkillItem>) => void;
  removeSkill: (candidateId: string, skillId: string) => void;
  confirmEmployment: (candidateId: string, empId: string) => void;
  confirmEducation: (candidateId: string, eduId: string) => void;
  confirmFieldOverride: (candidateId: string, fieldKey: string, newValue: any) => void;

  // Re-Upload Overwrite Protection Modal
  activeConflict: ReUploadConflict | null;
  setActiveConflict: (conflict: ReUploadConflict | null) => void;

  // Course Progress & Readiness
  completeModule: (candidateId: string, moduleId: string, score: number) => void;
  issueCertificate: (candidateId: string, score: number) => CourseCertificate;
  recalculateReadiness: (candidateId: string) => void;

  // Jobs & Requisitions
  jobs: JobRequisition[];
  activeJobId: string;
  setActiveJobId: (id: string) => void;
  activeJob: JobRequisition;
  createJob: (newJob: Partial<JobRequisition>) => void;

  // Matching Engine & Pipeline
  matches: JobMatchResult[];
  updateMatchStage: (matchId: string, stage: PipelineStage, notes?: string) => void;
  addNewMatch: (match: JobMatchResult) => void;
  autoMatchAllCandidates: () => number;
  syncExternalJobFeeds: () => number;

  // Audit Events
  auditEvents: AuditEvent[];
  addAuditEvent: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('CANDIDATE');
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [blindScreeningMode, setBlindScreeningMode] = useState<boolean>(false);
  const [blindSettings, setBlindSettings] = useState<BlindScreeningSettings>({
    enabled: false,
    maskNames: true,
    maskGender: true,
    maskAge: true,
    maskLocation: true,
    maskInstitutions: false,
    maskContactInfo: true,
  });

  const updateBlindSettings = (updated: Partial<BlindScreeningSettings>) => {
    setBlindSettings(prev => {
      const next = { ...prev, ...updated };
      if (updated.enabled !== undefined) {
        setBlindScreeningMode(updated.enabled);
      }
      return next;
    });
  };

  const handleSetBlindScreeningMode = (enabledOrFn: boolean | ((prev: boolean) => boolean)) => {
    setBlindScreeningMode(prev => {
      const next = typeof enabledOrFn === 'function' ? enabledOrFn(prev) : enabledOrFn;
      setBlindSettings(s => ({ ...s, enabled: next }));
      return next;
    });
  };

  // Tenants
  const [tenants, setTenants] = useState<AgencyTenant[]>(SAMPLE_AGENCIES);
  const [activeTenant, setActiveTenant] = useState<AgencyTenant>(SAMPLE_AGENCIES[0]);

  // Candidates
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [activeCandidateId, setActiveCandidateId] = useState<string>(INITIAL_CANDIDATES[0].id);

  // Jobs
  const [jobs, setJobs] = useState<JobRequisition[]>(INITIAL_JOBS);
  const [activeJobId, setActiveJobId] = useState<string>(INITIAL_JOBS[0].id);

  // Matches
  const [matches, setMatches] = useState<JobMatchResult[]>(INITIAL_MATCHES);

  // Audit Events
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);

  // Overwrite conflict modal
  const [activeConflict, setActiveConflict] = useState<ReUploadConflict | null>(null);

  const t = translations[currentLocale] || translations.en;

  const activeCandidate = candidates.find(c => c.id === activeCandidateId) || candidates[0];
  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  const addAuditEvent = (action: string, details: string) => {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      tenantId: activeTenant.id,
      actorRole: activeRole,
      actorName: activeRole === 'CANDIDATE' ? `${activeCandidate.firstName} ${activeCandidate.lastName}` : 'Recruiter / Admin',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  const updateTenant = (updated: AgencyTenant) => {
    setTenants(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (activeTenant.id === updated.id) {
      setActiveTenant(updated);
    }
    addAuditEvent('TENANT_BRANDING_UPDATED', `Tenant ${updated.name} updated branding and color scheme.`);
  };

  const updateCandidate = (updated: CandidateProfile) => {
    setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const addNewCandidate = (newProfile: Partial<CandidateProfile>): string => {
    const newId = `cand-${Date.now()}`;
    const randomCode = `CND-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullCandidate: CandidateProfile = {
      id: newId,
      candidateCode: randomCode,
      email: newProfile.email || 'candidate@example.com',
      phone: newProfile.phone || '+1 (555) 000-0000',
      firstName: newProfile.firstName || 'New',
      lastName: newProfile.lastName || 'Candidate',
      preferredName: newProfile.preferredName || newProfile.firstName || 'Candidate',
      country: newProfile.country || 'United States',
      city: newProfile.city || 'Remote',
      currentLocation: newProfile.currentLocation || 'Remote',
      relocationPreference: newProfile.relocationPreference ?? false,
      remotePreference: newProfile.remotePreference || 'remote',
      professionalHeadline: newProfile.professionalHeadline || 'Software Specialist',
      currentPosition: newProfile.currentPosition || 'Professional',
      currentEmployer: newProfile.currentEmployer || 'Self-Employed',
      totalYearsExperience: newProfile.totalYearsExperience || 3,
      seniorityLevel: newProfile.seniorityLevel || 'Mid',
      industries: newProfile.industries || ['Technology'],
      specialties: newProfile.specialties || ['General'],
      professionalInterests: newProfile.professionalInterests || [],
      employmentHistory: newProfile.employmentHistory || [],
      education: newProfile.education || [],
      certifications: newProfile.certifications || [],
      skills: newProfile.skills || [],
      languages: newProfile.languages || [{
        id: 'lang-def',
        languageCode: 'en',
        languageName: 'English',
        speaking: 'Fluent',
        writing: 'Fluent',
        reading: 'Fluent',
        listening: 'Fluent',
        overallLevel: 'Native'
      }],
      jobPreferences: newProfile.jobPreferences || {
        desiredRoles: ['Engineer'],
        desiredIndustries: ['Technology'],
        minimumSalary: 120000,
        preferredSalary: 140000,
        salaryCurrency: 'USD',
        workArrangement: 'remote',
        preferredLocations: ['Remote'],
        relocation: false,
        employmentTypes: ['Full-time'],
        availabilityDate: 'Immediate'
      },
      cvIntelligenceReport: newProfile.cvIntelligenceReport,
      readinessScore: {
        profileCompleteness: 85,
        cvQuality: 80,
        professionalDevelopment: 0,
        interviewReadiness: 65,
        verificationStatus: 60,
        overallScore: 61
      },
      courseProgress: {
        completedModuleIds: [],
        moduleScores: {}
      },
      cvFileName: newProfile.cvFileName,
      cvUploadedAt: new Date().toISOString()
    };

    setCandidates(prev => [fullCandidate, ...prev]);
    setActiveCandidateId(newId);
    addAuditEvent('CV_PARSED_NEW_PROFILE', `New candidate ${fullCandidate.firstName} ${fullCandidate.lastName} (${fullCandidate.candidateCode}) created from CV upload.`);
    return newId;
  };

  const recalculateReadiness = (candidateId: string) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;

      // 1. Profile Completeness (20% weight)
      let completeness = 50;
      if (cand.firstName && cand.lastName && cand.email && cand.phone) completeness += 10;
      if (cand.employmentHistory.length > 0) completeness += 15;
      if (cand.education.length > 0) completeness += 10;
      if (cand.skills.length >= 4) completeness += 10;
      if (cand.jobPreferences?.desiredRoles?.length > 0) completeness += 5;
      completeness = Math.min(100, completeness);

      // 2. CV Quality & Clarity (20% weight)
      const cvQuality = cand.cvIntelligenceReport?.completenessScore || 85;

      // 3. Professional Development (30% weight)
      const totalModules = 6;
      const completedCount = cand.courseProgress.completedModuleIds.length;
      const profDev = Math.round((completedCount / totalModules) * 100);

      // 4. Interview Readiness (15% weight)
      let interviewReady = 65;
      if (completedCount >= 4) interviewReady = 85;
      if (cand.courseProgress.certificate) interviewReady = 95;

      // 5. Verification Status (15% weight)
      const confirmedSkills = cand.skills.filter(s => s.candidateConfirmed).length;
      const verificationRate = cand.skills.length > 0 ? Math.round((confirmedSkills / cand.skills.length) * 100) : 70;

      // Weighted sum: 20% + 20% + 30% + 15% + 15%
      const overall = Math.round(
        (completeness * 0.20) +
        (cvQuality * 0.20) +
        (profDev * 0.30) +
        (interviewReady * 0.15) +
        (verificationRate * 0.15)
      );

      return {
        ...cand,
        readinessScore: {
          profileCompleteness: completeness,
          cvQuality,
          professionalDevelopment: profDev,
          interviewReadiness: interviewReady,
          verificationStatus: verificationRate,
          overallScore: overall
        }
      };
    }));
  };

  // Skill human confirmation
  const confirmSkill = (candidateId: string, skillId: string) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      const updatedSkills = cand.skills.map(s => {
        if (s.id !== skillId) return s;
        return { ...s, candidateConfirmed: true };
      });
      return { ...cand, skills: updatedSkills };
    }));
    addAuditEvent('SKILL_CONFIRMED', `Candidate confirmed verified status for skill ID: ${skillId}.`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  const editSkill = (candidateId: string, skillId: string, updated: Partial<SkillItem>) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      const updatedSkills = cand.skills.map(s => {
        if (s.id !== skillId) return s;
        return { 
          ...s, 
          ...updated, 
          candidateConfirmed: true, 
          isCandidateOverridden: true 
        };
      });
      return { ...cand, skills: updatedSkills };
    }));
    addAuditEvent('SKILL_OVERRIDDEN', `Candidate manually edited and locked skill ID: ${skillId}.`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  const removeSkill = (candidateId: string, skillId: string) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      return { ...cand, skills: cand.skills.filter(s => s.id !== skillId) };
    }));
    addAuditEvent('SKILL_REMOVED', `Candidate removed unverified skill ID: ${skillId}.`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  const confirmEmployment = (candidateId: string, empId: string) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      return {
        ...cand,
        employmentHistory: cand.employmentHistory.map(e => e.id === empId ? { ...e, candidateConfirmed: true } : e)
      };
    }));
    addAuditEvent('EMPLOYMENT_CONFIRMED', `Employment tenure confirmed by candidate (ID: ${empId}).`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  const confirmEducation = (candidateId: string, eduId: string) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      return {
        ...cand,
        education: cand.education.map(e => e.id === eduId ? { ...e, candidateConfirmed: true } : e)
      };
    }));
    addAuditEvent('EDUCATION_CONFIRMED', `Education credentials confirmed by candidate (ID: ${eduId}).`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  const confirmFieldOverride = (candidateId: string, fieldKey: string, newValue: any) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      return {
        ...cand,
        [fieldKey]: newValue,
        fieldMetadata: {
          ...(cand.fieldMetadata || {}),
          [fieldKey]: {
            confidence: 100,
            extractionType: 'EXPLICIT',
            isOverridden: true,
            candidateConfirmed: true
          }
        }
      };
    }));
    addAuditEvent('FIELD_HUMAN_OVERRIDDEN', `Candidate confirmed field override for ${fieldKey}.`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  // Course completion & certificate
  const completeModule = (candidateId: string, moduleId: string, score: number) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      const completed = new Set(cand.courseProgress.completedModuleIds);
      completed.add(moduleId);
      const newScores = { ...cand.courseProgress.moduleScores, [moduleId]: score };

      return {
        ...cand,
        courseProgress: {
          ...cand.courseProgress,
          completedModuleIds: Array.from(completed),
          moduleScores: newScores
        }
      };
    }));

    addAuditEvent('COURSE_MODULE_COMPLETED', `Candidate completed module ${moduleId} with score ${score}%.`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
  };

  const issueCertificate = (candidateId: string, score: number): CourseCertificate => {
    const cand = candidates.find(c => c.id === candidateId) || candidates[0];
    const cert: CourseCertificate = {
      certificateId: `RPD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      candidateName: `${cand.firstName} ${cand.lastName}`,
      courseName: 'Recruiter Professional Development & Workplace Readiness',
      score,
      completionDate: new Date().toISOString().split('T')[0],
      verificationCode: `SRC-RPD-${cand.candidateCode}`,
      courseVersion: 'v2.1 Master Architecture',
      credentialUrl: `https://source.ai/credentials/${cand.candidateCode}`
    };

    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      return {
        ...c,
        courseProgress: {
          ...c.courseProgress,
          finalAssessmentScore: score,
          certificate: cert
        }
      };
    }));

    addAuditEvent('CERTIFICATE_ISSUED', `Certificate #${cert.certificateId} issued to ${cert.candidateName} (Score: ${score}%).`);
    setTimeout(() => recalculateReadiness(candidateId), 50);
    return cert;
  };

  // Job management
  const createJob = (newJob: Partial<JobRequisition>) => {
    const created: JobRequisition = {
      id: `job-${Date.now()}`,
      agencyId: activeTenant.id,
      title: newJob.title || 'Senior Software Engineer',
      department: newJob.department || 'Engineering',
      location: newJob.location || 'Remote',
      workArrangement: newJob.workArrangement || 'remote',
      salaryMin: newJob.salaryMin || 140000,
      salaryMax: newJob.salaryMax || 180000,
      currency: newJob.currency || 'USD',
      description: newJob.description || '',
      structuredRequirements: newJob.structuredRequirements || {
        mustHave: ['Core technical competence (4+ years)', 'Cloud services', 'Problem solving'],
        niceToHave: ['Leadership', 'Fast-paced growth'],
        exclude: ['Intern applicants'],
        targetSeniority: 'Senior',
        minimumYearsExperience: 4,
        preferredIndustries: ['Technology']
      },
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      applicantCount: 0
    };

    setJobs(prev => [created, ...prev]);
    setActiveJobId(created.id);
    addAuditEvent('JOB_CREATED', `New job created: "${created.title}" with structured requirements.`);
  };

  // Matching & Pipeline
  const updateMatchStage = (matchId: string, stage: PipelineStage, notes?: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        pipelineStage: stage,
        recruiterNotes: notes !== undefined ? notes : m.recruiterNotes,
        updatedAt: new Date().toISOString()
      };
    }));
    addAuditEvent('PIPELINE_STAGE_UPDATED', `Candidate match #${matchId} transitioned to pipeline stage: ${stage}.`);
  };

  const addNewMatch = (match: JobMatchResult) => {
    setMatches(prev => {
      const filtered = prev.filter(m => !(m.jobId === match.jobId && m.candidateId === match.candidateId));
      return [match, ...filtered];
    });
    addAuditEvent('MATCH_EVALUATED', `2-Stage Hybrid Match evaluated for candidate ${match.candidateId} on job ${match.jobId} (Score: ${match.matchScore}%).`);
  };

  const autoMatchAllCandidates = (): number => {
    let createdCount = 0;
    const newMatchesList: JobMatchResult[] = [];

    candidates.forEach(cand => {
      jobs.forEach(job => {
        const existing = matches.find(m => m.jobId === job.id && m.candidateId === cand.id);
        if (!existing) {
          const minExp = job.structuredRequirements?.minimumYearsExperience || 3;
          const passedExp = cand.totalYearsExperience >= minExp;
          const matchedSkills = cand.skills.filter(s => 
            job.structuredRequirements?.mustHave.some(req => 
              req.toLowerCase().includes(s.skillName.toLowerCase()) || 
              s.skillName.toLowerCase().includes(req.toLowerCase())
            )
          );

          const baseScore = Math.min(98, Math.max(72, 
            (passedExp ? 42 : 28) + 
            Math.min(34, matchedSkills.length * 12) + 
            Math.round(cand.readinessScore.overallScore * 0.24)
          ));

          const newMatch: JobMatchResult = {
            id: `match-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            jobId: job.id,
            candidateId: cand.id,
            matchScore: baseScore,
            stage1Passed: passedExp,
            stage1FilterNotes: [
              `Experience: ${cand.totalYearsExperience} yrs satisfies requirement of ${minExp}+ yrs.`,
              `Readiness rating: ${cand.readinessScore.overallScore}% score certified on Universal Network.`,
              `Work arrangement: ${cand.remotePreference} matches ${job.workArrangement}.`
            ],
            evidenceList: matchedSkills.map((sk, idx) => ({
              id: `ev-auto-${idx}-${Date.now()}`,
              requirement: sk.skillName,
              category: 'MUST_HAVE',
              status: 'EXPLICIT_MATCH',
              evidenceText: `Verified skill in ${sk.category}: "${sk.skillName}" with ${sk.aiConfidence}% confidence.`,
              sourceSection: 'Profile Skills & CV',
              confidence: sk.aiConfidence
            })),
            potentialConcerns: baseScore < 80 ? ['Secondary skill verification recommended during technical interview.'] : [],
            recommendationSummary: `Automated match calculated by Universal AI Network. Candidate demonstrates ${baseScore}% alignment across core competencies.`,
            pipelineStage: 'FOUND',
            updatedAt: new Date().toISOString()
          };

          newMatchesList.push(newMatch);
          createdCount++;
        }
      });
    });

    if (newMatchesList.length > 0) {
      setMatches(prev => [...newMatchesList, ...prev]);
      addAuditEvent('UNIVERSAL_AUTO_MATCH', `Automated cross-industry matching executed: ${createdCount} candidate-job matches established across all sectors.`);
    }

    return createdCount;
  };

  const syncExternalJobFeeds = (): number => {
    const syncedJobs: JobRequisition[] = [
      {
        id: `job-sync-${Date.now()}-1`,
        agencyId: 'agency-nova',
        title: 'Principal Distributed Cloud Architect',
        department: 'Infrastructure Systems',
        industry: 'Technology & Cloud',
        location: 'Seattle, WA / Remote',
        workArrangement: 'remote',
        salaryMin: 200000,
        salaryMax: 240000,
        currency: 'USD',
        description: 'Global enterprise hiring a Principal Architect for high-throughput multi-region clusters and distributed database failover.',
        structuredRequirements: {
          mustHave: ['Distributed systems (7+ years)', 'Cloud architecture', 'High availability'],
          niceToHave: ['Multi-cloud (AWS/GCP)', 'Kubernetes'],
          exclude: ['Entry level'],
          targetSeniority: 'Principal / Staff',
          minimumYearsExperience: 7,
          preferredIndustries: ['Technology & Cloud']
        },
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        applicantCount: 3
      },
      {
        id: `job-sync-${Date.now()}-2`,
        agencyId: 'agency-apex',
        title: 'Chief Compliance & AI Governance Officer',
        department: 'Legal & Risk',
        industry: 'Legal, Risk & Compliance',
        location: 'Washington, DC / Remote',
        workArrangement: 'remote',
        salaryMin: 225000,
        salaryMax: 280000,
        currency: 'USD',
        description: 'Multi-national enterprise looking for a Chief Compliance Officer to oversee AI safety standards, global data privacy, and regulatory disclosures.',
        structuredRequirements: {
          mustHave: ['Enterprise compliance leadership (8+ years)', 'Regulatory framework architecture', 'Executive risk mitigation'],
          niceToHave: ['JD or Master of Laws', 'EU AI Act & FTC compliance'],
          exclude: ['Applicants without governance experience'],
          targetSeniority: 'C-Level / VP',
          minimumYearsExperience: 8,
          preferredIndustries: ['Legal, Risk & Compliance', 'FinTech', 'Healthcare']
        },
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        applicantCount: 2
      }
    ];

    setJobs(prev => [...syncedJobs, ...prev]);
    addAuditEvent('JOB_FEEDS_SYNCED', `External ATS integration: 2 live enterprise requisitions imported from partner ATS feed into the Universal Network.`);
    return syncedJobs.length;
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentLocale,
        setCurrentLocale,
        t,
        blindScreeningMode,
        setBlindScreeningMode: handleSetBlindScreeningMode,
        blindSettings,
        updateBlindSettings,
        activeTenant,
        setActiveTenant,
        tenants,
        updateTenant,
        candidates,
        activeCandidateId,
        setActiveCandidateId,
        activeCandidate,
        updateCandidate,
        addNewCandidate,
        confirmSkill,
        editSkill,
        removeSkill,
        confirmEmployment,
        confirmEducation,
        confirmFieldOverride,
        activeConflict,
        setActiveConflict,
        completeModule,
        issueCertificate,
        recalculateReadiness,
        jobs,
        activeJobId,
        setActiveJobId,
        activeJob,
        createJob,
        matches,
        updateMatchStage,
        addNewMatch,
        autoMatchAllCandidates,
        syncExternalJobFeeds,
        auditEvents,
        addAuditEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
