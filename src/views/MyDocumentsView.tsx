import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Star,
  MoreVertical,
  Download,
  Copy,
  Trash2,
  Archive,
  ExternalLink,
  Edit2,
  Calendar,
  Grid,
  List as ListIcon,
  Sparkles,
} from 'lucide-react';
import { LegalDocument, DocumentStatus, TemplateCategory } from '../types';
import {
  saveDocument,
  deleteDocument,
  duplicateDocument,
  toggleFavorite,
  archiveDocument,
} from '../services/storage';
import { useToast } from '../components/Toast';
import { ExportModal } from '../components/ExportModal';

interface MyDocumentsViewProps {
  documents: LegalDocument[];
  onNavigate: (view: string, docId?: string) => void;
  onRefreshDocs: () => void;
}

export const MyDocumentsView: React.FC<MyDocumentsViewProps> = ({
  documents,
  onNavigate,
  onRefreshDocs,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | DocumentStatus | 'Favorites'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | TemplateCategory>('All');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'created'>('updated');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [exportDoc, setExportDoc] = useState<LegalDocument | null>(null);

  const { showToast } = useToast();

  // Filter & Search logic
  const filtered = documents
    .filter(doc => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.templateCategory.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'Favorites'
          ? doc.isFavorite
          : doc.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'All' ? true : doc.templateCategory === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'created')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateDocument(id);
    showToast('Document duplicated', 'success');
    onRefreshDocs();
    setActiveMenuId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to permanently delete this document?')) {
      deleteDocument(id);
      showToast('Document deleted', 'info');
      onRefreshDocs();
      setActiveMenuId(null);
    }
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = archiveDocument(id);
    showToast(doc?.status === 'Archived' ? 'Document archived' : 'Document restored', 'info');
    onRefreshDocs();
    setActiveMenuId(null);
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = toggleFavorite(id);
    showToast(isFav ? 'Added to favorites' : 'Removed from favorites', 'info');
    onRefreshDocs();
  };

  const handleRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = prompt('Rename legal document:', currentTitle);
    if (newTitle && newTitle.trim() && newTitle !== currentTitle) {
      const target = documents.find(d => d.id === id);
      if (target) {
        target.title = newTitle.trim();
        saveDocument(target);
        onRefreshDocs();
        showToast('Document renamed', 'success');
      }
    }
    setActiveMenuId(null);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Documents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, export, and organize all your drafted agreements
          </p>
        </div>

        <button
          onClick={() => onNavigate('create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* FILTER & CONTROLS TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {(['All', 'Ready', 'Draft', 'Favorites', 'Archived'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
            className="text-xs bg-slate-100 font-semibold text-slate-700 px-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Employment">Employment</option>
            <option value="Business">Business</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Freelance">Freelance</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-100 font-semibold text-slate-700 px-3 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="updated">Recently Modified</option>
            <option value="created">Recently Created</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-slate-200 p-0.5 rounded-lg ml-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENT LIST */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No contracts match your current filter or search criteria.
          </p>
          <button
            onClick={() => onNavigate('create')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Create Document
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Document Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Last Modified</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(doc => (
                <tr
                  key={doc.id}
                  onClick={() => onNavigate('edit', doc.id)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
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

                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {doc.templateCategory}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

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
                        title="Export Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === doc.id ? null : doc.id)
                          }
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === doc.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs">
                            <button
                              onClick={e => handleRename(doc.id, doc.title, e)}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                              Rename
                            </button>
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(doc => (
            <div
              key={doc.id}
              onClick={() => onNavigate('edit', doc.id)}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {doc.templateCategory}
                  </span>
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
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {doc.content.preamble}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setExportDoc(doc)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('edit', doc.id)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                    title="Open"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
