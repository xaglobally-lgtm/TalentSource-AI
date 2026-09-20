import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Cpu, 
  Languages, 
  Sliders, 
  CheckCircle2, 
  Save, 
  Plus, 
  Trash2,
  Lock,
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Download
} from 'lucide-react';
import { EmploymentRecord, EducationRecord, SkillItem } from '../types';
import { exportCandidateDossier } from '../utils/exportUtils';

export const CandidateProfileEditor: React.FC<{ 
  onGoToAcademy?: () => void;
  onGoToCV?: () => void;
}> = ({ onGoToAcademy, onGoToCV }) => {
  const { activeCandidate, updateCandidate, blindScreeningMode, t } = useApp();
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'preferences'>('personal');

  const [formData, setFormData] = useState(activeCandidate);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const pendingSkillsCount = formData.skills.filter(s => !s.candidateConfirmed).length;

  const handleVerifyAll = () => {
    const verifiedSkills = formData.skills.map(s => ({ ...s, candidateConfirmed: true }));
    const updated = { ...formData, skills: verifiedSkills };
    setFormData(updated);
    updateCandidate(updated);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // Modal states for adding items
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [newExp, setNewExp] = useState({
    position: '',
    employer: '',
    startDate: '',
    endDate: 'Present',
    currentRole: true,
    location: 'Remote',
    industry: 'Technology',
    responsibilitiesText: ''
  });

  const [showAddEducation, setShowAddEducation] = useState(false);
  const [newEdu, setNewEdu] = useState({
    institution: '',
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    startDate: '',
    completionDate: ''
  });

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming Languages');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');

  // Sync if active candidate changes
  React.useEffect(() => {
    setFormData(activeCandidate);
  }, [activeCandidate]);

  const handleSave = () => {
    updateCandidate(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleAddExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.position.trim() || !newExp.employer.trim()) return;

    const record: EmploymentRecord = {
      id: `emp-manual-${Date.now()}`,
      position: newExp.position.trim(),
      employer: newExp.employer.trim(),
      startDate: newExp.startDate.trim() || '2022',
      endDate: newExp.currentRole ? 'Present' : newExp.endDate.trim() || '2024',
      currentRole: newExp.currentRole,
      location: newExp.location.trim() || 'Remote',
      employmentType: 'Full-time',
      responsibilities: newExp.responsibilitiesText ? newExp.responsibilitiesText.split('\n').filter(r => r.trim()) : [],
      achievements: [],
      skillsUsed: [],
      industry: newExp.industry.trim() || 'Technology',
      confidence: 100,
      candidateConfirmed: true,
      isCandidateOverridden: true
    };

    const updated = [record, ...formData.employmentHistory];
    setFormData({ ...formData, employmentHistory: updated });
    updateCandidate({ ...formData, employmentHistory: updated });
    setShowAddExperience(false);
    setNewExp({
      position: '',
      employer: '',
      startDate: '',
      endDate: 'Present',
      currentRole: true,
      location: 'Remote',
      industry: 'Technology',
      responsibilitiesText: ''
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = formData.employmentHistory.filter(e => e.id !== id);
    setFormData({ ...formData, employmentHistory: updated });
    updateCandidate({ ...formData, employmentHistory: updated });
  };

  const handleAddEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.institution.trim() || !newEdu.degree.trim()) return;

    const record: EducationRecord = {
      id: `edu-manual-${Date.now()}`,
      institution: newEdu.institution.trim(),
      qualification: newEdu.degree.trim(),
      degree: newEdu.degree.trim(),
      major: newEdu.major.trim(),
      startDate: newEdu.startDate.trim() || '2016',
      completionDate: newEdu.completionDate.trim() || '2020',
      relevantCoursework: [],
      confidence: 100,
      candidateConfirmed: true
    };

    const updated = [record, ...formData.education];
    setFormData({ ...formData, education: updated });
    updateCandidate({ ...formData, education: updated });
    setShowAddEducation(false);
    setNewEdu({
      institution: '',
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      startDate: '',
      completionDate: ''
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleDeleteEducation = (id: string) => {
    const updated = formData.education.filter(e => e.id !== id);
    setFormData({ ...formData, education: updated });
    updateCandidate({ ...formData, education: updated });
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const skill: SkillItem = {
      id: `sk-manual-${Date.now()}`,
      skillName: newSkillName.trim(),
      category: newSkillCategory,
      levelIfKnown: newSkillLevel,
      source: 'CANDIDATE_ADDED',
      evidence: 'Directly verified and submitted by candidate.',
      aiConfidence: 100,
      candidateConfirmed: true,
      isCandidateOverridden: true
    };

    const updated = [skill, ...formData.skills];
    setFormData({ ...formData, skills: updated });
    updateCandidate({ ...formData, skills: updated });
    setShowAddSkill(false);
    setNewSkillName('');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleDeleteSkill = (id: string) => {
    const updated = formData.skills.filter(s => s.id !== id);
    setFormData({ ...formData, skills: updated });
    updateCandidate({ ...formData, skills: updated });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden h-full flex flex-col min-h-0">
      {/* Top Profile Summary & Verification Mandate Header */}
      <div className="px-4 py-2 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-stone-900">
              {blindScreeningMode ? `Candidate #${activeCandidate.candidateCode}` : `${activeCandidate.firstName} ${activeCandidate.lastName}`}
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
              {activeCandidate.seniorityLevel}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-500">
            {activeCandidate.professionalHeadline} • {activeCandidate.totalYearsExperience} yrs experience
          </p>
        </div>

        {/* Verification Status Banner */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => exportCandidateDossier(formData)}
            title="Download verified talent dossier as JSON"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export Dossier</span>
          </button>

          {pendingSkillsCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                {pendingSkillsCount} unconfirmed
              </span>
              <button
                type="button"
                id="btn-verify-all-claims-top"
                onClick={handleVerifyAll}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Verify All</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>All Items Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-stone-200 bg-white px-3 py-1.5 flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {[
            { id: 'personal', label: 'Personal', icon: User },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'skills', label: 'Skills', icon: Cpu },
            { id: 'preferences', label: 'Preferences', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs font-bold ring-1 ring-orange-400'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          id="btn-save-profile-changes"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{t.saveChanges}</span>
        </button>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto min-h-0">
        {/* Toast Notification */}
        {showSavedToast && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Candidate profile changes updated and human-verified!</span>
            </div>
            <button onClick={() => setShowSavedToast(false)} className="text-emerald-700 hover:text-emerald-950 font-bold">×</button>
          </div>
        )}

        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  First Name {blindScreeningMode && <span className="text-amber-600 font-normal">(Masked in Blind Mode)</span>}
                </label>
                <input
                  type="text"
                  value={blindScreeningMode ? '••••••••' : formData.firstName}
                  disabled={blindScreeningMode}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Last Name {blindScreeningMode && <span className="text-amber-600 font-normal">(Masked in Blind Mode)</span>}
                </label>
                <input
                  type="text"
                  value={blindScreeningMode ? '••••••••' : formData.lastName}
                  disabled={blindScreeningMode}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Candidate Identifier Code</label>
                <input
                  type="text"
                  disabled
                  value={formData.candidateCode}
                  className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-xs font-mono font-bold text-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={blindScreeningMode ? 'candidate-private@recruitment.anonymous' : formData.email}
                  disabled={blindScreeningMode}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500 disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.professionalHeadline}
                  onChange={(e) => setFormData({ ...formData, professionalHeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  value={blindScreeningMode ? 'Redacted Location (Blind Mode)' : formData.currentLocation}
                  disabled={blindScreeningMode}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Remote Preference</label>
                <select
                  value={formData.remotePreference}
                  onChange={(e) => setFormData({ ...formData, remotePreference: e.target.value as any })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="remote">Fully Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-Site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Verified Career Chronology ({formData.employmentHistory.length} Positions)
              </span>
              <button
                type="button"
                onClick={() => setShowAddExperience(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            {formData.employmentHistory.map((emp, idx) => (
              <div key={emp.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3 relative group">
                <button
                  type="button"
                  title="Remove Position"
                  onClick={() => handleDeleteExperience(emp.id)}
                  className="absolute top-3 right-3 text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase">Position Title</label>
                    <input
                      type="text"
                      value={emp.position}
                      onChange={(e) => {
                        const updated = [...formData.employmentHistory];
                        updated[idx].position = e.target.value;
                        setFormData({ ...formData, employmentHistory: updated });
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase">Employer Name</label>
                    <input
                      type="text"
                      value={emp.employer}
                      onChange={(e) => {
                        const updated = [...formData.employmentHistory];
                        updated[idx].employer = e.target.value;
                        setFormData({ ...formData, employmentHistory: updated });
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase">Tenure</label>
                    <div className="flex items-center gap-1 mt-1">
                      <input
                        type="text"
                        value={emp.startDate}
                        placeholder="Start"
                        onChange={(e) => {
                          const updated = [...formData.employmentHistory];
                          updated[idx].startDate = e.target.value;
                          setFormData({ ...formData, employmentHistory: updated });
                        }}
                        className="w-1/2 px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                      <span className="text-stone-400">-</span>
                      <input
                        type="text"
                        value={emp.endDate}
                        placeholder="End"
                        onChange={(e) => {
                          const updated = [...formData.employmentHistory];
                          updated[idx].endDate = e.target.value;
                          setFormData({ ...formData, employmentHistory: updated });
                        }}
                        className="w-1/2 px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {emp.sourceText && (
                  <div className="text-[11px] text-stone-500 italic bg-white/70 p-2 rounded border border-stone-200">
                    Source quote: "{emp.sourceText}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Degrees & Qualifications ({formData.education.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddEducation(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {formData.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 relative group">
                <button
                  type="button"
                  title="Remove Education"
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="absolute top-3 right-3 text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase">Degree & Qualification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].degree = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-500 uppercase">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...formData.education];
                        updated[idx].institution = e.target.value;
                        setFormData({ ...formData, education: updated });
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Skills & Tech Stack ({formData.skills.length}) • Click to toggle human verified status
              </span>
              <button
                type="button"
                onClick={() => setShowAddSkill(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                    skill.candidateConfirmed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-stone-50 border-stone-200 text-stone-800'
                  }`}
                >
                  <button
                    type="button"
                    title="Toggle verified"
                    onClick={() => {
                      const updated = formData.skills.map(s => s.id === skill.id ? { ...s, candidateConfirmed: !s.candidateConfirmed } : s);
                      setFormData({ ...formData, skills: updated });
                      updateCandidate({ ...formData, skills: updated });
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-xs font-bold">{skill.skillName}</span>
                    <span className="text-[10px] text-stone-500 font-mono">({skill.levelIfKnown || 'Advanced'})</span>
                    {skill.candidateConfirmed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">Unverified</span>
                    )}
                  </button>

                  <button
                    type="button"
                    title="Remove Skill"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-stone-400 hover:text-rose-600 text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Minimum Annual Salary</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">{formData.jobPreferences.salaryCurrency}</span>
                <input
                  type="number"
                  value={formData.jobPreferences.minimumSalary}
                  onChange={(e) => setFormData({
                    ...formData,
                    jobPreferences: { ...formData.jobPreferences, minimumSalary: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Annual Salary</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">{formData.jobPreferences.salaryCurrency}</span>
                <input
                  type="number"
                  value={formData.jobPreferences.preferredSalary}
                  onChange={(e) => setFormData({
                    ...formData,
                    jobPreferences: { ...formData.jobPreferences, preferredSalary: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Availability Date</label>
              <input
                type="text"
                value={formData.jobPreferences.availabilityDate}
                onChange={(e) => setFormData({
                  ...formData,
                  jobPreferences: { ...formData.jobPreferences, availabilityDate: e.target.value }
                })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Relocation Preference</label>
              <select
                value={formData.jobPreferences.relocation ? 'yes' : 'no'}
                onChange={(e) => setFormData({
                  ...formData,
                  jobPreferences: { ...formData.jobPreferences, relocation: e.target.value === 'yes' }
                })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
              >
                <option value="yes">Open to Relocation</option>
                <option value="no">Not Open to Relocation</option>
              </select>
            </div>
          </div>
        )}

        {/* Pathway Navigation Footer */}
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-stone-100 flex-wrap gap-2">
          {onGoToCV ? (
            <button
              type="button"
              onClick={onGoToCV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Resume</span>
            </button>
          ) : <div />}

          {onGoToAcademy && (
            <button
              type="button"
              id="btn-profile-continue-to-academy-footer"
              onClick={onGoToAcademy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.4)] ring-2 ring-orange-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer ml-auto"
            >
              <span>Continue to Academy</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Modal: Add Experience */}
      {showAddExperience && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Add Career Experience
              </h3>
              <button
                type="button"
                onClick={() => setShowAddExperience(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExperienceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Position / Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newExp.position}
                  onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Company / Employer *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={newExp.employer}
                  onChange={(e) => setNewExp({ ...newExp, employer: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. March 2021"
                    value={newExp.startDate}
                    onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={newExp.currentRole}
                    placeholder="e.g. Present"
                    value={newExp.currentRole ? 'Present' : newExp.endDate}
                    onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-current-role"
                  checked={newExp.currentRole}
                  onChange={(e) => setNewExp({ ...newExp, currentRole: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="chk-current-role" className="text-xs font-medium text-stone-700 cursor-pointer">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Location & Industry</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Seattle, WA (Remote)"
                    value={newExp.location}
                    onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Cloud SaaS"
                    value={newExp.industry}
                    onChange={(e) => setNewExp({ ...newExp, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Key Responsibilities / Achievements (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="Architected core microservices handling 45M messages&#10;Decreased P99 response time by 38%"
                  value={newExp.responsibilitiesText}
                  onChange={(e) => setNewExp({ ...newExp, responsibilitiesText: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddExperience(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Education */}
      {showAddEducation && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Add Education Record
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEducation(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEducationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Institution / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  value={newEdu.institution}
                  onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Degree / Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.S. in Computer Science"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Major / Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Software Systems"
                  value={newEdu.major}
                  onChange={(e) => setNewEdu({ ...newEdu, major: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Start Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2016"
                    value={newEdu.startDate}
                    onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2020"
                    value={newEdu.completionDate}
                    onChange={(e) => setNewEdu({ ...newEdu, completionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddEducation(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Skill */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                Add Technical Skill
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSkill(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GraphQL, Terraform, Rust"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                >
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Databases & Storage">Databases & Storage</option>
                  <option value="Frameworks & Libraries">Frameworks & Libraries</option>
                  <option value="Architecture & Systems">Architecture & Systems</option>
                  <option value="Domain Expertise">Domain Expertise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddSkill(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Add Verified Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
