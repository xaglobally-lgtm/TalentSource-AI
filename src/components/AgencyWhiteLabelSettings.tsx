import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Users, 
  CheckCircle2, 
  Sliders, 
  Briefcase, 
  ShieldCheck, 
  Save, 
  History, 
  Sparkles,
  Building2,
  RefreshCw,
  Layers,
  ArrowUpRight,
  PieChart,
  Plus,
  Palette,
  Check,
  Award
} from 'lucide-react';
import { AgencyTenant } from '../types';
import { Locale } from '../locales/translations';

interface IndustrySector {
  id: string;
  name: string;
  icon: string;
  jobCount: number;
  salaryRange: string;
  activeMatchPool: number;
  enabled: boolean;
}

export const AgencyWhiteLabelSettings: React.FC = () => {
  const { 
    activeTenant, 
    updateTenant, 
    auditEvents, 
    jobs, 
    candidates, 
    matches, 
    autoMatchAllCandidates, 
    syncExternalJobFeeds,
    t 
  } = useApp();

  // White label branding state
  const [name, setName] = useState<string>(activeTenant.name);
  const [tagline, setTagline] = useState<string>(activeTenant.tagline);
  const [primaryColor, setPrimaryColor] = useState<string>(activeTenant.primaryColor);
  const [accentColor, setAccentColor] = useState<string>(activeTenant.accentColor);
  const [domain, setDomain] = useState<string>(activeTenant.customDomain || 'network.universal-talent.ai');
  const [locale, setLocale] = useState<Locale>(activeTenant.defaultLocale);
  const [minThreshold, setMinThreshold] = useState<number>(activeTenant.readinessThreshold || 70);

  // Monetization rates state
  const [passFee, setPassFee] = useState<number>(49);
  const [placementFeePercent, setPlacementFeePercent] = useState<number>(12);
  const [matchSensitivity, setMatchSensitivity] = useState<number>(75);

  // Action feedback states
  const [autoMatchNotification, setAutoMatchNotification] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Multi-Industry Sectors Matrix
  const [sectors, setSectors] = useState<IndustrySector[]>([
    {
      id: 'sec-tech',
      name: 'Technology, Cloud & AI Systems',
      icon: '🚀',
      jobCount: 560,
      salaryRange: '$170k - $240k',
      activeMatchPool: 1240,
      enabled: true,
    },
    {
      id: 'sec-health',
      name: 'Healthcare, MedTech & Informatics',
      icon: '🏥',
      jobCount: 340,
      salaryRange: '$180k - $250k',
      activeMatchPool: 680,
      enabled: true,
    },
    {
      id: 'sec-fin',
      name: 'Quantitative Finance & Banking',
      icon: '💳',
      jobCount: 290,
      salaryRange: '$185k - $260k',
      activeMatchPool: 590,
      enabled: true,
    },
    {
      id: 'sec-exec',
      name: 'Executive Leadership & C-Suite',
      icon: '👔',
      jobCount: 180,
      salaryRange: '$210k - $290k',
      activeMatchPool: 410,
      enabled: true,
    },
    {
      id: 'sec-revops',
      name: 'Sales, RevOps & Commercial Growth',
      icon: '📈',
      jobCount: 240,
      salaryRange: '$160k - $220k',
      activeMatchPool: 520,
      enabled: true,
    },
    {
      id: 'sec-legal',
      name: 'Legal, Compliance & Risk Governance',
      icon: '⚖️',
      jobCount: 110,
      salaryRange: '$175k - $245k',
      activeMatchPool: 260,
      enabled: true,
    },
  ]);

  const [newSectorName, setNewSectorName] = useState<string>('');
  const [showAddSector, setShowAddSector] = useState<boolean>(false);

  // Trigger 100% Automated Matching across all candidates and all jobs
  const handleTriggerAutoMatch = () => {
    const created = autoMatchAllCandidates();
    setAutoMatchNotification(
      created > 0 
        ? `Auto-Match Successful: Evaluated candidates against all jobs. Generated ${created} new high-confidence matches.` 
        : `Auto-Match Verified: All candidates already matched across all open network requisitions.`
    );
    setTimeout(() => setAutoMatchNotification(null), 5000);
  };

  // Trigger ATS sync from partner job boards
  const handleSyncFeeds = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const added = syncExternalJobFeeds();
      setIsSyncing(false);
      setSyncNotification(`Live Feed Ingestion: Synchronized ${added} external enterprise job requisitions into the network.`);
      setTimeout(() => setSyncNotification(null), 5000);
    }, 700);
  };

  const handleToggleSector = (sectorId: string) => {
    setSectors(prev => prev.map(s => s.id === sectorId ? { ...s, enabled: !s.enabled } : s));
  };

  const handleAddSector = () => {
    if (!newSectorName.trim()) return;
    const newSec: IndustrySector = {
      id: `sec-${Date.now()}`,
      name: newSectorName.trim(),
      icon: '🌐',
      jobCount: 45,
      salaryRange: '$150k - $210k',
      activeMatchPool: 120,
      enabled: true,
    };
    setSectors(prev => [...prev, newSec]);
    setNewSectorName('');
    setShowAddSector(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AgencyTenant = {
      ...activeTenant,
      name,
      tagline,
      primaryColor,
      accentColor,
      customDomain: domain,
      defaultLocale: locale,
      readinessThreshold: minThreshold
    };
    updateTenant(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Financial calculations
  const totalVerifiedPasses = 720;
  const passRevenue = totalVerifiedPasses * passFee;
  const placementsCount = 16;
  const avgPlacementSalary = 195000;
  const placementRevenue = Math.round(placementsCount * avgPlacementSalary * (placementFeePercent / 100));
  const totalGrossRevenue = passRevenue + placementRevenue;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER: Universal AI Talent Network Command Center */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
              <Globe className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Universal AI Talent Network
                </h2>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  100% Automated Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Model A: Multi-Sector Scalability • Zero Industry Silos • Automated Direct Monetization
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleTriggerAutoMatch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Evaluate and link all candidates against all network job requisitions automatically"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>1-Click Universal Auto-Match All</span>
          </button>

          <button
            onClick={handleSyncFeeds}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer disabled:opacity-50"
            title="Import open requisitions from enterprise partner ATS feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Partner Job Feeds</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {autoMatchNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{autoMatchNotification}</span>
        </div>
      )}

      {syncNotification && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 text-xs font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{syncNotification}</span>
        </div>
      )}

      {/* 2. REVENUE & MONETIZATION DASHBOARD (Live Cash Flow & Placement Volume) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Gross Revenue</span>
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">
            ${totalGrossRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+28.4% this month (Automated Network Growth)</span>
          </div>
        </div>

        {/* Candidate Fast-Track Passes */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Candidate Pass Revenue</span>
            <span className="p-2 rounded-lg bg-blue-100 text-blue-800">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">
            ${passRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {totalVerifiedPasses} Readiness Passes sold @ ${passFee}/ea
          </div>
        </div>

        {/* Enterprise Placement Commissions */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Placement Commissions</span>
            <span className="p-2 rounded-lg bg-purple-100 text-purple-800">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">
            ${placementRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {placementsCount} hires placed @ {placementFeePercent}% avg commission
          </div>
        </div>

        {/* Active Candidate & Partner Scale */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Universal Talent Pool</span>
            <span className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">
            3,050+
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            1,420+ connected employers across 6 sectors
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE MONETIZATION & NETWORK PRICING CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Automated Monetization & Pricing Engine
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Direct ACH / Stripe Escrow Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Candidate Pass Pricing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Candidate Fast-Track Certification Fee
            </label>
            <p className="text-[11px] text-stone-500">
              One-time charge for AI-verified dossier + high-priority network routing.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[29, 49, 79, 99].map((fee) => (
                <button
                  key={fee}
                  onClick={() => setPassFee(fee)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    passFee === fee 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  ${fee}
                </button>
              ))}
            </div>
          </div>

          {/* Employer Placement Success Commission */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Employer Placement Success Fee (%)
            </label>
            <p className="text-[11px] text-stone-500">
              Percentage of first-year base salary paid automatically on offer acceptance.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[10, 12, 15, 20].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlacementFeePercent(rate)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    placementFeePercent === rate 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Match Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">
                Auto-Match Sensitivity
              </label>
              <span className="text-xs font-mono font-bold text-stone-900">
                {matchSensitivity}% min score
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Minimum match score required to automatically notify employer recruiters.
            </p>
            <input
              type="range"
              min="60"
              max="90"
              value={matchSensitivity}
              onChange={(e) => setMatchSensitivity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. MULTI-SECTOR MATRIX (Zero Limitations on Industries) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                Multi-Industry Recruitment Matrix
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              The Universal Network matches talent across all industries without artificial agency borders.
            </p>
          </div>

          <button
            onClick={() => setShowAddSector(!showAddSector)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Industry Vertical</span>
          </button>
        </div>

        {/* Add Sector Form */}
        {showAddSector && (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="e.g. Energy & CleanTech, Supply Chain & Logistics..."
              value={newSectorName}
              onChange={(e) => setNewSectorName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg font-medium focus:outline-hidden focus:border-blue-500"
            />
            <button
              onClick={handleAddSector}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Enable Vertical
            </button>
          </div>
        )}

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sectors.map((sec) => (
            <div
              key={sec.id}
              className={`p-4 rounded-xl border transition-all ${
                sec.enabled 
                  ? 'bg-stone-50/70 border-stone-200' 
                  : 'bg-stone-100/50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sec.icon}</span>
                  <span className="text-xs font-bold text-stone-900">{sec.name}</span>
                </div>
                <button
                  onClick={() => handleToggleSector(sec.id)}
                  className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                    sec.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                      sec.enabled ? 'right-0.5' : 'left-0.5'
                    }`} 
                  />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60 text-center">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Live Jobs</span>
                  <span className="text-xs font-bold text-stone-800">{sec.jobCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Candidates</span>
                  <span className="text-xs font-bold text-stone-800">{sec.activeMatchPool}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Avg Comp</span>
                  <span className="text-[11px] font-semibold text-emerald-700">{sec.salaryRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ENTERPRISE PARTNER WHITE-LABEL & COMPLIANCE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enterprise Client Portal Branding */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                Enterprise Partner Portal Co-Branding
              </h3>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Partner Tier / Portal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Custom Portal Subdomain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold font-mono text-stone-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Portal Configuration</span>
            </button>
          </form>
        </div>

        {/* Real-Time Immutable AI Audit Trail */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                Network Audit & Matching Stream
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
              {auditEvents.length} Verified Events
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {auditEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {evt.action}
                  </span>
                  <span className="text-stone-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <p className="text-stone-800 font-medium leading-snug">
                  {evt.details}
                </p>

                <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                  <span>Actor: {evt.actorName}</span>
                  <span>Model: Gemini 3.8 Flash</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
