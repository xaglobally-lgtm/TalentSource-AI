import React from 'react';
import { useApp } from '../context/AppContext';
import { CourseCertificate } from '../types';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Printer, 
  X, 
  QrCode, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const CertificateModal: React.FC<{ 
  certificate: CourseCertificate; 
  onClose: () => void 
}> = ({ certificate, onClose }) => {
  const { activeTenant } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 my-8">
        {/* Top Control Bar */}
        <div className="bg-stone-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verifiable Credential</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Decorative Border Canvas */}
        <div className="p-8 sm:p-12 text-center relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Watermark Seal */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white shadow-md mb-6">
            <Award className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-emerald-700 font-bold uppercase">
              Verified Candidate Credential
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              Certificate of Achievement
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              This credential certifies full completion of the Recruiter Professional Development & Readiness Assessment.
            </p>
          </div>

          <div className="my-8">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Awarded To</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tracking-tight">
              {certificate.candidateName}
            </h3>
            <div className="w-32 h-0.5 bg-emerald-600 mx-auto mt-2 rounded-full" />
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-md mx-auto grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Score</span>
              <p className="text-base font-black text-emerald-700">{certificate.score}%</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Date</span>
              <p className="text-xs font-semibold text-stone-800">{certificate.completionDate}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Status</span>
              <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </p>
            </div>
          </div>

          {/* Certificate Footer with ID and QR representation */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-left gap-4 text-xs text-stone-500">
            <div>
              <p className="font-mono font-bold text-stone-800 text-xs">
                Certificate ID: {certificate.certificateId}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Verification Code: {certificate.verificationCode} • {certificate.courseVersion}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-1">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Issued by Universal AI Talent Network • Vetted for 1,420+ Hiring Partners</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-100 p-2 rounded-xl border border-stone-200">
              <QrCode className="w-10 h-10 text-stone-800" />
              <div className="text-[10px] leading-tight text-stone-500">
                <span className="font-bold text-stone-800 block">Scan to Verify</span>
                source.ai/verify
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 px-6 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            +30% Readiness Boost Applied
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
