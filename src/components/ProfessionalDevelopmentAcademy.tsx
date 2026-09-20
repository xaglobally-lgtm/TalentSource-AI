import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RECRUITER_READINESS_COURSE } from '../data/courses';
import { CourseModule } from '../types';
import { CertificateModal } from './CertificateModal';
import { 
  BookOpen, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles, 
  Check, 
  AlertCircle,
  Clock,
  GraduationCap
} from 'lucide-react';

export const ProfessionalDevelopmentAcademy: React.FC<{
  onGoToMatches?: () => void;
}> = ({ onGoToMatches }) => {
  const { activeCandidate, completeModule, issueCertificate, t } = useApp();

  const [selectedModuleId, setSelectedModuleId] = useState<string>(RECRUITER_READINESS_COURSE[0].id);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'lessons' | 'quiz'>('lessons');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  const activeModule = RECRUITER_READINESS_COURSE.find(m => m.id === selectedModuleId) || RECRUITER_READINESS_COURSE[0];
  const isModuleCompleted = activeCandidate.courseProgress.completedModuleIds.includes(activeModule.id);
  const activeLesson = activeModule.lessons[activeLessonIndex] || activeModule.lessons[0];

  const handleSelectAnswer = (qId: string, ansIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: ansIdx }));
  };

  const handleQuizSubmit = () => {
    let correctCount = 0;
    activeModule.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeModule.quiz.length) * 100);
    setQuizSubmitted(true);
    completeModule(activeCandidate.id, activeModule.id, score);

    // If final assessment (Module 6) completed with 80%+, issue certificate
    if (activeModule.moduleNumber === 6 && score >= 80) {
      issueCertificate(activeCandidate.id, score);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.32)] ring-2 ring-orange-400/40 overflow-hidden h-full flex flex-col min-h-0 relative">
      {/* Top Academy Banner */}
      <div className="px-3.5 py-2 border-b border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 text-orange-800 rounded-lg">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-stone-900">{t.professionalDevelopment}</h2>
            <p className="text-[10px] text-stone-500">
              Practical modules & readiness assessments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Glowing 'Start This' Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_14px_rgba(249,115,22,0.6)] ring-2 ring-orange-300 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>Start This</span>
          </div>

          {activeCandidate.courseProgress.certificate && (
            <button
              onClick={() => setShowCertModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t.viewCertificate}</span>
            </button>
          )}

          {onGoToMatches && (
            <button
              onClick={onGoToMatches}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>View Matches</span>
            </button>
          )}

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            {activeCandidate.courseProgress.completedModuleIds.length} of {RECRUITER_READINESS_COURSE.length} Done
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Module Sidebar */}
        <div className="lg:col-span-4 border-r border-stone-200 bg-stone-50/30 p-2.5 space-y-1.5 overflow-y-auto min-h-0">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 px-1.5 block mb-0.5">
            Modules
          </span>

          {RECRUITER_READINESS_COURSE.map((mod) => {
            const isCompleted = activeCandidate.courseProgress.completedModuleIds.includes(mod.id);
            const isCurrent = mod.id === selectedModuleId;
            const score = activeCandidate.courseProgress.moduleScores[mod.id];

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setSelectedModuleId(mod.id);
                  setActiveLessonIndex(0);
                  setViewMode('lessons');
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-50/70 border-orange-500 shadow-xs ring-1 ring-orange-400'
                    : 'bg-white/70 border-stone-200 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  isCompleted 
                    ? 'bg-stone-800 text-white' 
                    : isCurrent 
                    ? 'bg-orange-500 text-white font-black' 
                    : 'bg-stone-200 text-stone-600'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3" /> : mod.moduleNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400">
                      Module {mod.moduleNumber}
                    </span>
                    {score !== undefined && (
                      <span className="text-[9.5px] font-bold text-orange-700 font-mono">
                        {score}%
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{mod.title}</h4>
                  <p className="text-[10.5px] text-stone-500 line-clamp-1">{mod.summary}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 p-3 sm:p-4 flex flex-col justify-between space-y-3 overflow-y-auto min-h-0">
          {/* Header of Active Module */}
          <div className="border-b border-stone-100 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Module {activeModule.moduleNumber} of {RECRUITER_READINESS_COURSE.length}
              </span>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setViewMode('lessons')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'lessons' ? 'bg-white text-stone-900 shadow-2xs font-bold ring-1 ring-stone-200' : 'text-stone-600'
                  }`}
                >
                  Lesson Content
                </button>
                <button
                  onClick={() => setViewMode('quiz')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'quiz' ? 'bg-white text-stone-900 shadow-2xs font-bold ring-1 ring-stone-200' : 'text-stone-600'
                  }`}
                >
                  Assessment Quiz ({activeModule.quiz.length} Qs)
                </button>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-2">{activeModule.title}</h3>
            <p className="text-xs text-stone-500 mt-0.5">{activeModule.summary}</p>
          </div>

          {/* Lessons View */}
          {viewMode === 'lessons' ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">{activeLesson.title}</h4>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeLesson.estimatedMinutes} mins
                  </span>
                </div>
              </div>

              {/* Lesson Body */}
              <div className="prose prose-stone text-xs text-stone-700 leading-relaxed max-w-none space-y-2.5 whitespace-pre-line">
                {activeLesson.content}
              </div>

              {/* Key Takeaways Card */}
              {activeLesson.keyTakeaways?.length > 0 && (
                <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-950 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Key Recruiter Takeaways</span>
                  </div>
                  <ul className="space-y-1">
                    {activeLesson.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="text-xs text-stone-800 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation within lessons or to quiz */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  {activeLessonIndex > 0 && (
                    <button
                      onClick={() => setActiveLessonIndex(prev => prev - 1)}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Previous Lesson</span>
                    </button>
                  )}
                </div>

                <div>
                  {activeLessonIndex < activeModule.lessons.length - 1 ? (
                    <button
                      onClick={() => setActiveLessonIndex(prev => prev + 1)}
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-stone-800"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewMode('quiz')}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
                    >
                      <span>{t.takeAssessment}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Quiz View */
            <div className="space-y-4 flex-1">
              <div className="space-y-4">
                {activeModule.quiz.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctAnswerIndex;

                  return (
                    <div key={q.id} className="p-3 sm:p-3.5 rounded-xl border border-stone-200 bg-stone-50/40 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-stone-400 font-mono">Q{qIndex + 1}.</span>
                        <h4 className="text-xs font-bold text-stone-900">{q.prompt}</h4>
                      </div>

                      <div className="space-y-1.5 pl-4">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = userAnswer === optIndex;
                          let optionStyle = "border-stone-200 bg-white hover:bg-stone-50 text-stone-700";

                          if (quizSubmitted) {
                            if (optIndex === q.correctAnswerIndex) {
                              optionStyle = "border-purple-500 bg-purple-50/80 text-purple-950 font-semibold ring-1 ring-purple-400";
                            } else if (isSelected && !isCorrect) {
                              optionStyle = "border-rose-300 bg-rose-50 text-rose-950";
                            }
                          } else if (isSelected) {
                            optionStyle = "border-orange-500 bg-orange-50/80 text-stone-950 ring-1 ring-orange-400 font-semibold";
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, optIndex)}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctAnswerIndex && (
                                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation after submit */}
                      {quizSubmitted && (
                        <div className="mt-2 p-2.5 bg-stone-100 rounded-lg text-xs text-stone-700 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-stone-900 block mb-0.5">Recruiter Feedback:</span>
                            <span>{q.explanation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit & Reset Controls */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  {quizSubmitted && (
                    <button
                      onClick={handleResetQuiz}
                      className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>

                <div>
                  {!quizSubmitted ? (
                    <button
                      id="btn-submit-quiz"
                      disabled={Object.keys(selectedAnswers).length < activeModule.quiz.length}
                      onClick={handleQuizSubmit}
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    >
                      Submit & Score Module
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {activeModule.moduleNumber === 6 && activeCandidate.courseProgress.certificate && (
                        <button
                          onClick={() => setShowCertModal(true)}
                          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Certificate</span>
                        </button>
                      )}

                      {activeModule.moduleNumber < 6 && (
                        <button
                          onClick={() => {
                            const nextMod = RECRUITER_READINESS_COURSE[activeModule.moduleNumber];
                            if (nextMod) {
                              setSelectedModuleId(nextMod.id);
                              setViewMode('lessons');
                              setActiveLessonIndex(0);
                              setSelectedAnswers({});
                              setQuizSubmitted(false);
                            }
                          }}
                          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>Next Module</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && activeCandidate.courseProgress.certificate && (
        <CertificateModal
          certificate={activeCandidate.courseProgress.certificate}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
