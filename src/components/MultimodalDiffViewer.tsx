import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Quote, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Clock,
  UserCheck,
  Save,
  X
} from 'lucide-react';
import { SkillItem, SkillSource } from '../types';

export const MultimodalDiffViewer: React.FC<{ onDone?: () => void }> = ({ onDone }) => {
  const { 
    activeCandidate, 
    confirmSkill, 
    editSkill, 
    removeSkill, 
    confirmEmployment,
    confirmEducation,
    confirmFieldOverride,
    t 
  } = useApp();

  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editSkillName, setEditSkillName] = useState<string>('');
  const [editSkillLevel, setEditSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');

  const [editingHeadline, setEditingHeadline] = useState<boolean>(false);
  const [headlineVal, setHeadlineVal] = useState<string>(activeCandidate.professionalHeadline);

  const startEditSkill = (skill: SkillItem) => {
    setEditingSkillId(skill.id);
    setEditSkillName(skill.skillName);
    setEditSkillLevel(skill.levelIfKnown || 'Advanced');
  };

  const saveEditSkill = (skillId: string) => {
    editSkill(activeCandidate.id, skillId, {
      skillName: editSkillName,
      levelIfKnown: editSkillLevel,
    });
    setEditingSkillId(null);
  };

  const saveHeadline = () => {
    confirmFieldOverride(activeCandidate.id, 'professionalHeadline', headlineVal);
    setEditingHeadline(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">{t.reviewConfirm}</h2>
              <p className="text-xs text-stone-500">
                Verify extracted claims and source quotes
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {activeCandidate.skills.filter(s => s.candidateConfirmed).length} of {activeCandidate.skills.length} Verified
            </span>
          </div>

          {onDone && (
            <button
              onClick={onDone}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Done
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Core Headline & Current Position */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Primary Professional Headline
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Canonical Identity
            </span>
          </div>

          {editingHeadline ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={headlineVal}
                onChange={(e) => setHeadlineVal(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-900 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                onClick={saveHeadline}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={() => setEditingHeadline(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {activeCandidate.professionalHeadline}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Current Role: <span className="font-semibold text-stone-700">{activeCandidate.currentPosition}</span> at <span className="font-semibold text-stone-700">{activeCandidate.currentEmployer}</span> • {activeCandidate.totalYearsExperience} Years Total Exp.
                </p>
              </div>

              <button
                onClick={() => {
                  setHeadlineVal(activeCandidate.professionalHeadline);
                  setEditingHeadline(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                <Edit3 className="w-3 h-3" />
                <span>{t.editField}</span>
              </button>
            </div>
          )}
        </div>

        {/* Skills Human Confirmation Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                {t.skillsAndExpertise} ({activeCandidate.skills.length})
              </h3>
              <p className="text-xs text-stone-500">
                Verify explicit statements vs AI inferred capabilities. Candidate edits lock overwrite protection.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeCandidate.skills.map((skill) => {
              const isEditing = editingSkillId === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`p-4 rounded-xl border transition-all ${
                    skill.candidateConfirmed
                      ? 'border-emerald-200 bg-emerald-50/20 shadow-2xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-stone-500 uppercase">Skill Name</label>
                        <input
                          type="text"
                          value={editSkillName}
                          onChange={(e) => setEditSkillName(e.target.value)}
                          className="w-full mt-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-stone-500 uppercase">Proficiency Level</label>
                        <select
                          value={editSkillLevel}
                          onChange={(e) => setEditSkillLevel(e.target.value as any)}
                          className="w-full mt-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingSkillId(null)}
                          className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditSkill(skill.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                        >
                          Save & Confirm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Top Skill Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-stone-900">{skill.skillName}</h4>
                            {skill.levelIfKnown && (
                              <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                {skill.levelIfKnown}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400">{skill.category}</span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-1.5">
                          {/* Explicit vs Inferred */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            skill.source === 'CV_EXPLICIT'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {skill.source === 'CV_EXPLICIT' ? t.explicit : t.inferred}
                          </span>

                          {/* Confidence */}
                          <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                            {skill.aiConfidence}%
                          </span>
                        </div>
                      </div>

                      {/* Verbatim Source Evidence */}
                      {skill.evidence && (
                        <div className="mt-2.5 p-2 bg-stone-50 rounded-lg border border-stone-100 flex items-start gap-1.5">
                          <Quote className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-stone-600 italic line-clamp-2">
                            "{skill.evidence}"
                          </p>
                        </div>
                      )}

                      {/* Confirmation Controls */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          {skill.isCandidateOverridden ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              {t.candidateOverridden}
                            </span>
                          ) : skill.candidateConfirmed ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {t.confirmed}
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 italic">
                              {t.unconfirmed}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!skill.candidateConfirmed && (
                            <button
                              id={`confirm-skill-${skill.id}`}
                              onClick={() => confirmSkill(activeCandidate.id, skill.id)}
                              className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100/70 bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            >
                              {t.confirmField}
                            </button>
                          )}

                          <button
                            onClick={() => startEditSkill(skill)}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
                            title={t.editField}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => removeSkill(activeCandidate.id, skill.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded-md transition-colors"
                            title={t.removeField}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Employment Tenures Human Confirmation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                {t.employmentHistory} ({activeCandidate.employmentHistory.length})
              </h3>
              <p className="text-xs text-stone-500">
                Verified employment tenure and measurable achievement evidence.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {activeCandidate.employmentHistory.map((emp) => (
              <div
                key={emp.id}
                className={`p-4 rounded-xl border transition-all ${
                  emp.candidateConfirmed
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900">{emp.position}</h4>
                      <span className="text-xs text-stone-600 font-semibold">• {emp.employer}</span>
                      {emp.currentRole && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.2 rounded-full border border-blue-200">
                          Current Role
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {emp.startDate} — {emp.endDate} • {emp.location} ({emp.employmentType})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      Confidence: {emp.confidence}%
                    </span>
                    {!emp.candidateConfirmed ? (
                      <button
                        onClick={() => confirmEmployment(activeCandidate.id, emp.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        {t.confirmField}
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                {emp.achievements?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-bold text-stone-500 uppercase">Measurable Achievements:</span>
                    <ul className="list-disc list-inside text-xs text-stone-700 space-y-0.5">
                      {emp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education Confirmation */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-3">
            {t.education} ({activeCandidate.education.length})
          </h3>
          <div className="space-y-2">
            {activeCandidate.education.map((edu) => (
              <div
                key={edu.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {edu.degree} in {edu.major}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {edu.institution} • {edu.startDate} - {edu.completionDate} {edu.gpaIfProvided && `• GPA: ${edu.gpaIfProvided}`}
                  </p>
                </div>

                <div>
                  {!edu.candidateConfirmed ? (
                    <button
                      onClick={() => confirmEducation(activeCandidate.id, edu.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                    >
                      {t.confirmField}
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
