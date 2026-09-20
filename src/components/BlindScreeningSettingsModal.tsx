import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  EyeOff, 
  X, 
  UserX, 
  Calendar, 
  MapPin, 
  School, 
  Mail, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface BlindScreeningSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlindScreeningSettingsModal: React.FC<BlindScreeningSettingsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { blindSettings, updateBlindSettings, setBlindScreeningMode } = useApp();

  if (!isOpen) return null;

  const filters = [
    {
      key: 'maskNames' as const,
      label: 'Candidate Names & Identifiers',
      desc: 'Replaces candidate names with anonymous alphanumeric codes (e.g. #CAN-9482)',
      icon: UserX,
      enabled: blindSettings.maskNames,
    },
    {
      key: 'maskGender' as const,
      label: 'Gender & Pronouns',
      desc: 'Suppresses gender indicators, titles, and gender-specific organizational references',
      icon: Users,
      enabled: blindSettings.maskGender,
    },
    {
      key: 'maskAge' as const,
      label: 'Age & Graduation Years',
      desc: 'Hides graduation completion dates, birth years, and age-correlated tenure dates',
      icon: Calendar,
      enabled: blindSettings.maskAge,
    },
    {
      key: 'maskLocation' as const,
      label: 'Geographic Location & Addresses',
      desc: 'Masks residential addresses, postal codes, and city names during early screening',
      icon: MapPin,
      enabled: blindSettings.maskLocation,
    },
    {
      key: 'maskInstitutions' as const,
      label: 'University & College Names',
      desc: 'Redacts institution prestige markers (e.g. "Accredited University [Tier 1]")',
      icon: School,
      enabled: blindSettings.maskInstitutions,
    },
    {
      key: 'maskContactInfo' as const,
      label: 'Email & Phone Numbers',
      desc: 'Routes contact info through anonymous agency relays until formal interview invite',
      icon: Mail,
      enabled: blindSettings.maskContactInfo,
    },
  ];

  const handleToggle = (key: keyof typeof blindSettings) => {
    updateBlindSettings({ [key]: !blindSettings[key] });
  };

  const handleEnableAll = () => {
    updateBlindSettings({
      enabled: true,
      maskNames: true,
      maskGender: true,
      maskAge: true,
      maskLocation: true,
      maskInstitutions: true,
      maskContactInfo: true,
    });
    setBlindScreeningMode(true);
  };

  const activeFiltersCount = Object.entries(blindSettings).filter(
    ([k, v]) => k !== 'enabled' && v === true
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-200">
              <EyeOff className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">Blind Screening Filter Settings</h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {activeFiltersCount} of 6 Active
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize which candidate attributes are masked during early-stage review to eliminate unconscious bias.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Switch Bar */}
        <div className="px-6 py-3.5 bg-amber-50/60 border-b border-amber-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950">
              Master Blind Mode Status:
            </span>
            <span className={`text-xs font-black ${blindSettings.enabled ? 'text-emerald-700' : 'text-stone-500'}`}>
              {blindSettings.enabled ? 'ENABLED' : 'PAUSED'}
            </span>
          </div>

          <button
            onClick={() => {
              const nextState = !blindSettings.enabled;
              updateBlindSettings({ enabled: nextState });
              setBlindScreeningMode(nextState);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              blindSettings.enabled
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
            }`}
          >
            {blindSettings.enabled ? 'Disable Blind Mode' : 'Enable Blind Mode'}
          </button>
        </div>

        {/* Filter Dimensions List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.key}
                onClick={() => handleToggle(f.key)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  f.enabled
                    ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/40'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    f.enabled ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{f.label}</h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <div className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 mt-1 ${
                  f.enabled ? 'bg-amber-600' : 'bg-stone-200'
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    f.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={handleEnableAll}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
          >
            Enable All Bias Filters
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
