import { CourseModule } from '../types';

export const RECRUITER_READINESS_COURSE: CourseModule[] = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Modern Recruitment Process & Agency Ecosystem',
    summary: 'Understand how agency recruiters, corporate sourcers, and ATS algorithms evaluate talent pipelines.',
    isCompleted: false,
    lessons: [
      {
        id: 'les-1-1',
        title: 'How Agency Recruiters Evaluate Candidates',
        estimatedMinutes: 8,
        content: `Agency recruiters represent client companies seeking exact-match talent under tight deadlines. Unlike corporate HR who review applications inbound, agency recruiters actively hunt across verified candidate pools.
        
Key factors that make a profile immediately submit-ready:
1. **Verifiable Impact:** Tangible metrics (revenue increased, latency reduced, team size managed).
2. **Explicit Skill Verification:** Distinguishing between hands-on production experience and casual familiarity.
3. **Availability & Alignment:** Clear communication regarding notice periods, compensation expectations, and work style.

When recruiters have pre-verified evidence on each skill, your placement probability increases by more than 300%.`,
        keyTakeaways: [
          'Agency recruiters prioritize low-risk, verified competencies.',
          'Ambiguous dates or vague role descriptions slow down client submissions.',
          'Direct alignment with client "Must-Have" criteria drives interview invitations.'
        ]
      },
      {
        id: 'les-1-2',
        title: 'ATS Filters vs Human Recruiter Eyes',
        estimatedMinutes: 6,
        content: `Applicant Tracking Systems (ATS) organize and score candidate data, but human decision-makers verify the evidence. In SOURCE.AI, your CV is parsed into structured fields with source confidence scores.
        
Ensure:
- Standard section headers (Employment History, Education, Technical Skills).
- Explicit naming of technologies used within each specific employment tenure, not just in an isolated skills list.
- Consistent chronology without unexplained multi-year gaps.`,
        keyTakeaways: [
          'Contextual skill evidence carries 2x the weight of simple keyword tags.',
          'Chronological integrity builds immediate trust with hiring teams.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-1-1',
        prompt: 'What makes an agency recruiter most confident to submit a candidate to their client hiring manager?',
        options: [
          'A long list of 50+ self-declared technical buzzwords without dates',
          'Verified, contextual evidence of achievements and clear alignment with Must-Have criteria',
          'A generic resume sent without salary expectations or location preferences',
          'Relying entirely on AI to invent missing qualifications'
        ],
        correctAnswerIndex: 1,
        explanation: 'Hiring managers demand concrete, verified evidence of performance and exact fit with required criteria.'
      },
      {
        id: 'q-1-2',
        prompt: 'Why is connecting skills to specific employment roles more effective than a generic skills cloud?',
        options: [
          'It proves hands-on production tenure and recency of use rather than theoretical knowledge',
          'It makes the resume take up more pages',
          'It confuses the recruiter intentionally',
          'It hides gaps in employment history'
        ],
        correctAnswerIndex: 0,
        explanation: 'Contextual employment evidence validates how recently and at what scale a skill was utilized.'
      }
    ]
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Professional Communication & Working with Recruiters',
    summary: 'Master transparency, prompt response etiquette, and compensation benchmarking to accelerate offers.',
    isCompleted: false,
    lessons: [
      {
        id: 'les-2-1',
        title: 'The Partnership Mindset with Sourcing Agents',
        estimatedMinutes: 7,
        content: `Your recruiter is your advocate and coach. When you equip them with transparent facts, they negotiate higher offers and guide you through client interview styles.
        
Golden rules of candidate-recruiter engagement:
- **Immediate Status Updates:** Inform them if you receive competing offers or changes in availability.
- **Realistic Salary Bands:** Clarify your minimum floor, target baseline, and flexible components (equity, benefits, remote stipends).
- **Preparation Feedback:** Debrief with your recruiter immediately after each interview round so they can manage client sentiment.`,
        keyTakeaways: [
          'Treat your recruiter as an executive agent, not a gatekeeper.',
          'Immediate post-interview debriefs provide decisive leverage.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-2-1',
        prompt: 'When negotiating compensation with a recruiter, what is the best strategy?',
        options: [
          'Hide your expectations until the final contract is signed',
          'Provide clear, research-backed salary floors and preferred ranges upfront with transparency',
          'Refuse to answer any compensation questions',
          'State whatever random number comes to mind without market benchmarking'
        ],
        correctAnswerIndex: 1,
        explanation: 'Upfront, transparent compensation parameters avoid wasted interview cycles and enable the recruiter to secure your target band.'
      }
    ]
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Strengthening Your Professional Profile & Evidence',
    summary: 'Transform passive job descriptions into measurable accomplishment narratives that score top match rates.',
    isCompleted: false,
    lessons: [
      {
        id: 'les-3-1',
        title: 'The Google XYZ Formula for High-Impact CV Points',
        estimatedMinutes: 9,
        content: `Hiring managers and AI matching engines prioritize measurable impact over passive responsibility summaries.
        
Use the proven formula:
**"Accomplished [X] as measured by [Y], by doing [Z]"**
        
*Before:* "Responsible for managing AWS infrastructure."
*After:* "Reduced cloud infrastructure operating costs by 34% ($180k/yr) by re-architecting Kubernetes clusters and automating auto-scaling policies on AWS."
        
Notice how the improved bullet provides immediate verifiable citations for: Cost Optimization, Kubernetes, AWS, and Infrastructure Architecture.`,
        keyTakeaways: [
          'Measure outcomes with percentages, financial numbers, or team velocity.',
          'Clearly state the methodologies and tools utilized to achieve the result.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-3-1',
        prompt: 'Which bullet point demonstrates the highest quality CV evidence?',
        options: [
          'Helped the team with various daily engineering tasks and bug tickets',
          'Worked on backend microservices with Python and databases',
          'Scaled API throughput from 1,200 to 8,500 req/sec while lowering P99 latency by 45% using Redis caching and PostgreSQL indexing',
          'Always came to work on time and was a pleasant team player'
        ],
        correctAnswerIndex: 2,
        explanation: 'Concrete metrics (1,200 to 8,500 req/sec, 45% latency reduction) paired with specific tools provide undeniable evidence of engineering competence.'
      }
    ]
  },
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Interview Preparation Essentials & Behavioral STAR Method',
    summary: 'Structure your answers to technical, system design, and behavioral hurdles with structured precision.',
    isCompleted: false,
    lessons: [
      {
        id: 'les-4-1',
        title: 'The STAR Method (Situation, Task, Action, Result)',
        estimatedMinutes: 10,
        content: `Behavioral questions like "Tell me about a time a project was failing" are designed to test your resilience and problem-solving methodology under pressure.
        
- **Situation:** Set the scene in 1-2 concise sentences (context, stakes).
- **Task:** Explain your specific responsibility in that crisis.
- **Action:** 70% of your time should be spent detailing YOUR actions, rationale, and technical decisions.
- **Result:** The quantifiable outcome, lessons learned, and systemic improvements implemented.`,
        keyTakeaways: [
          'Keep Situation and Task brief; concentrate on your specific Actions.',
          'Conclude with the business outcome or engineering lesson.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-4-1',
        prompt: 'In the STAR interview response framework, where should the candidate spend the majority of their explanation?',
        options: [
          'Complaining about previous management in the Situation phase',
          'The specific Actions, decisions, and leadership steps they personally executed',
          'Describing what someone else on the team did',
          'Skipping straight to asking how much the job pays'
        ],
        correctAnswerIndex: 1,
        explanation: 'Interviewers evaluate your personal agency, technical execution, and problem solving in the Action phase.'
      }
    ]
  },
  {
    id: 'mod-5',
    moduleNumber: 5,
    title: 'Workplace Expectations & Professional Ethics',
    summary: 'Ethical integrity, client confidentiality, non-disclosure compliance, and intellectual property guidelines.',
    isCompleted: false,
    lessons: [
      {
        id: 'les-5-1',
        title: 'Protecting Confidentiality while Demonstrating Competence',
        estimatedMinutes: 6,
        content: `When showcasing past accomplishments, candidates must strictly honor past employers' proprietary data and NDAs.
        
- Anonymize internal client names or confidential system codenames.
- Discuss architectural patterns and public-domain technology rather than secret proprietary algorithms.
- Demonstrate honesty: if you did not lead a sub-component, acknowledge your exact role.`,
        keyTakeaways: [
          'Candidates who protect previous employer IP prove trustworthy to new employers.',
          'Never share proprietary code or non-public financial metrics.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-5-1',
        prompt: 'How should you discuss confidential projects from your prior employer in an interview?',
        options: [
          'Paste confidential company source code into the chat to show off skills',
          'Anonymize proprietary details, focus on open architectural principles and public tech, and respect all NDAs',
          'Pretend you never worked on the project at all',
          'Promise the interviewer you will steal code from your current company if they hire you'
        ],
        correctAnswerIndex: 1,
        explanation: 'Demonstrating NDA respect reassures hiring managers that you will protect their company trade secrets as well.'
      }
    ]
  },
  {
    id: 'mod-6',
    moduleNumber: 6,
    title: 'Final Recruiter-Ready Assessment & Certification',
    summary: 'Demonstrate readiness across the complete talent pipeline to earn your verified credential and readiness boost.',
    isCompleted: false,
    lessons: [
      {
        id: 'les-6-1',
        title: 'Readiness Scoring & Client Submission Standards',
        estimatedMinutes: 5,
        content: `Upon completing this final assessment with an 80%+ score, your Candidate Readiness Score will automatically receive the maximum 30% Professional Development boost.
        
A verified certificate with an immutable ID is issued, signaling to agency recruiters that you are fully prepared for client interviews, offer negotiations, and professional placement.`,
        keyTakeaways: [
          'Achieve 80%+ score to graduate and receive your Verified Recruiter Ready Certificate.',
          'Your profile is prioritized in recruiter matching shortlists.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-6-1',
        prompt: 'What core principle defines the SOURCE.AI candidate verification standard?',
        options: [
          'AI can silently invent candidate credentials to match job requirements',
          'Candidates review, verify, and confirm all extracted data with human oversight before it becomes canonical',
          'Recruiters do not need to look at candidate evidence',
          'Blind screening is not useful in reducing hiring bias'
        ],
        correctAnswerIndex: 1,
        explanation: 'SOURCE.AI operates on the strict ethical standard that candidates verify and own their canonical profile data, and AI never fabricates facts.'
      },
      {
        id: 'q-6-2',
        prompt: 'How does the Candidate Readiness Score help recruiters and candidates?',
        options: [
          'It provides a transparent, multi-component breakdown of profile quality, verification, and preparation',
          'It serves as a black-box secret formula that nobody can inspect',
          'It eliminates the need for human recruiters',
          'It randomly assigns numbers to candidates'
        ],
        correctAnswerIndex: 0,
        explanation: 'The readiness score is fully transparent, combining profile completeness, CV quality, professional development, and verification.'
      }
    ]
  }
];
