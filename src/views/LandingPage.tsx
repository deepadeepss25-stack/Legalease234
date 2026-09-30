import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Edit3,
  Sliders,
  Download,
  History,
  Lock,
  ChevronDown,
  Building,
  Briefcase,
  Home,
  FileCode,
  Zap,
} from 'lucide-react';
import { INITIAL_TEMPLATES } from '../data/templates';
import { TemplateCategory } from '../types';

interface LandingPageProps {
  onNavigate: (view: string, templateId?: string) => void;
  isLoggedIn?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isLoggedIn }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories: (TemplateCategory | 'All')[] = ['All', 'Employment', 'Business', 'Real Estate', 'Freelance'];

  const filteredTemplates = selectedCategory === 'All'
    ? INITIAL_TEMPLATES
    : INITIAL_TEMPLATES.filter(t => t.category === selectedCategory);

  const faqs = [
    {
      q: 'What is LegalEase?',
      a: 'LegalEase is an AI-assisted platform designed for entrepreneurs, founders, landlords, professionals, and freelancers to draft, edit, and export tailored, professional legal documents without starting from scratch.',
    },
    {
      q: 'Can I edit generated documents?',
      a: 'Yes, completely. Every clause, heading, party detail, and sentence is fully editable in our interactive document editor with formatting tools, section reordering, and autosave.',
    },
    {
      q: 'Can I export my documents?',
      a: 'Yes. LegalEase supports instant export to PDF, DOCX (Microsoft Word), and TXT formats with custom company branding, headers, footers, and page numbers.',
    },
    {
      q: 'Is LegalEase a law firm?',
      a: 'No. LegalEase is a document-generation technology tool and does not provide legal representation or replace formal advice from a qualified attorney or legal counsel.',
    },
    {
      q: 'Can I customize my documents?',
      a: 'Absolutely. You can add your company logo, custom branding colors, typography, signature blocks, and legal jurisdiction specific to your state or country.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Generation Legal Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
                Create Professional Legal Documents <span className="text-blue-600">with AI</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                Generate, customize, edit, and export professional legal documents in minutes — without starting from a blank page.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('create')}
                  className="px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <span>Create a Document</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('templates');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  Explore Templates
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>AI-assisted drafting</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Editable documents</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>PDF & DOCX export</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Secure storage</span>
                </div>
              </div>
            </div>

            {/* Right Column: High Fidelity UI Mockup Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-3 shadow-2xl backdrop-blur-xs">
                  {/* Editor window chrome */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-left">
                    {/* Top simulated toolbar */}
                    <div className="h-10 px-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-2 text-xs font-medium text-slate-500">Employment_Agreement.docx</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Autosaved
                      </div>
                    </div>

                    {/* Document sheet mockup */}
                    <div className="p-6 space-y-4 font-serif text-slate-800 bg-white">
                      <div className="text-center pb-2 border-b border-slate-100">
                        <div className="text-xs font-bold font-sans text-blue-600 tracking-wider uppercase mb-1">
                          ACME CORPORATION
                        </div>
                        <h3 className="text-base font-bold tracking-tight text-slate-900 font-sans">
                          EMPLOYMENT AGREEMENT
                        </h3>
                        <p className="text-[11px] text-slate-400 font-sans">Effective Date: October 15, 2026</p>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-600 font-sans">
                        <p className="font-semibold text-slate-800 mb-1">1. Position & Scope</p>
                        Company agrees to employ Employee as <span className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded font-mono text-[11px]">Senior Staff Software Engineer</span> reporting to the Chief Technology Officer...
                      </div>

                      <div className="text-xs leading-relaxed text-slate-600 font-sans">
                        <p className="font-semibold text-slate-800 mb-1">2. Compensation & Benefits</p>
                        Employer shall pay base annual salary of <span className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded font-mono text-[11px]">$165,000 USD</span> in semi-monthly installments with 20 days paid PTO...
                      </div>

                      {/* Floating AI assistant interaction highlight */}
                      <div className="bg-blue-600 text-white rounded-xl p-3 shadow-lg font-sans text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-200" />
                          <span>AI Clause Assistant: Ready to enhance</span>
                        </div>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">1-Click Rewrite</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEMPLATE CATEGORIES SECTION */}
      <section id="templates" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Template Directory</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Create the document you need
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Select from professionally vetted legal templates tailored for modern startups, landlords, and commercial ventures.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredTemplates.map(template => {
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.estimatedMinutes} min
                        </span>
                        {template.isPopular && (
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {template.category}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {template.steps.length} guided steps
                    </span>
                    <button
                      onClick={() => onNavigate('create', template.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Create</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Streamlined Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How LegalEase Works
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Draft fully customized legal agreements in 4 intuitive steps without legal jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold font-mono text-blue-600 tracking-widest uppercase">
                Step 01
              </span>
              <h3 className="text-lg font-bold text-slate-900">Choose a template</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select the exact legal document you require from our vetted catalog of agreements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold font-mono text-blue-600 tracking-widest uppercase">
                Step 02
              </span>
              <h3 className="text-lg font-bold text-slate-900">Answer a few questions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide parties, dates, compensation, jurisdiction, and governing terms through guided forms.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold font-mono text-blue-600 tracking-widest uppercase">
                Step 03
              </span>
              <h3 className="text-lg font-bold text-slate-900">Generate with AI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                LegalEase generates a structured, professional document based on your exact specifications.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold font-mono text-blue-600 tracking-widest uppercase">
                Step 04
              </span>
              <h3 className="text-lg font-bold text-slate-900">Review and export</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Edit clauses, review extracted key terms, customize branding, and export as PDF, DOCX, or TXT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Modern Legal Drafting
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Everything required to generate, refine, and sign legally sound contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">AI-Powered Drafting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate structured legal documents from simple questionnaire inputs in seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Professional Templates</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Start from carefully structured document templates designed by legal practitioners.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Editable Documents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Modify every word, clause, and section with formatting controls and autosave.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">AI Editing Assistant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rewrite, simplify, expand, explain, or add clauses with one-click AI assistance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Key Terms Extraction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically identify important dates, payment terms, duration, and notice periods.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Custom Branding</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add your company logo, signature blocks, custom colors, fonts, header, and footer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">PDF & DOCX Export</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Download sealed PDF, Microsoft Word DOCX, and plain text files ready for execution.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Version History</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track every revision chronologically and restore previous drafts at any moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section id="security" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-xl">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Security Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your documents deserve serious protection.
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Legal contracts carry sensitive commercial agreements and personal information. LegalEase enforces strict isolation, access control, and private storage safeguards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Secure Authentication</h4>
                    <p className="text-xs text-slate-400 mt-1">Multi-factor sessions with protected credentials</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Private Document Storage</h4>
                    <p className="text-xs text-slate-400 mt-1">Private tenant storage with no unauthorized data pooling</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-purple-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Protected User Data</h4>
                    <p className="text-xs text-slate-400 mt-1">User identity and company data encrypted in storage</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-amber-400 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Secure File Handling</h4>
                    <p className="text-xs text-slate-400 mt-1">Client-isolated export processing for PDF & DOCX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple plans for individuals and teams
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Start creating legal documents today with our flexible options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Free</h3>
                <p className="text-xs text-slate-500 mt-1">For occasional personal contracts</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-xs text-slate-500 font-medium"> / forever</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3 documents / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic templates catalog</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PDF export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Document history</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('register')}
                className="mt-8 w-full py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
              >
                Start Free
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Pro</h3>
                <p className="text-xs text-slate-500 mt-1">For founders, landlords & freelancers</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900">$19</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Unlimited document drafts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Premium templates catalog</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>AI editing assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>DOCX & PDF export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Custom company branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Advanced version history</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('register')}
                className="mt-8 w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors text-center cursor-pointer"
              >
                Choose Pro
              </button>
            </div>

            {/* Business */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900">Business</h3>
                <p className="text-xs text-slate-500 mt-1">For growing companies & agencies</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900">$49</span>
                  <span className="text-xs text-slate-500 font-medium"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Team workspace & seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Shared company templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Admin controls & staff roles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Usage analytics dashboard</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => alert('Contact Sales: Please reach our enterprise support team at enterprise@legalease.ai')}
                className="mt-8 w-full py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Common Inquiries</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4.5 flex items-center justify-between text-left font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
