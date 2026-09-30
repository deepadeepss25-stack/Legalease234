import React, { useState } from 'react';
import {
  Search,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Briefcase,
  ShieldCheck,
  Home,
  FileCode,
  Users,
  CheckSquare,
  Building2,
  MailCheck,
  ScrollText,
} from 'lucide-react';
import { INITIAL_TEMPLATES } from '../data/templates';
import { TemplateCategory, LegalTemplate } from '../types';

interface TemplateSelectionViewProps {
  onSelectTemplate: (templateId: string) => void;
  onNavigate: (view: string) => void;
}

export const TemplateSelectionView: React.FC<TemplateSelectionViewProps> = ({
  onSelectTemplate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');

  const categories: (TemplateCategory | 'All')[] = [
    'All',
    'Employment',
    'Business',
    'Real Estate',
    'Freelance',
  ];

  const filtered = INITIAL_TEMPLATES.filter(tpl => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tpl.description.toLowerCase().includes(search.toLowerCase()) ||
      tpl.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return Briefcase;
      case 'ShieldCheck': return ShieldCheck;
      case 'Home': return Home;
      case 'FileCode': return FileCode;
      case 'MailCheck': return MailCheck;
      case 'ScrollText': return ScrollText;
      case 'Building2': return Building2;
      case 'Users': return Users;
      case 'CheckSquare': return CheckSquare;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Template Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What document would you like to create?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from comprehensive, legally vetted contract structures powered by AI.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* POPULAR BANNER */}
      {selectedCategory === 'All' && !search && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-blue-950">Most Drafted: Employment Agreement</h3>
              <p className="text-xs text-blue-800">
                Covers duties, salary, benefits, IP assignment, and 30-day notice provisions.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTemplate('employment-agreement')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            Draft Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(tpl => {
          const Icon = getTemplateIcon(tpl.icon);
          return (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tpl.estimatedMinutes} min
                    </span>
                    {tpl.isPopular && (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {tpl.category}
                </span>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {tpl.steps.length} guided sections
                </span>
                <button
                  onClick={() => onSelectTemplate(tpl.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all cursor-pointer"
                >
                  <span>Select & Fill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
