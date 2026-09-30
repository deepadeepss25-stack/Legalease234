import React from 'react';
import { LegalEaseLogo } from './LegalEaseLogo';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <LegalEaseLogo light size="md" showTagline />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              LegalEase empowers entrepreneurs, businesses, professionals, and individuals to draft, edit, and export tailored, professional legal contracts in minutes with AI.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                AI-assisted drafting
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                PDF & DOCX Export
              </span>
            </div>
          </div>

          {/* Column 1: Templates */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Templates</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Employment Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Non-Disclosure (NDA)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Residential Lease
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Freelance Agreement
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Master Service Agreement
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('create')} className="hover:text-white transition-colors cursor-pointer">
                  Create Document
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  App Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Template Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors cursor-pointer">
                  Brand Customization
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors cursor-pointer">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Security & Trust</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Private Document Storage</span>
              </li>
              <li>
                <span className="text-slate-400">Strict Data Isolation</span>
              </li>
              <li>
                <span className="text-slate-400">Access Control & Audit</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300 font-semibold">Legal Disclaimer:</strong> LegalEase provides AI-assisted document drafting and general legal information. Generated documents may require review by a qualified legal professional and may not be appropriate for every jurisdiction or situation. LegalEase is not a law firm and does not provide legal representation.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LegalEase Inc. All rights reserved.</p>
          <p>Built with Google AI Studio & Gemini 3.8 Flash.</p>
        </div>
      </div>
    </footer>
  );
};
