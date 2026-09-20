import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Globe, 
  Briefcase, 
  UserCheck, 
  Building2, 
  ChevronDown,
  Sliders,
  Download,
  Check
} from 'lucide-react';
import { AVAILABLE_LOCALES } from '../locales/translations';
import { TalentSourceLogo } from './TalentSourceLogo';
import { BlindScreeningSettingsModal } from './BlindScreeningSettingsModal';
import { exportCandidateDossier } from '../utils/exportUtils';

export const Header: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    currentLocale, 
    setCurrentLocale, 
    t,
    blindScreeningMode, 
    setBlindScreeningMode,
    blindSettings,
    activeTenant,
    setActiveTenant,
    tenants,
    activeCandidate,
    candidates,
    setActiveCandidateId
  } = useApp();

  const [isBlindModalOpen, setIsBlindModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const currentLocaleObj = AVAILABLE_LOCALES.find(l => l.code === currentLocale) || AVAILABLE_LOCALES[0];

  const activeBlindCount = Object.entries(blindSettings).filter(
    ([k, v]) => k !== 'enabled' && v === true
  ).length;

  return (
    <header className="border-b border-stone-200 bg-white shrink-0 z-30 shadow-2xs select-none">
      {/* 1. TOP UTILITY STRIP: Universal AI Talent Network Context & Multi-Language Selector */}
      <div 
        className="px-4 py-1 text-xs text-white flex items-center justify-between transition-colors duration-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/40"
      >
        {/* Left: Universal Network or Partner Workspace Context */}
        <div className="flex items-center gap-2">
          {activeRole === 'CANDIDATE' ? (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/40">
                <Globe className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span className="font-black tracking-wider uppercase text-[10.5px] text-white">
                  Universal AI Talent Network
                </span>
              </div>
              <span className="opacity-85 hidden md:inline text-[11px] font-medium text-slate-200">
                100% Automated Multi-Industry Matching (Tech • Healthcare • Finance • Executive • RevOps)
              </span>
              <span className="bg-emerald-400 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                1,420+ Hiring Partners Live
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 opacity-80" />
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Partner / Sector:
              </span>
              <div className="relative inline-block">
                <select
                  id="agency-workspace-select"
                  value={activeTenant.id}
                  onChange={(e) => {
                    const found = tenants.find(t => t.id === e.target.value);
                    if (found) setActiveTenant(found);
                  }}
                  className="bg-black/35 hover:bg-black/45 text-white font-bold text-xs py-0.5 pl-2 pr-5 rounded-md border border-white/20 focus:outline-hidden cursor-pointer"
                  title="Switch Recruitment Sector / Partner Agency"
                >
                  {tenants.map(tn => (
                    <option key={tn.id} value={tn.id} className="text-stone-900 bg-white font-medium">
                      {tn.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-white/70 absolute right-1.5 top-1.5 pointer-events-none" />
              </div>
              <span className="opacity-75 hidden md:inline text-[11px]">• {activeTenant.tagline}</span>
            </div>
          )}
        </div>

        {/* Right: Blind Screening Status + Language Dropdown */}
        <div className="flex items-center gap-2.5">
          {blindScreeningMode && (
            <button
              onClick={() => setIsBlindModalOpen(true)}
              className="flex items-center gap-1.5 bg-black/25 hover:bg-black/35 px-2.5 py-0.5 rounded-full text-amber-200 font-medium cursor-pointer transition-colors"
              title="Click to configure blind screening filter parameters"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
              </span>
              <span className="text-[10px] font-bold">Blind Mode Active ({activeBlindCount} filters)</span>
            </button>
          )}

          {/* Language Selector (9 Languages) */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white px-2 py-0.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-3 h-3 text-white/80" />
              <span className="text-[11px]">{currentLocaleObj.native}</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsLangDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1 w-44 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Select Language
                  </div>
                  {AVAILABLE_LOCALES.map((loc) => {
                    const isSelected = currentLocale === loc.code;
                    return (
                      <button
                        key={loc.code}
                        onClick={() => {
                          setCurrentLocale(loc.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                          isSelected ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-stone-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium text-stone-900">{loc.native}</span>
                          <span className="text-[10px] text-stone-400">({loc.label})</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN APP BAR (Slim 46px panel header) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Brand & Identity: Flat 2D Sun Logo + Green Talent / Orange Source */}
        <TalentSourceLogo size="sm" />

        {/* Portal Primary Role Switcher */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 shadow-2xs">
          <button
            id="nav-candidate-tab"
            onClick={() => setActiveRole('CANDIDATE')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeRole === 'CANDIDATE'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Candidate</span>
          </button>

          <button
            id="nav-recruiter-tab"
            onClick={() => setActiveRole('RECRUITER')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeRole === 'RECRUITER'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Recruiter</span>
          </button>

          <button
            id="nav-admin-tab"
            onClick={() => setActiveRole('AGENCY_ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeRole === 'AGENCY_ADMIN'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Network Admin</span>
          </button>
        </div>

        {/* Right Section: Strictly Role-Specific Controls */}
        <div className="flex items-center gap-2">
          {/* CANDIDATE VIEW: Active Profile Selector + Export Dossier */}
          {activeRole === 'CANDIDATE' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportCandidateDossier(activeCandidate)}
                title="Download your human-verified talent dossier"
                className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-700 border border-stone-200 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3 text-stone-500" />
                <span className="hidden sm:inline">Export Dossier</span>
              </button>

              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2 py-1 rounded-xl text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                  {blindScreeningMode ? '#' : activeCandidate.firstName[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider leading-none">
                    Profile
                  </span>
                  <select
                    id="active-candidate-select"
                    value={activeCandidate.id}
                    onChange={(e) => setActiveCandidateId(e.target.value)}
                    className="bg-transparent font-bold text-stone-900 focus:outline-hidden cursor-pointer text-xs pr-2"
                  >
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>
                        {blindScreeningMode ? `#${c.candidateCode}` : `${c.firstName} ${c.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* RECRUITER VIEW: Blind Screening Compliance Control */}
          {activeRole === 'RECRUITER' && (
            <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden shadow-2xs">
              <button
                id="blind-screening-toggle-btn"
                onClick={() => setBlindScreeningMode(prev => !prev)}
                title={t.blindScreeningDesc}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  blindScreeningMode
                    ? 'bg-amber-100 text-amber-950 font-bold'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {blindScreeningMode ? (
                  <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{blindScreeningMode ? 'Blind: ON' : 'Blind Screening'}</span>
              </button>

              <button
                onClick={() => setIsBlindModalOpen(true)}
                title="Configure blind screening filters (gender, age, name, university...)"
                className="px-2 py-1 border-l border-stone-200 hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
              </button>
            </div>
          )}

          {/* ADMIN VIEW: Active Tenant indicator */}
          {activeRole === 'AGENCY_ADMIN' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Agency Admin Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Granular Blind Screening Settings Modal */}
      <BlindScreeningSettingsModal 
        isOpen={isBlindModalOpen} 
        onClose={() => setIsBlindModalOpen(false)} 
      />
    </header>
  );
};
