import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export const ReUploadConflictModal: React.FC = () => {
  const { activeConflict, setActiveConflict, t } = useApp();

  if (!activeConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-200 p-5 flex items-start gap-3.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-900">{t.conflictDetected}</h3>
            <p className="text-xs text-amber-700 mt-1">
              You previously verified and confirmed this field. A new CV upload extracted different text. Which value should be preserved in the canonical record?
            </p>
          </div>
        </div>

        {/* Diff Comparison Body */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Target Field: <span className="text-stone-900 font-bold">{activeConflict.fieldLabel}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Verified Value */}
            <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Current Verified Value
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Human Confirmed
                  </span>
                </div>
                <p className="text-sm font-semibold text-stone-900 whitespace-pre-line">
                  {typeof activeConflict.currentVerifiedValue === 'object' 
                    ? JSON.stringify(activeConflict.currentVerifiedValue, null, 2)
                    : String(activeConflict.currentVerifiedValue)}
                </p>
              </div>

              <button
                id="btn-keep-verified"
                onClick={() => {
                  activeConflict.onResolve(activeConflict.currentVerifiedValue);
                  setActiveConflict(null);
                }}
                className="mt-4 w-full py-2 px-3 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              >
                {t.keepVerified}
              </button>
            </div>

            {/* New CV Extraction */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    New CV Extraction
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                    AI Re-Scan
                  </span>
                </div>
                <p className="text-sm font-medium text-stone-700 whitespace-pre-line">
                  {typeof activeConflict.newExtractedValue === 'object'
                    ? JSON.stringify(activeConflict.newExtractedValue, null, 2)
                    : String(activeConflict.newExtractedValue)}
                </p>
              </div>

              <button
                id="btn-accept-new"
                onClick={() => {
                  activeConflict.onResolve(activeConflict.newExtractedValue);
                  setActiveConflict(null);
                }}
                className="mt-4 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors"
              >
                {t.acceptNewExtraction}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 text-right">
          <button
            onClick={() => setActiveConflict(null)}
            className="text-xs text-stone-500 hover:text-stone-800 font-medium"
          >
            Decide Later (Keep Current)
          </button>
        </div>
      </div>
    </div>
  );
};
