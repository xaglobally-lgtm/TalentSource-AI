import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Building2,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  GitMerge,
  Users
} from 'lucide-react';
import { JobRequisition } from '../types';

export const JobRequisitionManager: React.FC<{
  onGoToMatching?: () => void;
  onGoToPipeline?: () => void;
}> = ({ onGoToMatching, onGoToPipeline }) => {
  const { jobs, activeJobId, setActiveJobId, createJob, activeTenant, t } = useApp();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [department, setDepartment] = useState<string>('Engineering');
  const [location, setLocation] = useState<string>('Remote');
  const [workArrangement, setWorkArrangement] = useState<'remote' | 'hybrid' | 'onsite'>('remote');
  const [salaryMin, setSalaryMin] = useState<number>(140000);
  const [salaryMax, setSalaryMax] = useState<number>(185000);
  const [description, setDescription] = useState<string>('');
  const [isAiStructuring, setIsAiStructuring] = useState<boolean>(false);

  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [industry, setIndustry] = useState<string>('Technology & Cloud');

  const [mustHave, setMustHave] = useState<string[]>([
    'Python microservices & asyncio',
    'AWS cloud infrastructure (EKS, RDS)',
    'Distributed systems design & high-volume data'
  ]);
  const [niceToHave, setNiceToHave] = useState<string[]>([
    'FastAPI production experience',
    'PostgreSQL performance optimization'
  ]);
  const [exclude, setExclude] = useState<string[]>([
    'Entry-level / junior candidates'
  ]);
  const [minYears, setMinYears] = useState<number>(5);
  const [targetSeniority, setTargetSeniority] = useState<string>('Senior');

  const [newMustInput, setNewMustInput] = useState<string>('');
  const [newNiceInput, setNewNiceInput] = useState<string>('');
  const [newExcludeInput, setNewExcludeInput] = useState<string>('');

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  const handleAiStructure = async () => {
    if (!description.trim() && !title.trim()) return;

    setIsAiStructuring(true);
    try {
      const response = await fetch('/api/job/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || `Role: ${title} in ${department}. Requires hands-on technical skills and proven production experience.`,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        if (d.mustHave?.length) setMustHave(d.mustHave);
        if (d.niceToHave?.length) setNiceToHave(d.niceToHave);
        if (d.exclude?.length) setExclude(d.exclude);
        if (d.minimumYearsExperience) setMinYears(d.minimumYearsExperience);
        if (d.targetSeniority) setTargetSeniority(d.targetSeniority);
      }
    } catch (err) {
      console.error('Failed to AI structure job:', err);
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleSaveJob = () => {
    if (!title.trim()) return;

    createJob({
      title,
      department,
      location,
      workArrangement,
      salaryMin,
      salaryMax,
      currency: 'USD',
      description,
      structuredRequirements: {
        mustHave,
        niceToHave,
        exclude,
        minimumYearsExperience: minYears,
        targetSeniority,
        preferredIndustries: ['Technology', 'Cloud Computing']
      }
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="h-full min-h-0 flex flex-col space-y-3">
      {/* Top Requisition Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">{t.jobRequisitions}</h2>
              <p className="text-[11px] text-stone-500">
                Define role requirements and candidate screening criteria
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-create-job-modal"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.createJob}</span>
        </button>
      </div>

      {/* Jobs Grid & Active Requisition View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
        {/* Job List Cards */}
        <div className="lg:col-span-4 h-full overflow-y-auto space-y-2.5 pr-1">
          {/* Industry Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 text-[11px] scrollbar-none">
            {['All Sectors', 'Tech', 'Healthcare', 'Executive', 'Finance', 'RevOps'].map((sec) => {
              const isSelected = selectedSector === sec || (sec === 'Tech' && selectedSector === 'Technology & Cloud');
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec === 'Tech' ? 'Technology & Cloud' : sec)}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 text-white shadow-2xs' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {sec}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            <span>Universal Network Requisitions</span>
            <span>{jobs.length} Active</span>
          </div>

          {jobs
            .filter((job) => {
              if (selectedSector === 'All Sectors') return true;
              const term = selectedSector.toLowerCase();
              return (
                job.industry?.toLowerCase().includes(term) ||
                job.department.toLowerCase().includes(term) ||
                job.title.toLowerCase().includes(term) ||
                job.structuredRequirements?.preferredIndustries?.some(pi => pi.toLowerCase().includes(term))
              );
            })
            .map((job) => {
            const isSelected = job.id === activeJobId;
            return (
              <div
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{job.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {job.industry && (
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {job.industry}
                    </span>
                  )}
                  <span className="text-[11px] text-stone-500">
                    {job.department} • {job.location} ({job.workArrangement})
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                  <span className="font-semibold text-emerald-800">
                    ${(job.salaryMin / 1000)}k - ${(job.salaryMax / 1000)}k {job.currency}
                  </span>
                  <span className="text-stone-400">
                    {job.structuredRequirements?.minimumYearsExperience || 4}+ Yrs Exp
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Job Requirements Inspector */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-5 h-full overflow-y-auto min-h-0">
          {activeJob ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">{activeJob.title}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      {activeJob.structuredRequirements.targetSeniority}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Department: {activeJob.department} • Compensation: ${activeJob.salaryMin.toLocaleString()} - ${activeJob.salaryMax.toLocaleString()} {activeJob.currency}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Arrangement
                  </span>
                  <span className="text-xs font-semibold text-stone-700 capitalize">
                    {activeJob.workArrangement} ({activeJob.location})
                  </span>
                </div>
              </div>

              {/* 3 Requirement Buckets: Must-Have / Nice-To-Have / Exclude */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Must-Have */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.mustHave}</span>
                  </div>
                  <ul className="space-y-2">
                    {activeJob.structuredRequirements.mustHave.map((item, i) => (
                      <li key={i} className="text-xs text-stone-800 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nice-To-Have */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>{t.niceToHave}</span>
                  </div>
                  <ul className="space-y-2">
                    {activeJob.structuredRequirements.niceToHave.map((item, i) => (
                      <li key={i} className="text-xs text-stone-800 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclude */}
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider mb-3">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{t.exclude}</span>
                  </div>
                  <ul className="space-y-2">
                    {activeJob.structuredRequirements.exclude.map((item, i) => (
                      <li key={i} className="text-xs text-rose-900 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Description Preview */}
              {activeJob.description && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                    Job Description Summary
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {activeJob.description}
                  </p>
                </div>
              )}

              {/* Pathway Actions */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-stone-500">
                  Requisition Status: <strong className="text-stone-800 uppercase">{activeJob.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {onGoToPipeline && (
                    <button
                      type="button"
                      onClick={onGoToPipeline}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pipeline</span>
                    </button>
                  )}

                  {onGoToMatching && (
                    <button
                      type="button"
                      onClick={onGoToMatching}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      <GitMerge className="w-3.5 h-3.5 text-blue-400" />
                      <span>Match Candidates</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-stone-500">Select a job requisition to view details.</p>
          )}
        </div>
      </div>

      {/* Create Job Requisition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">{t.createJob}</h3>
                <p className="text-xs text-stone-500">
                  Convert unstructured job specs into verified deterministic requirement arrays
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    placeholder="e.g. Lead Distributed Backend Engineer"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Location / Timezone</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Work Arrangement</label>
                  <select
                    value={workArrangement}
                    onChange={(e) => setWorkArrangement(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="remote">Fully Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Min Salary ($ USD)</label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Max Salary ($ USD)</label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Raw Job Description input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Raw Job Description or Notes</label>
                  <button
                    type="button"
                    disabled={isAiStructuring || (!description && !title)}
                    onClick={handleAiStructure}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isAiStructuring ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Structuring with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>AI Structure Requirements</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste raw requisition or job description text here, then click 'AI Structure Requirements' to automatically organize Must-Have, Nice-To-Have, and Exclude criteria."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>

              {/* Structured Requirements arrays */}
              <div className="space-y-3 pt-2">
                {/* Must Have */}
                <div>
                  <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">
                    Must-Have Criteria
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newMustInput}
                      placeholder="Add must-have criteria..."
                      onChange={(e) => setNewMustInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newMustInput.trim()) {
                          setMustHave([...mustHave, newMustInput.trim()]);
                          setNewMustInput('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMustInput.trim()) {
                          setMustHave([...mustHave, newMustInput.trim()]);
                          setNewMustInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mustHave.map((item, idx) => (
                      <span key={idx} className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => setMustHave(mustHave.filter((_, i) => i !== idx))}
                          className="text-emerald-500 hover:text-emerald-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exclude */}
                <div>
                  <label className="block text-xs font-bold text-rose-800 uppercase mb-1">
                    Exclude Criteria (Negative Match Filters)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newExcludeInput}
                      placeholder="Add exclude condition (e.g. Interns, Junior)..."
                      onChange={(e) => setNewExcludeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newExcludeInput.trim()) {
                          setExclude([...exclude, newExcludeInput.trim()]);
                          setNewExcludeInput('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newExcludeInput.trim()) {
                          setExclude([...exclude, newExcludeInput.trim()]);
                          setNewExcludeInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {exclude.map((item, idx) => (
                      <span key={idx} className="text-xs bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => setExclude(exclude.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveJob}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Publish Structured Requisition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
