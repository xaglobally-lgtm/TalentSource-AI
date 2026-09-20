import { 
  AgencyTenant, 
  CandidateProfile, 
  JobRequisition, 
  JobMatchResult, 
  AuditEvent 
} from '../types';

export const SAMPLE_AGENCIES: AgencyTenant[] = [
  {
    id: 'agency-apex',
    name: 'Apex Executive Search',
    slug: 'apex-search',
    tagline: 'High-Impact Engineering & Leadership Talent',
    primaryColor: '#0F766E', // Teal
    accentColor: '#0D9488',
    defaultLocale: 'en',
    contactEmail: 'talent@apexsearch.com',
    candidatePoolCount: 1420,
    activeJobsCount: 18,
  },
  {
    id: 'agency-nova',
    name: 'Nova Global Sourcing',
    slug: 'nova-global',
    tagline: 'Cross-Border Multilingual Technology Recruitment',
    primaryColor: '#2563EB', // Blue
    accentColor: '#4F46E5',
    defaultLocale: 'es',
    contactEmail: 'partners@novaglobal.io',
    candidatePoolCount: 980,
    activeJobsCount: 12,
  },
  {
    id: 'agency-vanguard',
    name: 'Vanguard Elite Recruiters',
    slug: 'vanguard-elite',
    tagline: 'Specialized Enterprise Software & DevOps Specialists',
    primaryColor: '#7C3AED', // Purple
    accentColor: '#9333EA',
    defaultLocale: 'fr',
    contactEmail: 'inquiries@vanguardtalent.fr',
    candidatePoolCount: 650,
    activeJobsCount: 9,
  }
];

export const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-1',
    candidateCode: 'CND-8492',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 234-5678',
    firstName: 'Elena',
    lastName: 'Rostova',
    preferredName: 'Elena',
    country: 'United States',
    city: 'Seattle',
    currentLocation: 'Seattle, WA, USA',
    relocationPreference: true,
    remotePreference: 'remote',
    professionalHeadline: 'Senior Distributed Systems & Cloud Backend Engineer',
    currentPosition: 'Senior Backend Engineer',
    currentEmployer: 'Aether Cloud Systems',
    totalYearsExperience: 7,
    seniorityLevel: 'Senior',
    industries: ['Cloud Infrastructure', 'FinTech', 'High-Throughput SaaS'],
    specialties: ['Distributed Architectures', 'Python Microservices', 'Kubernetes Orchestration'],
    professionalInterests: ['Serverless Architectures', 'Event-Driven Systems', 'Reliability Engineering'],
    employmentHistory: [
      {
        id: 'emp-1',
        employer: 'Aether Cloud Systems',
        position: 'Senior Backend Engineer',
        startDate: '2021-04',
        endDate: 'Present',
        currentRole: true,
        location: 'Seattle, WA (Remote)',
        employmentType: 'Full-time',
        responsibilities: [
          'Architected core event-driven ingestion pipeline handling 45M messages daily.',
          'Spearheaded transition from legacy monolith to Python/FastAPI microservices on AWS EKS.',
          'Mentored 4 mid-level engineers and established team coding & CI/CD standards.'
        ],
        achievements: [
          'Decreased P99 API response times by 38% through Redis caching and PostgreSQL query optimization.',
          'Cut monthly AWS compute bills by $22,000 by rightsizing container clusters.'
        ],
        skillsUsed: ['Python', 'AWS', 'FastAPI', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'],
        industry: 'Cloud Infrastructure',
        sourceText: 'Senior Backend Engineer at Aether Cloud Systems (April 2021 - Present). Architected high-throughput ingestion pipeline with FastAPI, AWS, and Kubernetes.',
        confidence: 98,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'emp-2',
        employer: 'FinStream Global',
        position: 'Backend Software Developer',
        startDate: '2018-06',
        endDate: '2021-03',
        currentRole: false,
        location: 'Austin, TX',
        employmentType: 'Full-time',
        responsibilities: [
          'Engineered financial transaction settlement worker services in Python.',
          'Maintained compliance with PCI-DSS data protection requirements.',
          'Implemented automated integration test suites with 92% coverage.'
        ],
        achievements: [
          'Processed over $400M in ledger transactions with 99.999% uptime.'
        ],
        skillsUsed: ['Python', 'Django', 'PostgreSQL', 'RabbitMQ', 'AWS EC2'],
        industry: 'FinTech',
        sourceText: 'FinStream Global (June 2018 - March 2021): Backend Developer building ledger services and payment workflows.',
        confidence: 95,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of Washington',
        qualification: 'B.S. in Computer Science',
        degree: 'Bachelor of Science',
        major: 'Computer Science',
        minor: 'Applied Mathematics',
        startDate: '2014-09',
        completionDate: '2018-05',
        gpaIfProvided: '3.82',
        honors: 'Magna Cum Laude',
        relevantCoursework: ['Distributed Systems', 'Algorithms & Data Structures', 'Database Internals'],
        sourceText: 'University of Washington, B.S. in Computer Science (2014-2018), Magna Cum Laude, GPA: 3.82.',
        confidence: 99,
        candidateConfirmed: true,
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        certificationName: 'AWS Certified Solutions Architect – Professional',
        provider: 'Amazon Web Services',
        dateObtained: '2023-02',
        expiryDate: '2026-02',
        credentialId: 'AWS-PSA-99120',
        verificationStatus: 'VERIFIED',
        sourceText: 'AWS Certified Solutions Architect – Professional (Issued Feb 2023, Credential ID: AWS-PSA-99120)',
        confidence: 96,
      },
      {
        id: 'cert-2',
        certificationName: 'Certified Kubernetes Administrator (CKA)',
        provider: 'Cloud Native Computing Foundation (CNCF)',
        dateObtained: '2022-08',
        expiryDate: '2025-08',
        credentialId: 'CKA-88319',
        verificationStatus: 'VERIFIED',
        sourceText: 'CNCF Certified Kubernetes Administrator (CKA-88319)',
        confidence: 94,
      }
    ],
    skills: [
      {
        id: 'sk-1',
        skillName: 'Python',
        category: 'Programming Languages',
        levelIfKnown: 'Expert',
        source: 'CV_EXPLICIT',
        evidence: '7+ years building enterprise microservices and event pipelines with Python across Aether and FinStream.',
        aiConfidence: 99,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-2',
        skillName: 'AWS Infrastructure',
        category: 'Cloud & DevOps',
        levelIfKnown: 'Expert',
        source: 'CV_EXPLICIT',
        evidence: 'Certified Solutions Architect Professional; 5+ years managing AWS EKS, EC2, RDS, and S3.',
        aiConfidence: 98,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-3',
        skillName: 'Kubernetes',
        category: 'Cloud & DevOps',
        levelIfKnown: 'Advanced',
        source: 'CV_EXPLICIT',
        evidence: 'Certified Kubernetes Administrator (CKA); production deployment on AWS EKS.',
        aiConfidence: 96,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-4',
        skillName: 'FinTech Regulations',
        category: 'Domain Expertise',
        levelIfKnown: 'Intermediate',
        source: 'CV_INFERRED',
        evidence: 'Built PCI-DSS compliant payment reconciliation engines at FinStream Global for 3 years.',
        aiConfidence: 86,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-5',
        skillName: 'FastAPI / Asynchronous Architecture',
        category: 'Frameworks',
        levelIfKnown: 'Advanced',
        source: 'CV_EXPLICIT',
        evidence: 'Architected async ingestion pipeline processing 45M messages/day.',
        aiConfidence: 95,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-6',
        skillName: 'Terraform',
        category: 'Infrastructure as Code',
        levelIfKnown: 'Intermediate',
        source: 'CV_INFERRED',
        evidence: 'Inferred from infrastructure right-sizing and cloud provisioning workflows.',
        aiConfidence: 78,
        candidateConfirmed: false,
        isCandidateOverridden: false,
      }
    ],
    languages: [
      {
        id: 'lang-1',
        languageCode: 'en',
        languageName: 'English',
        speaking: 'Fluent',
        writing: 'Fluent',
        reading: 'Fluent',
        listening: 'Fluent',
        overallLevel: 'Native',
      },
      {
        id: 'lang-2',
        languageCode: 'es',
        languageName: 'Spanish',
        speaking: 'Conversational',
        writing: 'Intermediate',
        reading: 'Advanced',
        listening: 'Conversational',
        overallLevel: 'B2',
      }
    ],
    jobPreferences: {
      desiredRoles: ['Staff Backend Engineer', 'Senior Cloud Systems Architect', 'Principal Engineer'],
      desiredIndustries: ['FinTech', 'Cloud Systems', 'AI Infrastructure'],
      minimumSalary: 185000,
      preferredSalary: 215000,
      salaryCurrency: 'USD',
      workArrangement: 'remote',
      preferredLocations: ['Seattle, WA', 'San Francisco, CA', 'Remote US'],
      relocation: false,
      employmentTypes: ['Full-time'],
      availabilityDate: '30 Days Notice',
    },
    cvIntelligenceReport: {
      completenessScore: 94,
      strongAreas: [
        'Exceptional verifiable metrics for distributed system scaling and cost reductions.',
        'High-value industry certifications (AWS Solutions Architect Pro, CNCF CKA).',
        'Transparent chronological timeline with no unverified gaps.'
      ],
      missingAreas: [
        'No direct open-source repository or portfolio link included.',
        'Specific patent or publication section omitted.'
      ],
      potentialImprovements: [
        'Add Terraform IaC explicit certification or project references to confirm inferred skills.',
        'Include team leadership velocity outcomes in the senior tenure description.'
      ],
      executiveSummary: 'Elena presents an exceptional, highly verified profile tailored for Senior/Staff distributed systems requisitions. Strong explicit evidence for Python, AWS, and Kubernetes.',
      analyzedAt: '2026-09-02T14:30:00Z',
    },
    readinessScore: {
      profileCompleteness: 94,
      cvQuality: 92,
      professionalDevelopment: 100,
      interviewReadiness: 90,
      verificationStatus: 95,
      overallScore: 94,
    },
    courseProgress: {
      completedModuleIds: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5', 'mod-6'],
      moduleScores: {
        'mod-1': 100,
        'mod-2': 100,
        'mod-3': 100,
        'mod-4': 100,
        'mod-5': 100,
        'mod-6': 95,
      },
      finalAssessmentScore: 95,
      certificate: {
        certificateId: 'RPD-2026-849201',
        candidateName: 'Elena Rostova',
        courseName: 'Recruiter Professional Development & Workplace Readiness',
        score: 95,
        completionDate: '2026-09-05',
        verificationCode: 'SRC-RPD-ELN92',
        courseVersion: 'v2.1',
        credentialUrl: 'https://source.ai/verify/RPD-2026-849201'
      }
    },
    cvFileName: 'Elena_Rostova_CV_2026.pdf',
    cvUploadedAt: '2026-09-02T14:28:00Z',
    cvRawText: `ELENA ROSTOVA
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
University of Washington — B.S. in Computer Science (2014 - 2018), Magna Cum Laude.
CERTIFICATIONS:
AWS Certified Solutions Architect – Professional (2023)
Certified Kubernetes Administrator (CKA, 2022)`
  },
  {
    id: 'cand-2',
    candidateCode: 'CND-4127',
    email: 'marcus.chen@example.com',
    phone: '+1 (555) 890-1234',
    firstName: 'Marcus',
    lastName: 'Chen',
    preferredName: 'Marcus',
    country: 'Canada',
    city: 'Vancouver',
    currentLocation: 'Vancouver, BC, Canada',
    relocationPreference: true,
    remotePreference: 'remote',
    professionalHeadline: 'Lead Full-Stack AI Engineer & Distributed Systems Developer',
    currentPosition: 'Lead Full-Stack Developer',
    currentEmployer: 'Helios Data Intelligence',
    totalYearsExperience: 6,
    seniorityLevel: 'Lead',
    industries: ['Artificial Intelligence', 'Data Engineering', 'Enterprise SaaS'],
    specialties: ['React & Next.js', 'Python Machine Learning APIs', 'PostgreSQL Vector Search'],
    professionalInterests: ['Agentic Workflows', 'LLM Retrieval Systems', 'Observability'],
    employmentHistory: [
      {
        id: 'emp-201',
        employer: 'Helios Data Intelligence',
        position: 'Lead Full-Stack Developer',
        startDate: '2022-01',
        endDate: 'Present',
        currentRole: true,
        location: 'Vancouver, BC (Hybrid)',
        employmentType: 'Full-time',
        responsibilities: [
          'Lead team of 6 engineers building AI enterprise discovery dashboards.',
          'Engineered real-time streaming interfaces in React and TypeScript.',
          'Built Python backend services integrating vector search embeddings on PostgreSQL pgvector.'
        ],
        achievements: [
          'Increased enterprise client retention by 28% after releasing vector intelligence interface.'
        ],
        skillsUsed: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'AWS', 'Tailwind CSS'],
        industry: 'Artificial Intelligence',
        sourceText: 'Lead Full-Stack Developer at Helios Data Intelligence (2022-Present). Leading 6 engineers with React, TypeScript, Python, and PostgreSQL.',
        confidence: 96,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      }
    ],
    education: [
      {
        id: 'edu-201',
        institution: 'University of British Columbia',
        qualification: 'B.Sc. in Computer Science',
        degree: 'Bachelor of Science',
        major: 'Computer Science',
        startDate: '2016-09',
        completionDate: '2020-05',
        relevantCoursework: ['Software Engineering', 'Human Computer Interaction'],
        confidence: 95,
        candidateConfirmed: true,
      }
    ],
    certifications: [
      {
        id: 'cert-201',
        certificationName: 'Google Professional Cloud Architect',
        provider: 'Google Cloud',
        dateObtained: '2023-05',
        verificationStatus: 'VERIFIED',
        confidence: 92,
      }
    ],
    skills: [
      {
        id: 'sk-201',
        skillName: 'Python',
        category: 'Programming Languages',
        levelIfKnown: 'Expert',
        source: 'CV_EXPLICIT',
        evidence: '6 years developing production Python APIs and vector processing services.',
        aiConfidence: 97,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-202',
        skillName: 'React & TypeScript',
        category: 'Frontend',
        levelIfKnown: 'Expert',
        source: 'CV_EXPLICIT',
        evidence: 'Spearheaded enterprise dashboard UI with React and TypeScript at Helios.',
        aiConfidence: 98,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-203',
        skillName: 'AWS Infrastructure',
        category: 'Cloud & DevOps',
        levelIfKnown: 'Intermediate',
        source: 'CV_EXPLICIT',
        evidence: 'Deployed microservices across AWS ECS and Lambda.',
        aiConfidence: 88,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      }
    ],
    languages: [
      {
        id: 'lang-201',
        languageCode: 'en',
        languageName: 'English',
        speaking: 'Fluent',
        writing: 'Fluent',
        reading: 'Fluent',
        listening: 'Fluent',
        overallLevel: 'Native',
      },
      {
        id: 'lang-202',
        languageCode: 'zh',
        languageName: 'Mandarin Chinese',
        speaking: 'Fluent',
        writing: 'Professional',
        reading: 'Professional',
        listening: 'Fluent',
        overallLevel: 'C2',
      }
    ],
    jobPreferences: {
      desiredRoles: ['Lead Full-Stack Engineer', 'Engineering Manager', 'Senior Staff AI Developer'],
      desiredIndustries: ['AI Software', 'FinTech', 'Developer Tools'],
      minimumSalary: 170000,
      preferredSalary: 195000,
      salaryCurrency: 'USD',
      workArrangement: 'remote',
      preferredLocations: ['Vancouver, BC', 'San Francisco, CA', 'Remote US/Canada'],
      relocation: true,
      employmentTypes: ['Full-time'],
      availabilityDate: 'Immediate',
    },
    cvIntelligenceReport: {
      completenessScore: 88,
      strongAreas: [
        'Balanced mastery of both modern frontend (React/TypeScript) and backend/AI pipelines.',
        'Proven technical leadership experience managing a squad of 6 engineers.'
      ],
      missingAreas: [
        'Could include more quantitative financial impact metrics for earlier roles.'
      ],
      potentialImprovements: [
        'Complete recruiter development modules to maximize client readiness ranking.'
      ],
      executiveSummary: 'Strong candidate with full-stack capabilities, modern AI engineering, and proven leadership experience.',
      analyzedAt: '2026-09-03T11:20:00Z'
    },
    readinessScore: {
      profileCompleteness: 88,
      cvQuality: 85,
      professionalDevelopment: 50,
      interviewReadiness: 75,
      verificationStatus: 82,
      overallScore: 76,
    },
    courseProgress: {
      completedModuleIds: ['mod-1', 'mod-2', 'mod-3'],
      moduleScores: { 'mod-1': 90, 'mod-2': 95, 'mod-3': 88 },
    },
    cvFileName: 'Marcus_Chen_CV.pdf',
    cvUploadedAt: '2026-09-03T11:15:00Z',
  },
  {
    id: 'cand-3',
    candidateCode: 'CND-5381',
    email: 'sophia.martinez@example.com',
    phone: '+34 612 345 678',
    firstName: 'Sophia',
    lastName: 'Martinez',
    preferredName: 'Sophia',
    country: 'Spain',
    city: 'Madrid',
    currentLocation: 'Madrid, Spain',
    relocationPreference: true,
    remotePreference: 'remote',
    professionalHeadline: 'Senior DevOps & Cloud Infrastructure Engineer',
    currentPosition: 'Senior DevOps Specialist',
    currentEmployer: 'Solaria Cloud Tech',
    totalYearsExperience: 8,
    seniorityLevel: 'Senior',
    industries: ['Telecommunications', 'SaaS Infrastructure', 'Logistics'],
    specialties: ['Kubernetes Cluster Management', 'Terraform & Ansible', 'CI/CD Pipelines'],
    professionalInterests: ['Platform Engineering', 'FinOps', 'Zero-Trust Security'],
    employmentHistory: [
      {
        id: 'emp-301',
        employer: 'Solaria Cloud Tech',
        position: 'Senior DevOps Specialist',
        startDate: '2020-02',
        endDate: 'Present',
        currentRole: true,
        location: 'Madrid, Spain (Remote)',
        employmentType: 'Full-time',
        responsibilities: [
          'Architected multi-region Kubernetes clusters across AWS and GCP.',
          'Built GitOps delivery pipelines reducing deployment cycles from 2 hours to 8 minutes.',
          'Managed automated zero-trust mesh networking with Istio.'
        ],
        achievements: [
          'Maintained 99.99% multi-region uptime across 12 high-traffic services.'
        ],
        skillsUsed: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'Python', 'Go'],
        industry: 'SaaS Infrastructure',
        sourceText: 'Senior DevOps Specialist at Solaria Cloud Tech (2020-Present). Multi-region Kubernetes, Terraform, AWS, and GitOps.',
        confidence: 97,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      }
    ],
    education: [
      {
        id: 'edu-301',
        institution: 'Universidad Politécnica de Madrid',
        qualification: 'M.S. in Telecommunications Engineering',
        degree: 'Master of Science',
        major: 'Telecommunications Engineering',
        startDate: '2014-09',
        completionDate: '2017-06',
        relevantCoursework: ['Distributed Networks', 'Security Protocols'],
        confidence: 96,
        candidateConfirmed: true,
      }
    ],
    certifications: [
      {
        id: 'cert-301',
        certificationName: 'Certified Kubernetes Security Specialist (CKS)',
        provider: 'CNCF',
        dateObtained: '2023-10',
        verificationStatus: 'VERIFIED',
        confidence: 96,
      }
    ],
    skills: [
      {
        id: 'sk-301',
        skillName: 'Kubernetes',
        category: 'DevOps',
        levelIfKnown: 'Expert',
        source: 'CV_EXPLICIT',
        evidence: '8 years hands-on production Kubernetes orchestration; holds CKS credential.',
        aiConfidence: 99,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-302',
        skillName: 'AWS Infrastructure',
        category: 'Cloud',
        levelIfKnown: 'Expert',
        source: 'CV_EXPLICIT',
        evidence: 'Multi-region VPC, EKS, IAM zero-trust configurations at scale.',
        aiConfidence: 96,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      },
      {
        id: 'sk-303',
        skillName: 'Python',
        category: 'Programming Languages',
        levelIfKnown: 'Advanced',
        source: 'CV_EXPLICIT',
        evidence: 'Writes custom automation CLI tools and cluster controllers in Python and Go.',
        aiConfidence: 90,
        candidateConfirmed: true,
        isCandidateOverridden: false,
      }
    ],
    languages: [
      {
        id: 'lang-301',
        languageCode: 'es',
        languageName: 'Spanish',
        speaking: 'Native',
        writing: 'Native',
        reading: 'Native',
        listening: 'Native',
        overallLevel: 'Native',
      },
      {
        id: 'lang-302',
        languageCode: 'en',
        languageName: 'English',
        speaking: 'Fluent (C1)',
        writing: 'Fluent (C1)',
        reading: 'Fluent (C1)',
        listening: 'Fluent (C1)',
        overallLevel: 'C1',
      }
    ],
    jobPreferences: {
      desiredRoles: ['Lead DevOps Engineer', 'Principal Platform Engineer', 'Head of Infrastructure'],
      desiredIndustries: ['Enterprise Software', 'FinTech', 'Cloud Infrastructure'],
      minimumSalary: 120000,
      preferredSalary: 145000,
      salaryCurrency: 'EUR',
      workArrangement: 'remote',
      preferredLocations: ['Madrid, Spain', 'Remote Europe', 'Remote Global'],
      relocation: false,
      employmentTypes: ['Full-time'],
      availabilityDate: '60 Days Notice',
    },
    cvIntelligenceReport: {
      completenessScore: 92,
      strongAreas: [
        'Extensive European enterprise cloud and Kubernetes infrastructure background.',
        'Fluent bilingual (Spanish / English C1+).'
      ],
      missingAreas: [
        'Salary preference in USD not explicitly specified.'
      ],
      potentialImprovements: [
        'Undergo final assessment to receive Verified Recruiter Certificate.'
      ],
      executiveSummary: 'Elite European infrastructure specialist with verified Kubernetes security and multi-region AWS cloud expertise.',
      analyzedAt: '2026-09-04T09:00:00Z',
    },
    readinessScore: {
      profileCompleteness: 92,
      cvQuality: 90,
      professionalDevelopment: 80,
      interviewReadiness: 85,
      verificationStatus: 92,
      overallScore: 88,
    },
    courseProgress: {
      completedModuleIds: ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5'],
      moduleScores: { 'mod-1': 100, 'mod-2': 90, 'mod-3': 95, 'mod-4': 90, 'mod-5': 90 },
    },
    cvFileName: 'Sophia_Martinez_DevOps_CV.pdf',
    cvUploadedAt: '2026-09-04T08:50:00Z',
  }
];

export const INITIAL_JOBS: JobRequisition[] = [
  {
    id: 'job-1',
    agencyId: 'agency-apex',
    title: 'Lead Python & Cloud Infrastructure Architect',
    department: 'Core Platform Engineering',
    location: 'Seattle, WA / Remote',
    workArrangement: 'remote',
    salaryMin: 180000,
    salaryMax: 220000,
    currency: 'USD',
    description: `We are searching for a Lead Python & Cloud Infrastructure Architect to power our next-generation data ingestion and distributed microservices platform. 
    You will lead architectural decisions, design high-scale Python microservices, and oversee cloud infrastructure on AWS and Kubernetes.`,
    structuredRequirements: {
      mustHave: [
        'Python (5+ years production experience)',
        'AWS Infrastructure (EKS, EC2, RDS, IAM)',
        'English Fluent (C1+ / Native)',
        'Distributed systems & microservices architecture'
      ],
      niceToHave: [
        'Kubernetes container orchestration',
        'FinTech or PCI-DSS experience',
        'FastAPI or asynchronous event streaming',
        'Terraform or IaC automation'
      ],
      exclude: [
        'Junior / Intern applicants',
        'Candidates without production cloud infrastructure experience'
      ],
      targetSeniority: 'Senior / Lead',
      minimumYearsExperience: 5,
      preferredIndustries: ['Cloud Infrastructure', 'FinTech', 'Enterprise SaaS']
    },
    createdAt: '2026-09-01T10:00:00Z',
    status: 'ACTIVE',
    applicantCount: 8
  },
  {
    id: 'job-2',
    agencyId: 'agency-apex',
    title: 'Senior Full-Stack AI Platform Engineer',
    department: 'Intelligent Applications',
    location: 'San Francisco, CA / Remote',
    workArrangement: 'remote',
    salaryMin: 170000,
    salaryMax: 200000,
    currency: 'USD',
    description: `Looking for an experienced Senior Full-Stack AI Platform Engineer to build interactive discovery interfaces and high-performance search pipelines. Must be fluent with React, TypeScript, and modern Python backend services.`,
    structuredRequirements: {
      mustHave: [
        'React & TypeScript (4+ years)',
        'Python backend development',
        'PostgreSQL or relational databases',
        'API design and integration'
      ],
      niceToHave: [
        'Vector search & embeddings (pgvector / Pinecone)',
        'Cloud deployment experience on AWS',
        'Experience mentoring mid-level developers'
      ],
      exclude: [
        'Candidates with exclusively frontend-only experience',
        'Applicants requiring immediate relocation sponsorship without work authorization'
      ],
      targetSeniority: 'Senior',
      minimumYearsExperience: 4,
      preferredIndustries: ['Artificial Intelligence', 'Developer Tools', 'SaaS']
    },
    createdAt: '2026-09-03T15:00:00Z',
    status: 'ACTIVE',
    applicantCount: 5
  },
  {
    id: 'job-3',
    agencyId: 'agency-nova',
    title: 'Director of Clinical Informatics & Digital Health',
    department: 'Digital Health Solutions',
    industry: 'Healthcare & Life Sciences',
    location: 'Boston, MA / Remote',
    workArrangement: 'remote',
    salaryMin: 195000,
    salaryMax: 245000,
    currency: 'USD',
    description: `Leading national health intelligence network seeking a Director of Clinical Informatics to oversee electronic health records (EHR) analytics, HL7/FHIR pipeline integrations, and clinical workflow optimization.`,
    structuredRequirements: {
      mustHave: [
        'Healthcare informatics or clinical systems leadership (6+ years)',
        'HIPAA & healthcare compliance architecture',
        'Data interoperability (FHIR / HL7 / EHR)',
        'Executive stakeholder presentation & cross-functional leadership'
      ],
      niceToHave: [
        'MD, PharmD, or Master in Health Informatics',
        'AI/ML diagnostic pipeline governance',
        'Multi-hospital system deployment experience'
      ],
      exclude: [
        'Applicants without US healthcare regulatory experience',
        'Non-degree candidates'
      ],
      targetSeniority: 'Director / Executive',
      minimumYearsExperience: 6,
      preferredIndustries: ['Healthcare & Life Sciences', 'HealthTech', 'Biomedical']
    },
    createdAt: '2026-09-04T09:30:00Z',
    status: 'ACTIVE',
    applicantCount: 7
  },
  {
    id: 'job-4',
    agencyId: 'agency-apex',
    title: 'VP of Global Operations & Scaled Logistics',
    department: 'Executive Leadership',
    industry: 'Executive & Operations',
    location: 'New York, NY / Hybrid',
    workArrangement: 'hybrid',
    salaryMin: 220000,
    salaryMax: 275000,
    currency: 'USD',
    description: `Global supply chain enterprise is hiring a VP of Global Operations to lead multi-territory freight logistics, cross-border procurement workflows, and operational efficiency transformations across 14 hubs.`,
    structuredRequirements: {
      mustHave: [
        'Executive operations or supply chain leadership (8+ years)',
        'P&L ownership exceeding $40M',
        'Global vendor negotiations & cross-border freight management',
        'Continuous improvement & Lean Six Sigma execution'
      ],
      niceToHave: [
        'MBA from accredited institution',
        'ERP migration experience (SAP S/4HANA or NetSuite)',
        'Automated warehouse robotics integration'
      ],
      exclude: [
        'Individual contributors without management tenure',
        'Applicants unwilling to travel quarterly to international distribution hubs'
      ],
      targetSeniority: 'Vice President / Executive',
      minimumYearsExperience: 8,
      preferredIndustries: ['Executive & Operations', 'Logistics', 'Global Trade']
    },
    createdAt: '2026-09-02T11:15:00Z',
    status: 'ACTIVE',
    applicantCount: 4
  },
  {
    id: 'job-5',
    agencyId: 'agency-vanguard',
    title: 'Senior Quantitative Risk & FinTech Strategist',
    department: 'Quantitative Trading & Risk',
    industry: 'Finance & Banking',
    location: 'Chicago, IL / Remote',
    workArrangement: 'remote',
    salaryMin: 185000,
    salaryMax: 235000,
    currency: 'USD',
    description: `Institutional digital asset & algorithmic trading firm looking for a Senior Quantitative Risk Strategist to design real-time portfolio risk models, Value at Risk (VaR) calculations, and stress testing engines.`,
    structuredRequirements: {
      mustHave: [
        'Quantitative risk modeling or financial engineering (5+ years)',
        'Python or C++ for algorithmic simulation and statistical analysis',
        'Derivatives pricing, fixed income, or liquidity risk frameworks',
        'Advanced degree in Financial Mathematics, Physics, or CS'
      ],
      niceToHave: [
        'CFA / FRM designation',
        'High-frequency trading (HFT) infrastructure',
        'Regulatory reporting experience (Basel III / SEC)'
      ],
      exclude: [
        'Applicants without quantitative modeling background',
        'Junior analysts'
      ],
      targetSeniority: 'Senior',
      minimumYearsExperience: 5,
      preferredIndustries: ['Finance & Banking', 'FinTech', 'Hedge Funds']
    },
    createdAt: '2026-09-05T14:00:00Z',
    status: 'ACTIVE',
    applicantCount: 9
  },
  {
    id: 'job-6',
    agencyId: 'agency-nova',
    title: 'Enterprise Head of Revenue Operations (RevOps)',
    department: 'Commercial & Sales Strategy',
    industry: 'Sales & Revenue Operations',
    location: 'Austin, TX / Remote',
    workArrangement: 'remote',
    salaryMin: 170000,
    salaryMax: 215000,
    currency: 'USD',
    description: `B2B enterprise SaaS platform seeks a Head of RevOps to align sales enablement, marketing attribution pipelines, customer success metrics, and Salesforce/HubSpot lifecycle analytics.`,
    structuredRequirements: {
      mustHave: [
        'RevOps or Sales Operations leadership (5+ years in B2B SaaS)',
        'Salesforce CRM architecture, CPQ, and pipeline reporting',
        'Data analysis & cohort retention modeling (SQL / Tableau / Looker)',
        'Territory planning, quota compensation modeling, and SDR enablement'
      ],
      niceToHave: [
        'Experience scaling ARR from $10M to $50M+',
        'Gong, Outreach, or HubSpot enterprise integrations',
        'Strategic pricing and packaging optimization'
      ],
      exclude: [
        'Direct quota-carrying sales reps without operations background'
      ],
      targetSeniority: 'Head of Department / Director',
      minimumYearsExperience: 5,
      preferredIndustries: ['Sales & Revenue Operations', 'Enterprise SaaS', 'High-Growth Tech']
    },
    createdAt: '2026-09-06T08:00:00Z',
    status: 'ACTIVE',
    applicantCount: 11
  }
];

export const INITIAL_MATCHES: JobMatchResult[] = [
  {
    id: 'match-1-1',
    jobId: 'job-1',
    candidateId: 'cand-1',
    matchScore: 96,
    stage1Passed: true,
    stage1FilterNotes: [
      'Salary expectation ($185k-$215k) falls within budget ($180k-$220k).',
      'Remote work preference matches job flexibility.',
      '7 years experience satisfies 5+ years minimum.'
    ],
    evidenceList: [
      {
        id: 'ev-1',
        requirement: 'Python (5+ years production experience)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: '7+ years building enterprise microservices and event pipelines in Python across Aether Cloud Systems and FinStream Global.',
        sourceSection: 'Employment History / Skills',
        confidence: 99,
      },
      {
        id: 'ev-2',
        requirement: 'AWS Infrastructure (EKS, EC2, RDS, IAM)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'AWS Certified Solutions Architect – Professional with 5+ years managing EKS, EC2, and PostgreSQL on AWS.',
        sourceSection: 'Certifications & Employment History',
        confidence: 98,
      },
      {
        id: 'ev-3',
        requirement: 'English Fluent (C1+ / Native)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Native English proficiency stated and verified; US university graduate.',
        sourceSection: 'Languages & Education',
        confidence: 99,
      },
      {
        id: 'ev-4',
        requirement: 'Kubernetes container orchestration',
        category: 'NICE_TO_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Certified Kubernetes Administrator (CKA); deployed FastAPI microservices on AWS EKS cluster.',
        sourceSection: 'Certifications & Employment',
        confidence: 96,
      },
      {
        id: 'ev-5',
        requirement: 'FinTech or PCI-DSS experience',
        category: 'NICE_TO_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Engineered ledger worker services at FinStream Global with strict PCI-DSS data protection compliance.',
        sourceSection: 'Employment History',
        confidence: 95,
      }
    ],
    potentialConcerns: [
      'Candidate is currently in Seattle, WA; while role is remote, occasional travel for quarterly syncs should be confirmed.'
    ],
    recommendationSummary: 'Ideal fit. Candidate holds verified top-tier AWS and CKA certifications, 7 years Python tenure, and verified high-scale event throughput experience.',
    pipelineStage: 'INTERVIEW',
    recruiterNotes: 'Elena scored 95% in the Recruiter Readiness assessment. Interview scheduled with Engineering Director for Thursday at 2 PM PST.',
    updatedAt: '2026-09-05T16:00:00Z'
  },
  {
    id: 'match-1-3',
    jobId: 'job-1',
    candidateId: 'cand-3',
    matchScore: 89,
    stage1Passed: true,
    stage1FilterNotes: [
      'Salary requirement (€120k-€145k) converts smoothly into USD target budget ($135k-$160k).',
      'Remote Europe availability accommodates flexible hours.'
    ],
    evidenceList: [
      {
        id: 'ev-31',
        requirement: 'AWS Infrastructure (EKS, EC2, RDS, IAM)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: '8 years multi-region AWS cloud and Kubernetes orchestration; holds CKS security credential.',
        sourceSection: 'Employment & Certifications',
        confidence: 97,
      },
      {
        id: 'ev-32',
        requirement: 'Python (5+ years production experience)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Writes custom automation tools and controllers in Python and Go for cloud clusters.',
        sourceSection: 'Skills & Employment',
        confidence: 90,
      },
      {
        id: 'ev-33',
        requirement: 'English Fluent (C1+ / Native)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Certified C1 professional English speaking, writing, and reading.',
        sourceSection: 'Languages',
        confidence: 94,
      }
    ],
    potentialConcerns: [
      'Primary background is DevOps & Platform Reliability rather than pure application-level Python microservice architecture.'
    ],
    recommendationSummary: 'High potential for infrastructure-heavy responsibilities. Candidate possesses elite Kubernetes security and multi-region AWS architecture experience.',
    pipelineStage: 'SHORTLISTED',
    recruiterNotes: 'Strong backup for Lead Architect with exceptional infrastructure depth. Preparing initial phone screening invitation.',
    updatedAt: '2026-09-04T12:00:00Z'
  },
  {
    id: 'match-2-2',
    jobId: 'job-2',
    candidateId: 'cand-2',
    matchScore: 94,
    stage1Passed: true,
    stage1FilterNotes: [
      'Salary expectation ($170k-$195k) aligns with $170k-$200k bracket.',
      'Remote US/Canada match.'
    ],
    evidenceList: [
      {
        id: 'ev-21',
        requirement: 'React & TypeScript (4+ years)',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Lead Full-Stack Developer directing UI architecture in React and TypeScript at Helios Data Intelligence.',
        sourceSection: 'Employment History',
        confidence: 98,
      },
      {
        id: 'ev-22',
        requirement: 'Python backend development',
        category: 'MUST_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: '6 years developing Python APIs, machine learning services, and vector database ingestion pipelines.',
        sourceSection: 'Skills & Employment',
        confidence: 96,
      },
      {
        id: 'ev-23',
        requirement: 'Vector search & embeddings (pgvector / Pinecone)',
        category: 'NICE_TO_HAVE',
        status: 'EXPLICIT_MATCH',
        evidenceText: 'Built PostgreSQL pgvector search embeddings for enterprise client discovery interfaces.',
        sourceSection: 'Employment History',
        confidence: 95,
      }
    ],
    potentialConcerns: [
      'Candidate has not completed Modules 4-6 of the Recruiter Readiness course yet (currently 50% readiness score).'
    ],
    recommendationSummary: 'Excellent match across both React/TypeScript frontend and Python AI vector systems. Encouraged candidate to finalize course assessment.',
    pipelineStage: 'SCREENING',
    recruiterNotes: 'Technical screening call scheduled for Wednesday morning.',
    updatedAt: '2026-09-04T18:00:00Z'
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'audit-1',
    tenantId: 'agency-apex',
    actorRole: 'CANDIDATE',
    actorName: 'Elena Rostova',
    action: 'CV_EXTRACTION_CONFIRMED',
    details: 'Candidate verified all 6 extracted skills, 2 employment records, and confirmed canonical profile status.',
    timestamp: '2026-09-02T14:35:12Z'
  },
  {
    id: 'audit-2',
    tenantId: 'agency-apex',
    actorRole: 'CANDIDATE',
    actorName: 'Elena Rostova',
    action: 'ASSESSMENT_COMPLETED',
    details: 'Completed Final Recruiter-Ready Assessment with 95% score; issued Certificate #RPD-2026-849201.',
    timestamp: '2026-09-05T10:15:00Z'
  },
  {
    id: 'audit-3',
    tenantId: 'agency-apex',
    actorRole: 'RECRUITER',
    actorName: 'Sarah Jenkins (Senior Partner)',
    action: 'PIPELINE_STAGE_CHANGED',
    details: 'Moved candidate Elena Rostova (CND-8492) from SCREENING to INTERVIEW for "Lead Python & Cloud Architect".',
    timestamp: '2026-09-05T16:00:20Z'
  },
  {
    id: 'audit-4',
    tenantId: 'agency-apex',
    actorRole: 'RECRUITER',
    actorName: 'System Engine',
    action: 'HYBRID_MATCH_EVALUATED',
    details: 'Stage 1 filter passed (3/3), Stage 2 Gemini Evaluator scored fit at 96% with 5 inspectable citations.',
    timestamp: '2026-09-05T15:58:00Z'
  }
];
