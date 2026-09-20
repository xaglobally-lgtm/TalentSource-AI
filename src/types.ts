export type ExtractionType = 'EXPLICIT' | 'INFERRED' | 'UNKNOWN';
export type SkillSource = 'CV_EXPLICIT' | 'CV_INFERRED' | 'CANDIDATE_ADDED' | 'RECRUITER_VERIFIED';
export type VerificationStatus = 'UNVERIFIED' | 'CANDIDATE_PROVIDED' | 'VERIFIED' | 'EXPIRED';
export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'AGENCY_ADMIN' | 'SUPER_ADMIN';

export type PipelineStage = 
  | 'FOUND' 
  | 'SHORTLISTED' 
  | 'CONTACTED' 
  | 'INTERESTED' 
  | 'SCREENING' 
  | 'INTERVIEW' 
  | 'OFFER' 
  | 'PLACED';

export interface ExtractedField<T> {
  value: T;
  sourceText?: string;
  sourceTextEn?: string;
  confidence: number; // 0-100
  extractionType: ExtractionType;
  isCandidateOverridden?: boolean;
  candidateConfirmed?: boolean;
  originalExtractedValue?: T;
}

export interface EmploymentRecord {
  id: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  currentRole: boolean;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Remote';
  responsibilities: string[];
  achievements: string[];
  skillsUsed: string[];
  industry: string;
  sourceText?: string;
  confidence: number;
  candidateConfirmed: boolean;
  isCandidateOverridden: boolean;
}

export interface EducationRecord {
  id: string;
  institution: string;
  qualification: string;
  degree: string;
  major: string;
  minor?: string;
  startDate: string;
  completionDate: string;
  gpaIfProvided?: string;
  honors?: string;
  relevantCoursework: string[];
  sourceText?: string;
  confidence: number;
  candidateConfirmed: boolean;
}

export interface CertificationRecord {
  id: string;
  certificationName: string;
  provider: string;
  dateObtained: string;
  expiryDate?: string;
  credentialId?: string;
  verificationStatus: VerificationStatus;
  sourceText?: string;
  confidence: number;
}

export interface SkillItem {
  id: string;
  skillName: string;
  category: string;
  levelIfKnown?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  source: SkillSource;
  evidence: string;
  aiConfidence: number;
  candidateConfirmed: boolean;
  isCandidateOverridden: boolean;
}

export interface LanguageItem {
  id: string;
  languageCode: string;
  languageName: string;
  speaking: string;
  writing: string;
  reading: string;
  listening: string;
  overallLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';
}

export interface JobPreferences {
  desiredRoles: string[];
  desiredIndustries: string[];
  minimumSalary: number;
  preferredSalary: number;
  salaryCurrency: string;
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  preferredLocations: string[];
  relocation: boolean;
  employmentTypes: string[];
  availabilityDate: string;
}

export interface CVIntelligenceReport {
  completenessScore: number;
  strongAreas: string[];
  missingAreas: string[];
  potentialImprovements: string[];
  executiveSummary: string;
  analyzedAt: string;
}

export interface ReadinessScoreBreakdown {
  profileCompleteness: number; // 20% weight
  cvQuality: number;           // 20% weight
  professionalDevelopment: number; // 30% weight
  interviewReadiness: number;  // 15% weight
  verificationStatus: number;  // 15% weight
  overallScore: number;        // 0-100 weighted
}

export interface CourseLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  content: string;
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  summary: string;
  lessons: CourseLesson[];
  quiz: QuizQuestion[];
  isCompleted: boolean;
  score?: number;
}

export interface CourseCertificate {
  certificateId: string;
  candidateName: string;
  courseName: string;
  score: number;
  completionDate: string;
  verificationCode: string;
  courseVersion: string;
  credentialUrl: string;
}

export interface CandidateProfile {
  id: string;
  candidateCode: string; // e.g. CND-8492 for blind screening
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  country: string;
  city: string;
  currentLocation: string;
  relocationPreference: boolean;
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  professionalHeadline: string;
  currentPosition: string;
  currentEmployer: string;
  totalYearsExperience: number;
  seniorityLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  industries: string[];
  specialties: string[];
  professionalInterests: string[];
  employmentHistory: EmploymentRecord[];
  education: EducationRecord[];
  certifications: CertificationRecord[];
  skills: SkillItem[];
  languages: LanguageItem[];
  jobPreferences: JobPreferences;
  cvIntelligenceReport?: CVIntelligenceReport;
  readinessScore: ReadinessScoreBreakdown;
  courseProgress: {
    completedModuleIds: string[];
    moduleScores: Record<string, number>;
    finalAssessmentScore?: number;
    certificate?: CourseCertificate;
  };
  hasFastTrackPass?: boolean;
  fastTrackActivatedAt?: string;
  cvRawText?: string;
  cvFileName?: string;
  cvUploadedAt?: string;
  // Field-level metadata for overwrite detection
  fieldMetadata?: Record<string, {
    confidence: number;
    extractionType: ExtractionType;
    sourceText?: string;
    isOverridden: boolean;
    candidateConfirmed: boolean;
    previousExtractedValue?: string;
  }>;
}

export interface StructuredJobRequirements {
  mustHave: string[];
  niceToHave: string[];
  exclude: string[];
  targetSeniority: string;
  minimumYearsExperience: number;
  preferredIndustries: string[];
}

export interface JobRequisition {
  id: string;
  agencyId: string;
  title: string;
  department: string;
  industry?: string;
  location: string;
  workArrangement: 'remote' | 'hybrid' | 'onsite';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  structuredRequirements: StructuredJobRequirements;
  createdAt: string;
  status: 'ACTIVE' | 'DRAFT' | 'FILLED' | 'ARCHIVED';
  applicantCount: number;
}

export interface CitationEvidence {
  id: string;
  requirement: string;
  category: 'MUST_HAVE' | 'NICE_TO_HAVE';
  status: 'EXPLICIT_MATCH' | 'INFERRED_MATCH' | 'MISSING' | 'POTENTIAL_RISK';
  evidenceText: string;
  sourceSection: string;
  confidence: number;
}

export interface JobMatchResult {
  id: string;
  jobId: string;
  candidateId: string;
  matchScore: number; // 0-100%
  stage1Passed: boolean;
  stage1FailedReason?: string;
  stage1FilterNotes: string[];
  evidenceList: CitationEvidence[];
  potentialConcerns: string[];
  recommendationSummary: string;
  pipelineStage: PipelineStage;
  suggestedInterviewQuestions?: string[];
  recruiterNotes?: string;
  updatedAt: string;
}

export interface AgencyTenant {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string; // e.g. '#2563EB'
  accentColor: string;  // e.g. '#0D9488'
  defaultLocale: 'en' | 'es' | 'fr' | 'de';
  contactEmail: string;
  candidatePoolCount: number;
  activeJobsCount: number;
}

export interface AuditEvent {
  id: string;
  tenantId: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface BlindScreeningSettings {
  enabled: boolean;
  maskNames: boolean;
  maskGender: boolean;
  maskAge: boolean;
  maskLocation: boolean;
  maskInstitutions: boolean;
  maskContactInfo: boolean;
}
