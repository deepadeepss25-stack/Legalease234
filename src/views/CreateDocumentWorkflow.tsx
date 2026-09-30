import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Calendar,
  Building,
  User,
  DollarSign,
  Shield,
  Layers,
} from 'lucide-react';
import { LegalTemplate, QuestionnaireStep } from '../types';
import { generateDocumentWithAi } from '../services/aiService';
import { createDocument, getCurrentUser } from '../services/storage';
import { useToast } from '../components/Toast';

interface CreateDocumentWorkflowProps {
  template: LegalTemplate;
  onCancel: () => void;
  onGenerated: (docId: string) => void;
}

export const CreateDocumentWorkflow: React.FC<CreateDocumentWorkflowProps> = ({
  template,
  onCancel,
  onGenerated,
}) => {
  // Normalize workflow steps: Dynamic questionnaire steps + final "Review & Finalize"
  const questionnaireSteps: QuestionnaireStep[] = template.steps;
  const totalQuestionnaireSteps = questionnaireSteps.length;
  
  // currentStepIndex: 0 .. totalQuestionnaireSteps - 1 (form steps), then totalQuestionnaireSteps (Review screen)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Form values map
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    questionnaireSteps.forEach(step => {
      step.fields.forEach(field => {
        initial[field.id] = field.defaultValue !== undefined ? field.defaultValue : '';
      });
    });
    return initial;
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);

  const { showToast } = useToast();

  const isReviewStep = currentStepIndex === totalQuestionnaireSteps;
  const currentStep = !isReviewStep ? questionnaireSteps[currentStepIndex] : null;

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    if (isReviewStep) return true;
    const errors: Record<string, string> = {};
    const step = questionnaireSteps[currentStepIndex];

    step.fields.forEach(f => {
      if (f.required && (!formData[f.id] || String(formData[f.id]).trim() === '')) {
        errors[f.id] = `${f.label} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }
    if (currentStepIndex < totalQuestionnaireSteps) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const generationStages = [
    'Reviewing your information',
    'Structuring document sections',
    'Generating legal clauses with AI',
    'Formatting document & seal',
    'Finalizing document',
  ];

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationPhase(0);

    // Stagger visual stages
    const timer1 = setTimeout(() => setGenerationPhase(1), 500);
    const timer2 = setTimeout(() => setGenerationPhase(2), 1200);
    const timer3 = setTimeout(() => setGenerationPhase(3), 2000);
    const timer4 = setTimeout(() => setGenerationPhase(4), 2700);

    try {
      const user = getCurrentUser();

      // Trigger AI Generation
      const result = await generateDocumentWithAi({
        templateId: template.id,
        templateTitle: template.title,
        category: template.category,
        formData,
      });

      // Save to persistent storage
      const newDoc = createDocument({
        userId: user.id,
        templateId: template.id,
        templateCategory: template.category,
        title: `${template.title} — ${formData.employeeName || formData.partyBName || formData.tenantName || formData.candidateName || formData.clientName || 'Untitled'}`,
        status: 'Ready',
        content: result.document,
        keyTerms: result.keyTerms,
        branding: {
          companyName: formData.employerName || formData.partyAName || formData.companyName || user.company || 'LegalEase Standard',
          primaryColor: '#2563EB',
          fontFamily: 'Inter',
          showHeader: true,
          showFooter: true,
          showPageNumbers: true,
        },
        isFavorite: false,
        formData,
      });

      setTimeout(() => {
        showToast('Document generated successfully!', 'success');
        onGenerated(newDoc.id);
      }, 3200);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsGenerating(false);
      showToast(`Generation failed: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  // Generation Modal Screen
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl space-y-6">
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Creating your document...</h2>
            <p className="text-xs text-slate-400 mt-1">{template.title}</p>
          </div>

          {/* Stepper progress list */}
          <div className="space-y-3 text-left font-mono text-xs pt-2">
            {generationStages.map((stage, idx) => {
              const isDone = generationPhase > idx;
              const isCurrent = generationPhase === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isDone
                      ? 'text-emerald-400'
                      : isCurrent
                      ? 'text-blue-300 font-semibold'
                      : 'text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{stage}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Applying legal standard covenants and jurisdiction rules
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'Change Template' : 'Previous Step'}</span>
          </button>

          <div className="text-center">
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
              {template.category}
            </span>
            <h2 className="text-sm font-bold text-slate-900">{template.title}</h2>
          </div>

          <div className="text-xs font-medium text-slate-400">
            Step {currentStepIndex + 1} of {totalQuestionnaireSteps + 1}
          </div>
        </div>

        {/* Top Progress Indicator */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 overflow-x-auto">
            {questionnaireSteps.map((step, idx) => (
              <span
                key={step.id}
                className={`transition-colors whitespace-nowrap px-1 ${
                  idx === currentStepIndex
                    ? 'text-blue-600 font-bold'
                    : idx < currentStepIndex
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {idx + 1}. {step.title}
              </span>
            ))}
            <span
              className={`transition-colors whitespace-nowrap px-1 ${
                isReviewStep ? 'text-blue-600 font-bold' : 'text-slate-400'
              }`}
            >
              {totalQuestionnaireSteps + 1}. Review & Finalize
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / (totalQuestionnaireSteps + 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        {!isReviewStep && currentStep ? (
          /* Guided Questionnaire Form */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-bold font-mono text-blue-600 uppercase tracking-widest block mb-1">
                Section {currentStepIndex + 1}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{currentStep.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{currentStep.description}</p>
            </div>

            <div className="space-y-6">
              {currentStep.fields.map(field => {
                const error = formErrors[field.id];
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {/* Text / Date / Number Input */}
                    {field.type === 'text' || field.type === 'date' || field.type === 'number' ? (
                      <input
                        type={field.type}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 ${
                          error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      />
                    ) : field.type === 'textarea' ? (
                      /* Textarea */
                      <textarea
                        rows={4}
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 ${
                          error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      />
                    ) : field.type === 'select' ? (
                      /* Select Dropdown */
                      <select
                        value={formData[field.id] || ''}
                        onChange={e => handleInputChange(field.id, e.target.value)}
                        className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 ${
                          error ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      >
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : null}

                    {error && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* REVIEW SCREEN */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-bold font-mono text-emerald-600 uppercase tracking-widest block mb-1">
                Final Step
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Review your information</h3>
              <p className="text-sm text-slate-500 mt-1">
                Check all parameters before generating your customized legal document with AI.
              </p>
            </div>

            {/* Information Summary Cards */}
            <div className="space-y-4">
              {questionnaireSteps.map((step, idx) => (
                <div key={step.id} className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
                    <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                    <button
                      type="button"
                      onClick={() => setCurrentStepIndex(idx)}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {step.fields.map(field => (
                      <div key={field.id} className="space-y-0.5">
                        <span className="text-slate-400 font-medium">{field.label}:</span>
                        <p className="font-semibold text-slate-800 break-words">
                          {formData[field.id] ? String(formData[field.id]) : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Guarantee Badge */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong className="font-semibold">AI Enforceability Check:</strong> LegalEase will structure sections, insert formal clauses, calibrate governing jurisdiction, and extract key terms. You will be able to edit and rewrite every clause in the editor.
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Back to Edit
              </button>

              <button
                type="button"
                onClick={handleStartGeneration}
                className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Generate Document</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
