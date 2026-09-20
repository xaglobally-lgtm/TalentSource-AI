import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const CVIntelligenceReportCard: React.FC<{ onProceedToProfile?: () => void }> = ({ onProceedToProfile }) => {
  const { activeCandidate, t } = useApp();
  const report = activeCandidate.cvIntelligenceReport;

  if (!report) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center">
        <p className="text-xs text-stone-500">No CV intelligence report generated yet.</p>
      </div>
    );
  }

  const score = report.completenessScore || 88;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden h-full min-h-0 flex flex-col justify-between">
      {/* Top Banner */}
      <div className="px-3.5 py-2 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900">{t.cvIntelligenceReport}</h2>
            <p className="text-[11px] text-stone-500">
              Audit results and profile strengths
            </p>
          </div>
        </div>

        {/* Completeness Gauge */}
        <div className="flex items-center gap-2.5 bg-white px-3 py-1 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-right">
            <div className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
              Completeness
            </div>
            <div className="text-sm font-black text-stone-900 leading-tight">{score}%</div>
          </div>
          <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-[11px] text-emerald-800 bg-emerald-50">
            {score >= 90 ? 'A+' : score >= 80 ? 'A' : 'B'}
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2.5 flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Executive Summary */}
        {report.executiveSummary && (
          <div className="px-3 py-1.5 rounded-xl bg-purple-50/40 border border-purple-200/80 flex items-start gap-2 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-900 leading-relaxed font-medium">
              {report.executiveSummary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 min-h-0 overflow-y-auto">
          {/* Strong Areas */}
          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 overflow-y-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Strong Areas</span>
            </div>
            <ul className="space-y-1.5">
              {report.strongAreas?.map((item, idx) => (
                <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Areas */}
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/30 overflow-y-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Missing Areas</span>
            </div>
            <ul className="space-y-1.5">
              {report.missingAreas?.map((item, idx) => (
                <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Improvements */}
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/30 overflow-y-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Opportunities</span>
            </div>
            <ul className="space-y-1.5">
              {report.potentialImprovements?.map((item, idx) => (
                <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer with Pathway Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 shrink-0">
          <span className="text-[10px] text-stone-400 font-mono">
            Audit Date: {report.analyzedAt ? new Date(report.analyzedAt).toLocaleDateString() : 'Recent'}
          </span>

          {onProceedToProfile && (
            <button
              id="btn-proceed-to-profile"
              onClick={onProceedToProfile}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <span>Continue to Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
