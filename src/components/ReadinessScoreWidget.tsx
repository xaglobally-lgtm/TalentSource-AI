import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export const ReadinessScoreWidget: React.FC<{ onStartCourse?: () => void }> = ({ onStartCourse }) => {
  const { activeCandidate, t } = useApp();
  const readiness = activeCandidate.readinessScore;

  const components = [
    {
      title: 'Profile Completeness',
      weight: '20%',
      score: readiness.profileCompleteness,
      desc: 'Contact details, chronology, locations & salary preferences'
    },
    {
      title: 'CV Quality & Clarity',
      weight: '20%',
      score: readiness.cvQuality,
      desc: 'Measurable metric citations and structured achievements'
    },
    {
      title: 'Professional Development',
      weight: '30%',
      score: readiness.professionalDevelopment,
      desc: '6-Module Recruiter Preparation Academy progress'
    },
    {
      title: 'Interview Readiness',
      weight: '15%',
      score: readiness.interviewReadiness,
      desc: 'STAR behavioral structure and compensation benchmarking'
    },
    {
      title: 'Verification Status',
      weight: '15%',
      score: readiness.verificationStatus,
      desc: 'Candidate confirmed skills and credentials'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-2 ring-purple-400/35 overflow-hidden h-full flex flex-col min-h-0">
      {/* Top Banner */}
      <div className="px-3.5 py-2 border-b border-stone-200 bg-purple-50/40 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900">{t.readinessScore}</h2>
            <p className="text-[10px] text-purple-700/80 font-medium">
              Weighted readiness dimensions
            </p>
          </div>
        </div>

        {/* Big Overall Score Badge */}
        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs">
          <div className="text-right">
            <span className="text-[8.5px] font-bold uppercase tracking-wider text-stone-400 block leading-none">
              Overall
            </span>
            <div className="text-lg font-black text-purple-700 leading-none mt-0.5">
              {readiness.overallScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Component Breakdown List */}
      <div className="p-2.5 sm:p-3 flex-1 min-h-0 overflow-y-auto space-y-2">
        {components.map((comp, idx) => (
          <div 
            key={idx} 
            className="p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col gap-1.5 shadow-2xs"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-stone-800">{comp.title}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-stone-400 font-semibold">{comp.weight}</span>
                <span className="font-mono font-bold text-purple-700">{comp.score}%</span>
              </div>
            </div>

            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  comp.score >= 80 ? 'bg-purple-600' : comp.score >= 50 ? 'bg-purple-400' : 'bg-stone-300'
                }`}
                style={{ width: `${comp.score}%` }}
              />
            </div>

            <p className="text-[10px] text-stone-500 leading-snug line-clamp-1">{comp.desc}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Action Trigger to Increase Readiness */}
      <div className="p-2.5 border-t border-purple-100 bg-purple-50/40 shrink-0">
        {readiness.professionalDevelopment < 100 ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 bg-purple-600 text-white rounded-lg shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold text-purple-950 truncate">
                  Boost score by +{Math.round((100 - readiness.professionalDevelopment) * 0.3)} pts
                </h4>
                <p className="text-[10px] text-purple-800 truncate">
                  Complete academy modules for certificate.
                </p>
              </div>
            </div>

            {onStartCourse && (
              <button
                onClick={onStartCourse}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Learn</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="text-[11px]">Development Verified</span>
            </div>
            {activeCandidate.courseProgress.certificate && (
              <span className="text-[10px] font-mono text-purple-700 font-bold">
                #{activeCandidate.courseProgress.certificate.certificateId}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
