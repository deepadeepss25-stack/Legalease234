import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { LegalDocument } from '../types';
import { exportToPdf, exportToDocx, exportToTxt } from '../utils/exportUtils';
import { useToast } from './Toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LegalDocument;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, document }) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(10);
    setCurrentStep('Preparing document data...');

    try {
      if (selectedFormat === 'pdf') {
        await exportToPdf(document, (step, pct) => {
          setCurrentStep(step);
          setProgress(pct);
        });
      } else if (selectedFormat === 'docx') {
        await exportToDocx(document, (step, pct) => {
          setCurrentStep(step);
          setProgress(pct);
        });
      } else {
        await exportToTxt(document, (step, pct) => {
          setCurrentStep(step);
          setProgress(pct);
        });
      }

      showToast(`Exported ${document.title} as ${selectedFormat.toUpperCase()}!`, 'success');
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Export error:', err);
      showToast(`Export failed: ${err?.message || 'Unknown error'}`, 'error');
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Export Legal Document</h3>
              <p className="text-xs text-slate-500">Download formatted contract for signature or distribution</p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Document</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{document.title}</p>
            </div>
          </div>

          {!isExporting ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Select Output Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* PDF */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('pdf')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    selectedFormat === 'pdf'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs mb-2">
                    PDF
                  </div>
                  <span className="text-sm font-semibold text-slate-900">PDF Document</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Formal, printable & sealed</span>
                </button>

                {/* DOCX */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('docx')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    selectedFormat === 'docx'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mb-2">
                    DOCX
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Microsoft Word</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Editable in Office & Docs</span>
                </button>

                {/* TXT */}
                <button
                  type="button"
                  onClick={() => setSelectedFormat('txt')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    selectedFormat === 'txt'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs mb-2">
                    TXT
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Plain Text</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">Raw legal plaintext</span>
                </button>
              </div>

              {/* Branding Info */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Branding: {document.branding.companyName || 'Standard'} ({document.branding.fontFamily})
                </span>
                <span>{document.content.sections.length} Sections / Clauses included</span>
              </div>
            </div>
          ) : (
            /* Progress State */
            <div className="py-6 px-4 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1" />
              </div>
              <div className="text-center w-full">
                <p className="text-sm font-medium text-slate-800">{currentStep || 'Generating output file...'}</p>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">{progress}% Completed</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
