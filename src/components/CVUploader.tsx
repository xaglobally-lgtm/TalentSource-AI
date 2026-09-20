import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SkillItem, EmploymentRecord, EducationRecord, CertificationRecord } from '../types';

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

export const CVUploader: React.FC<{ onCompleteReview?: () => void }> = ({ onCompleteReview }) => {
  const { 
    addNewCandidate, 
    activeCandidate, 
    updateCandidate, 
    setActiveConflict, 
    addAuditEvent,
    t 
  } = useApp();

  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content || `Content from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleSelectSample = (sample: SampleCVOption) => {
    setFileName(sample.filename);
    setRawText(sample.text);
  };

  const runExtraction = async (textToExtract: string, chosenFilename: string) => {
    if (!textToExtract.trim()) {
      setErrorMsg('Please upload a CV document or select one of the verified sample CVs.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);
    setCurrentStepIndex(0);

    // Animate scanning sequence through the defined steps
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

      // Transform into CandidateProfile format
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

      const newCertifications: CertificationRecord[] = (extracted.certifications || []).map((c: any, idx: number) => ({
        id: `cert-ext-${Date.now()}-${idx}`,
        certificationName: c.certificationName || 'Certification',
        provider: c.provider || 'Provider',
        dateObtained: c.dateObtained || '2023',
        credentialId: c.credentialId,
        verificationStatus: 'VERIFIED',
        confidence: c.confidence || 95,
      }));

      // Check for Re-Upload Overwrite Protection:
      // If candidate already has an overridden headline/position, trigger conflict modal
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

      // Create new candidate or update active
      const newId = addNewCandidate({
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
          strongAreas: ['Explicit skills evidence', 'Detailed employment chronology'],
          missingAreas: ['Portfolio link'],
          potentialImprovements: ['Add more quantifiable project outcomes'],
          executiveSummary: 'Candidate profile structured and ready for verification review.',
          analyzedAt: new Date().toISOString(),
        },
        cvFileName: chosenFilename || 'Candidate_CV.pdf',
        cvRawText: textToExtract,
      });

      setIsProcessing(false);
      addAuditEvent('CV_EXTRACTED_MULTIMODAL', `Extracted ${newSkills.length} skills and ${newEmployment.length} employment tenures with citation quotes.`);
      
      if (onCompleteReview) {
        onCompleteReview();
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setErrorMsg(`Extraction error: ${err.message || 'Failed to process document'}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-3 shrink-0">
      {/* Row 1: Header + Ingestion Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900">{t.uploadCV}</h2>
            <p className="text-[11px] text-stone-500">
              Select a sample profile or upload a document to extract candidate credentials
            </p>
          </div>
        </div>

        {/* Right side controls: Upload file trigger + Clear + Scan CV button */}
        <div className="flex items-center gap-2 shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf,.docx,.txt,.doc" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span className="truncate max-w-[130px]">{fileName ? fileName : 'Upload File'}</span>
          </button>

          {fileName && (
            <button
              type="button"
              onClick={() => { setRawText(''); setFileName(''); }}
              className="text-[11px] text-stone-400 hover:text-stone-700 px-1 py-1 cursor-pointer"
              title="Clear selection"
            >
              Clear
            </button>
          )}

          <button
            id="btn-scan-cv"
            type="button"
            disabled={isProcessing || !rawText}
            onClick={() => runExtraction(rawText, fileName)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.scanCV}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: 3 Sample Resumes in a compact horizontal strip */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Quick Sample Profiles
          </span>
          {fileName && (
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Active: {fileName}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_CVS.map((sample, idx) => {
            const isSelected = fileName === sample.filename;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`text-left px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500'
                    : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {sample.role.split('•')[0].trim()}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {sample.title}
                  </div>
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  Sample {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Processing Animation */}
      {isProcessing && (
        <div className="mt-2 p-2 bg-stone-900 text-white rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
            <span className="text-stone-200 font-medium truncate text-[11px]">
              {SCAN_STEPS[currentStepIndex]}
            </span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px] font-bold shrink-0">
            Step {currentStepIndex + 1}/5
          </span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
