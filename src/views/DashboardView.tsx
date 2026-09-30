import React, { useState } from 'react';
import {
  FilePlus2,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Star,
  Copy,
  Trash2,
  Archive,
  Download,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { LegalDocument, UserProfile } from '../types';
import { INITIAL_TEMPLATES } from '../data/templates';
import { duplicateDocument, deleteDocument, toggleFavorite, archiveDocument } from '../services/storage';
import { useToast } from '../components/Toast';
import { ExportModal } from '../components/ExportModal';

interface DashboardViewProps {
  user: UserProfile;
  documents: LegalDocument[];
  onNavigate: (view: string, docIdOrTemplateId?: string) => void;
  onRefreshDocs: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  documents,
  onNavigate,
  onRefreshDocs,
}) => {
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const [exportDoc, setExportDoc] = useState<LegalDocument | null>(null);
  const { showToast } = useToast();

  // Compute metrics
  const totalDocs = documents.length;
  const draftDocs = documents.filter(d => d.status === 'Draft' || d.status === 'Generating').length;
  const readyDocs = documents.filter(d => d.status === 'Ready').length;
  const thisMonthDocs = documents.filter(d => {
    const created = new Date(d.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  // Recent documents (up to 6)
  const recentDocs = [...documents].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 6);

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateDocument(id);
    showToast('Document duplicated successfully', 'success');
    onRefreshDocs();
    setActiveMenuDocId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to permanently delete this document?')) {
      deleteDocument(id);
      showToast('Document deleted', 'info');
      onRefreshDocs();
      setActiveMenuDocId(null);
    }
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = toggleFavorite(id);
    showToast(isFav ? 'Added to favorites' : 'Removed from favorites', 'info');
    onRefreshDocs();
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = archiveDocument(id);
    showToast(doc?.status === 'Archived' ? 'Document archived' : 'Document restored', 'info');
    onRefreshDocs();
    setActiveMenuDocId(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {user.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage, and organize your legal documents.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>+ Create New Document</span>
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Documents</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalDocs}</p>
          <p className="text-xs text-slate-400">All registered agreements</p>
        </div>

        {/* Drafts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{draftDocs}</p>
          <p className="text-xs text-slate-400">Incomplete or under review</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{readyDocs}</p>
          <p className="text-xs text-slate-400">Finalized & ready to sign</p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">This Month</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{thisMonthDocs}</p>
          <p className="text-xs text-slate-400">Generated this billing cycle</p>
        </div>
      </div>

      {/* QUICK TEMPLATE STARTER BAR */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Instant Legal Drafting</span>
            </div>
            <h3 className="text-xl font-bold text-white">Start from a popular template</h3>
          </div>
          <button
            onClick={() => onNavigate('templates')}
            className="text-xs font-semibold text-blue-200 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <span>View all 12 templates</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_TEMPLATES.slice(0, 4).map(tpl => (
            <div
              key={tpl.id}
              onClick={() => onNavigate('create', tpl.id)}
              className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer group"
            >
              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block mb-1">
                {tpl.category}
              </span>
              <h4 className="font-semibold text-sm text-white group-hover:text-blue-200 transition-colors">
                {tpl.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {tpl.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-blue-200 pt-2 border-t border-white/10">
                <span>{tpl.estimatedMinutes} min setup</span>
                <span className="font-semibold group-hover:underline">Start &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT DOCUMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Documents</h3>
            <p className="text-xs text-slate-500">Your most recently created and edited legal contracts</p>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            View all documents &rarr;
          </button>
        </div>

        {recentDocs.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-base text-slate-900">No documents yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first professional legal document with AI in just a few minutes.
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              <FilePlus2 className="w-4 h-4" />
              Create Document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Document</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Last Modified</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentDocs.map(doc => {
                  return (
                    <tr
                      key={doc.id}
                      onClick={() => onNavigate('edit', doc.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Document Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={e => handleToggleFav(doc.id, e)}
                            className="text-slate-300 hover:text-amber-400 p-0.5"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                doc.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                              }`}
                            />
                          </button>
                          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {doc.content.sections?.length || 0} Sections · {doc.versions?.length || 1} versions
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {doc.templateCategory}
                        </span>
                      </td>

                      {/* Last Modified */}
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'Ready'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : doc.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : doc.status === 'Generating'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === 'Ready'
                                ? 'bg-emerald-500'
                                : doc.status === 'Draft'
                                ? 'bg-amber-500'
                                : doc.status === 'Generating'
                                ? 'bg-blue-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {doc.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onNavigate('edit', doc.id)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Document"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExportDoc(doc)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Export PDF / DOCX"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id)
                              }
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeMenuDocId === doc.id && (
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs">
                                <button
                                  onClick={e => handleDuplicate(doc.id, e)}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={e => handleArchive(doc.id, e)}
                                  className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Archive className="w-3.5 h-3.5 text-slate-400" />
                                  {doc.status === 'Archived' ? 'Restore' : 'Archive'}
                                </button>
                                <button
                                  onClick={e => handleDelete(doc.id, e)}
                                  className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export modal */}
      {exportDoc && (
        <ExportModal
          isOpen={Boolean(exportDoc)}
          onClose={() => setExportDoc(null)}
          document={exportDoc}
        />
      )}
    </div>
  );
};
