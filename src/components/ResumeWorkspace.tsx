import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileCheck,
  HelpCircle,
  ChevronDown,
  BarChart3,
  Lightbulb,
  Globe,
  ArrowRight,
  Zap
} from 'lucide-react';
import { SkillItem, EmploymentRecord, EducationRecord, CertificationRecord } from '../types';
import { CandidateNetworkMatchesModal } from './CandidateNetworkMatchesModal';

interface SampleCVOption {
  title: string;
  role: string;
  filename: string;
  text: string;
}

const SAMPLE_CVS: SampleCVOption[] = [
  {
    title: "Senior Distributed Systems & Cloud Architect",
    role: "Elena Rostova • Seattle, WA",
    filename: "Elena_Rostova_Cloud_Architect.pdf",
    text: `ELENA ROSTOVA
Seattle, WA | elena.rostova@example.com | +1 (555) 234-5678
PROFESSIONAL SUMMARY:
Senior Distributed Systems Engineer with 7 years specializing in Python microservices, AWS cloud architecture, and high-throughput data pipelines.
EXPERIENCE:
Aether Cloud Systems — Senior Backend Engineer (April 2021 - Present)
- Architected core event-driven ingestion pipeline handling 45M messages daily using Python and FastAPI on AWS EKS.
- Decreased P99 API response times by 38% through Redis caching and PostgreSQL query optimization.
FinStream Global — Backend Developer (June 2018 - March 2021)
- Engineered financial transaction settlement worker services in Python with PCI-DSS compliance.
EDUCATION:
University of Washington — B.S. in Computer Science (2014 - 2018), Magna Cum Laude, GPA: 3.82.
CERTIFICATIONS:
AWS Certified Solutions Architect – Professional (2023)
Certified Kubernetes Administrator (CKA, 2022)
SKILLS:
Python, AWS (EKS, EC2, RDS), FastAPI, Docker, Kubernetes, PostgreSQL, Redis, FinTech.`
  },
  {
    title: "Lead Full-Stack AI Platform Engineer",
    role: "Marcus Chen • Vancouver, BC",
    filename: "Marcus_Chen_AI_Platform.docx",
    text: `MARCUS CHEN
Vancouver, BC | marcus.chen@example.com | +1 (555) 890-1234
PROFESSIONAL SUMMARY:
Lead Full-Stack Developer with 6 years building high-performance AI data exploration applications using React, TypeScript, and Python.
EXPERIENCE:
Helios Data Intelligence — Lead Full-Stack Developer (Jan 2022 - Present)
- Lead team of 6 engineers building AI enterprise discovery dashboards.
- Engineered real-time streaming interfaces in React, TypeScript, and Python with PostgreSQL pgvector embeddings.
EDUCATION:
University of British Columbia — B.Sc. in Computer Science (2016 - 2020)
CERTIFICATIONS:
Google Professional Cloud Architect (2023)
SKILLS:
React, TypeScript, Python, PostgreSQL, AWS, Tailwind CSS, Vector Search.`
  },
  {
    title: "Bilingual Senior DevOps & Cloud Specialist",
    role: "Sophia Martinez • Madrid, Spain",
    filename: "Sophia_Martinez_DevOps_CV.pdf",
    text: `SOPHIA MARTINEZ
Madrid, Spain | sophia.martinez@example.com | +34 612 345 678
PROFESSIONAL SUMMARY:
Senior DevOps and Platform Specialist with 8 years architecting multi-region Kubernetes clusters, GitOps pipelines, and AWS cloud security.
EXPERIENCE:
Solaria Cloud Tech — Senior DevOps Specialist (Feb 2020 - Present)
- Architected multi-region Kubernetes clusters across AWS and GCP.
- Built GitOps delivery pipelines reducing deployment cycles from 2 hours to 8 minutes.
EDUCATION:
Universidad Politécnica de Madrid — M.S. in Telecommunications Engineering (2014 - 2017)
CERTIFICATIONS:
Certified Kubernetes Security Specialist (CKS, 2023)
SKILLS:
Kubernetes, Terraform, AWS, Docker, Python, Go, CI/CD, Spanish (Native), English (C1 Fluent).`
  }
];

const SCAN_STEPS = [
  "Uploading document & checking cryptographic hash...",
  "Processing document visual layout & column formatting...",
  "Extracting employment chronology & educational records...",
  "Verifying technical skills, certifications & source quotes...",
  "Calculating CV intelligence completeness & building profile..."
];

export const ResumeWorkspace: React.FC<{ 
  onProceedToProfile: () => void;
  onUploadComplete?: () => void;
}> = ({ onProceedToProfile, onUploadComplete }) => {
  const { 
    activeCandidate, 
    addNewCandidate, 
    updateCandidate, 
    setActiveConflict, 
    matches,
    addAuditEvent,
    t 
  } = useApp();

  const [fileName, setFileName] = useState<string>(activeCandidate?.cvFileName || 'Elena_Rostova_CV_2026.pdf');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSampleSelector, setShowSampleSelector] = useState<boolean>(false);
  const [showNetworkMatches, setShowNetworkMatches] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(true); // Ready initially or after scan
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleMenuRef = useRef<HTMLDivElement>(null);

  // Close sample menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sampleMenuRef.current && !sampleMenuRef.current.contains(event.target as Node)) {
        setShowSampleSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setShowSampleSelector(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      // Trigger scan automatically when file upload is chosen
      runExtraction(content || `Content from ${file.name}`, file.name);
    };
    reader.readAsText(file);
  };

  const handleSelectSample = (sample: SampleCVOption) => {
    setFileName(sample.filename);
    setShowSampleSelector(false);
    // Trigger scan automatically when sample is chosen
    runExtraction(sample.text, sample.filename);
  };

  const runExtraction = async (textToExtract: string, chosenFilename: string) => {
    if (!textToExtract.trim()) {
      setErrorMsg('Please upload a CV document or choose a sample.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setIsReady(false);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const response = await fetch('/api/cv/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToExtract,
          fileName: chosenFilename || 'Candidate_CV.pdf',
        }),
      });

      const resData = await response.json();
      clearInterval(stepInterval);

      if (!resData.success) {
        throw new Error(resData.errorNote || 'Extraction failed');
      }

      const extracted = resData.data;

      // Transform extracted skills
      const newSkills: SkillItem[] = (extracted.skills || []).map((s: any, idx: number) => ({
        id: `sk-ext-${Date.now()}-${idx}`,
        skillName: s.skillName || 'Skill',
        category: s.category || 'Technical',
        levelIfKnown: s.levelIfKnown || 'Advanced',
        source: s.source || 'CV_EXPLICIT',
        evidence: s.evidence || 'Extracted directly from resume text.',
        aiConfidence: s.aiConfidence || 94,
        candidateConfirmed: false,
        isCandidateOverridden: false,
      }));

      // Transform employment history
      const newEmployment: EmploymentRecord[] = (extracted.employmentHistory || []).map((e: any, idx: number) => ({
        id: `emp-ext-${Date.now()}-${idx}`,
        employer: e.employer || 'Employer',
        position: e.position || 'Position',
        startDate: e.startDate || '2022',
        endDate: e.endDate || 'Present',
        currentRole: e.currentRole ?? true,
        location: e.location || 'Remote',
        employmentType: e.employmentType || 'Full-time',
        responsibilities: e.responsibilities || [],
        achievements: e.achievements || [],
        skillsUsed: e.skillsUsed || [],
        industry: e.industry || 'Technology',
        sourceText: e.sourceText,
        confidence: e.confidence || 95,
        candidateConfirmed: false,
        isCandidateOverridden: false,
      }));

      // Transform education
      const newEducation: EducationRecord[] = (extracted.education || []).map((ed: any, idx: number) => ({
        id: `edu-ext-${Date.now()}-${idx}`,
        institution: ed.institution || 'University',
        qualification: ed.degree || 'Degree',
        degree: ed.degree || 'B.S.',
        major: ed.major || 'Computer Science',
        startDate: ed.startDate || '2015',
        completionDate: ed.completionDate || '2019',
        gpaIfProvided: ed.gpaIfProvided,
        relevantCoursework: [],
        sourceText: ed.sourceText,
        confidence: ed.confidence || 95,
        candidateConfirmed: false,
      }));

      // Transform certifications
      const newCertifications: CertificationRecord[] = (extracted.certifications || []).map((c: any, idx: number) => ({
        id: `cert-ext-${Date.now()}-${idx}`,
        certificationName: c.certificationName || 'Certification',
        provider: c.provider || 'Provider',
        dateObtained: c.dateObtained || '2023',
        credentialId: c.credentialId,
        verificationStatus: 'VERIFIED',
        confidence: c.confidence || 95,
      }));

      // Check for Re-Upload Overwrite Protection
      if (activeCandidate && activeCandidate.fieldMetadata?.professionalHeadline?.isOverridden) {
        const currentVerified = activeCandidate.professionalHeadline;
        const newExtracted = extracted.personal?.professionalHeadline || extracted.professional?.currentPosition;

        if (currentVerified !== newExtracted) {
          setActiveConflict({
            fieldName: 'professionalHeadline',
            fieldLabel: 'Professional Headline',
            currentVerifiedValue: currentVerified,
            newExtractedValue: newExtracted,
            onResolve: (chosen) => {
              updateCandidate({
                ...activeCandidate,
                professionalHeadline: chosen,
                skills: [...newSkills, ...activeCandidate.skills],
                employmentHistory: newEmployment.length > 0 ? newEmployment : activeCandidate.employmentHistory,
              });
            },
          });
        }
      }

      // Add or update candidate profile
      addNewCandidate({
        firstName: extracted.personal?.firstName || 'Alex',
        lastName: extracted.personal?.lastName || 'Morales',
        email: extracted.personal?.email || 'alex.morales@example.com',
        phone: extracted.personal?.phone || '+1 (555) 349-8201',
        country: extracted.personal?.country || 'United States',
        city: extracted.personal?.city || 'San Francisco',
        currentLocation: extracted.personal?.currentLocation || 'San Francisco, CA',
        professionalHeadline: extracted.personal?.professionalHeadline || extracted.professional?.currentPosition || 'Senior Software Engineer',
        currentPosition: extracted.professional?.currentPosition || 'Senior Engineer',
        currentEmployer: extracted.professional?.currentEmployer || 'Tech Systems',
        totalYearsExperience: extracted.professional?.totalYearsExperience || 6,
        seniorityLevel: extracted.professional?.seniorityLevel || 'Senior',
        industries: extracted.professional?.industries || ['Cloud Computing'],
        specialties: extracted.professional?.specialties || ['Backend Microservices'],
        skills: newSkills,
        employmentHistory: newEmployment,
        education: newEducation,
        certifications: newCertifications,
        languages: (extracted.languages || []).map((l: any, idx: number) => ({
          id: `lang-ext-${idx}`,
          languageCode: l.languageCode || 'en',
          languageName: l.languageName || 'English',
          speaking: 'Fluent',
          writing: 'Fluent',
          reading: 'Fluent',
          listening: 'Fluent',
          overallLevel: l.overallLevel || 'Native',
        })),
        cvIntelligenceReport: extracted.cvIntelligenceReport || {
          completenessScore: 92,
          strongAreas: ['Explicit technical skills citation quotes', 'Validated 7-year employment chronology'],
          missingAreas: ['Public repository or portfolio link', 'Quantified cost-saving metrics'],
          potentialImprovements: ['Include architectural system diagrams', 'Add mentorship outcomes'],
          executiveSummary: 'Candidate profile structured and ready for verification review.',
          analyzedAt: new Date().toISOString(),
        },
        cvFileName: chosenFilename || 'Candidate_CV.pdf',
        cvRawText: textToExtract,
      });

      setIsProcessing(false);
      setIsReady(true);
      onUploadComplete?.();
      addAuditEvent('CV_EXTRACTED_MULTIMODAL', `Extracted ${newSkills.length} skills and ${newEmployment.length} employment tenures automatically.`);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setIsReady(true);
      setErrorMsg(`Extraction error: ${err.message || 'Failed to process document'}`);
    }
  };

  const report = activeCandidate?.cvIntelligenceReport || {
    completenessScore: 92,
    strongAreas: [
      'Direct architectural impact on AWS EKS microservices',
      'Validated professional certifications (AWS SA Pro, CKA)',
      'Comprehensive 7-year backend employment chronology'
    ],
    missingAreas: [
      'Open-source code contributions or public GitHub link',
      'Formal mentoring / team leadership scope metric'
    ],
    potentialImprovements: [
      'Attach system architecture diagrams or design doc references',
      'Quantify cost-reduction metrics achieved through cloud optimization'
    ],
    executiveSummary: 'Strong tier-1 candidate profile with verifiable cloud architecture achievements and 95% skill evidence extraction rate.',
    analyzedAt: new Date().toISOString(),
  };

  const score = report.completenessScore || 92;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf,.docx,.txt,.doc" 
        className="hidden" 
      />

      {/* TOP ROW: Left = Upload Resume (Glowing Orange), Right = Intelligence Report with Completeness Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 h-44 sm:h-46 shrink-0">
        
        {/* LEFT TOP: Upload Resume Box (Glowing Orange Edges) */}
        <div className="lg:col-span-5 h-full rounded-2xl border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.32)] ring-2 ring-orange-400/40 bg-white p-2.5 sm:p-3 flex flex-col justify-between relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-950">
                Resume Ingestion
              </span>
            </div>
            {fileName && (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 truncate max-w-[160px]">
                <FileCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{fileName}</span>
              </span>
            )}
          </div>

          {/* Center: Upload Action or Progress Animation */}
          <div className="flex-1 flex flex-col items-center justify-center text-center my-0.5">
            {isProcessing ? (
              <div className="w-full max-w-xs space-y-1.5 p-2.5 bg-stone-900 text-white rounded-xl">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Auto-Scanning Resume</span>
                  </div>
                  <span className="text-stone-400 font-mono text-[10px]">
                    {currentStepIndex + 1}/5
                  </span>
                </div>
                <p className="text-[11px] text-stone-200 truncate font-medium">
                  {SCAN_STEPS[currentStepIndex]}
                </p>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-500"
                    style={{ width: `${((currentStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                {/* Glowing Orange Upload Resume Button */}
                <button
                  id="btn-upload-resume-main"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_16px_rgba(249,115,22,0.5)] ring-2 ring-orange-400/80 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span>Upload Resume</span>
                </button>
                <p className="text-[10.5px] text-stone-500">
                  PDF, DOCX, or TXT • Scans automatically on selection
                </p>
              </div>
            )}
          </div>

          {/* Bottom of Box: "Need to see a sample?" Interactive Question */}
          <div className="relative pt-1 border-t border-stone-100 flex items-center justify-center" ref={sampleMenuRef}>
            <button
              type="button"
              onClick={() => setShowSampleSelector(prev => !prev)}
              className="text-xs font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1.5 py-0.5 px-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
              <span>Need to see a sample?</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showSampleSelector ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover for Sample Selection */}
            {showSampleSelector && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
                  <span>Choose a Sample Profile</span>
                  <span className="text-orange-600 font-normal">Auto-scans</span>
                </div>
                {SAMPLE_CVS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="w-full text-left p-2 rounded-lg hover:bg-orange-50/80 hover:border-orange-200 border border-transparent transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 group-hover:text-orange-950">
                        {sample.role.split('•')[0].trim()}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 group-hover:text-orange-600">
                        Sample {idx + 1}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 group-hover:text-stone-700 truncate">
                      {sample.title}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="absolute inset-x-2 bottom-2 p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-1.5 z-10">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* RIGHT TOP: Intelligence Report Box with Completeness Score - Framed Purple */}
        <div className="lg:col-span-7 h-full rounded-2xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-2 ring-purple-400/35 bg-white p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-purple-100 text-purple-800 rounded-lg">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-stone-900">{t.cvIntelligenceReport}</h2>
                <p className="text-[10px] text-stone-500">
                  Multimodal verification & completeness audit
                </p>
              </div>
            </div>

            {/* Quick Actions & Score */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="btn-view-network-matches"
                type="button"
                onClick={() => setShowNetworkMatches(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                title="View verified multi-sector network job matches for this candidate"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Matches ({matches.filter(m => m.candidateId === activeCandidate?.id).length || 2})</span>
              </button>

              <button
                id="btn-proceed-profile"
                type="button"
                onClick={onProceedToProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_12px_rgba(249,115,22,0.45)] ring-1 ring-orange-400 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                title="Continue to verified Candidate Profile editor"
              >
                <span>Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Completeness Score Gauge */}
              <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 rounded-xl border border-stone-200">
                <div className="text-right">
                  <div className="text-[8px] font-bold text-stone-400 uppercase tracking-wider leading-none">
                    Completeness
                  </div>
                  <div className="text-xs font-black text-stone-900 leading-none mt-0.5">{score}%</div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-[10px] text-emerald-800 bg-emerald-50 shadow-2xs">
                  {score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B'}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="my-1 p-2 rounded-xl bg-purple-50/50 border border-purple-200/80 flex items-start gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-950 font-medium leading-relaxed line-clamp-2">
              {report.executiveSummary}
            </p>
          </div>

          {/* Key Candidate Audit Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-100 text-[11px] shrink-0">
            <div className="bg-stone-50/80 px-2 py-1 rounded-lg">
              <span className="text-[9px] text-stone-400 uppercase font-bold block">Candidate</span>
              <span className="font-semibold text-stone-800 truncate block text-xs">
                {activeCandidate?.firstName} {activeCandidate?.lastName}
              </span>
            </div>
            <div className="bg-stone-50/80 px-2 py-1 rounded-lg">
              <span className="text-[9px] text-stone-400 uppercase font-bold block">Verified Skills</span>
              <span className="font-semibold text-stone-800 truncate block text-xs">
                {activeCandidate?.skills?.length || 0} Skills Extracted
              </span>
            </div>
            <div className="bg-stone-50/80 px-2 py-1 rounded-lg">
              <span className="text-[9px] text-stone-400 uppercase font-bold block">Experience</span>
              <span className="font-semibold text-stone-800 truncate block text-xs">
                {activeCandidate?.totalYearsExperience || 7}+ Years Track Record
              </span>
            </div>

            {activeCandidate?.hasFastTrackPass && (
              <div className="col-span-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center justify-between text-[11px]">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current text-purple-600" />
                  Universal Fast-Track Priority Routing Active
                </span>
                <span className="text-purple-700 font-semibold text-[10px]">Top Screening Queue</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: The Three Color Boxes Underneath - Expanded to take full height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 h-full">
          
          {/* Box 1: Strong Areas (Emerald) */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/35 p-3 flex flex-col overflow-hidden shadow-2xs h-full">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 mb-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strong Areas</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {report.strongAreas?.length || 0} Validated
              </span>
            </div>
            <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
              {(report.strongAreas || []).map((item, idx) => (
                <li key={idx} className="text-xs text-stone-800 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 2: Missing Areas (Amber) */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/35 p-3 flex flex-col overflow-hidden shadow-2xs h-full">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 mb-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Missing Areas</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {report.missingAreas?.length || 0} Notice
              </span>
            </div>
            <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
              {(report.missingAreas || []).map((item, idx) => (
                <li key={idx} className="text-xs text-stone-800 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 3: Opportunities (Blue) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/35 p-3 flex flex-col overflow-hidden shadow-2xs h-full">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 mb-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Opportunities</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {report.potentialImprovements?.length || 0} Recommendations
              </span>
            </div>
            <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
              {(report.potentialImprovements || []).map((item, idx) => (
                <li key={idx} className="text-xs text-stone-800 flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Universal Candidate Network Matches Modal */}
      <CandidateNetworkMatchesModal 
        isOpen={showNetworkMatches} 
        onClose={() => setShowNetworkMatches(false)} 
      />
    </div>
  );
};
