import React from 'react';
import { 
  Search, 
  Filter, 
  Award, 
  X, 
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export interface CVFilterCriteria {
  searchTerm: string;
  minReadiness: number;
  onlyCertified: boolean;
  workArrangement: 'all' | 'remote' | 'hybrid' | 'onsite';
  minExperienceYears: number;
}

interface CVFilterBarProps {
  criteria: CVFilterCriteria;
  onChange: (newCriteria: CVFilterCriteria) => void;
  matchingCount: number;
  totalCount: number;
  className?: string;
}

export const CVFilterBar: React.FC<CVFilterBarProps> = ({
  criteria,
  onChange,
  matchingCount,
  totalCount,
  className = '',
}) => {
  const isFiltered = 
    criteria.searchTerm.trim() !== '' ||
    criteria.minReadiness > 0 ||
    criteria.onlyCertified ||
    criteria.workArrangement !== 'all' ||
    criteria.minExperienceYears > 0;

  const handleReset = () => {
    onChange({
      searchTerm: '',
      minReadiness: 0,
      onlyCertified: false,
      workArrangement: 'all',
      minExperienceYears: 0,
    });
  };

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 p-3.5 shadow-2xs space-y-3 ${className}`}>
      {/* Top Search and Quick Toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter CVs by skill, role, tech stack..."
            value={criteria.searchTerm}
            onChange={(e) => onChange({ ...criteria, searchTerm: e.target.value })}
            className="w-full pl-9 pr-7 py-1.5 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-teal-500 transition-colors"
          />
          {criteria.searchTerm && (
            <button
              onClick={() => onChange({ ...criteria, searchTerm: '' })}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {/* Certified Only Badge */}
          <button
            type="button"
            onClick={() => onChange({ ...criteria, onlyCertified: !criteria.onlyCertified })}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              criteria.onlyCertified
                ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300 shadow-2xs font-bold'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${criteria.onlyCertified ? 'text-amber-600' : 'text-stone-400'}`} />
            <span>Academy Certified</span>
          </button>

          {/* Readiness Preset Buttons */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 px-1">Ready:</span>
            {[
              { label: 'All', value: 0 },
              { label: '70%+', value: 70 },
              { label: '85%+', value: 85 },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => onChange({ ...criteria, minReadiness: p.value })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  criteria.minReadiness === p.value
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Arrangement Select */}
          <select
            value={criteria.workArrangement}
            onChange={(e) => onChange({ ...criteria, workArrangement: e.target.value as any })}
            className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">Any Arrangement</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>

          {/* Reset button if filtered */}
          {isFiltered && (
            <button
              onClick={handleReset}
              title="Reset all filters"
              className="flex items-center gap-1 px-2.5 py-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Line */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
        <span className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-stone-400" />
          <span>Showing <strong className="text-stone-900">{matchingCount}</strong> of {totalCount} verified candidates</span>
        </span>

        {criteria.minReadiness > 0 && (
          <span className="text-emerald-700 font-semibold">
            Filtered by Readiness ≥ {criteria.minReadiness}%
          </span>
        )}
      </div>
    </div>
  );
};
