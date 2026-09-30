import React, { useState } from 'react';
import {
  Shield,
  Users,
  FileText,
  Sparkles,
  Download,
  Activity,
  Plus,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { LegalTemplate, LegalDocument } from '../types';
import { getTemplates, toggleTemplatePublish, saveTemplate } from '../services/storage';
import { useToast } from '../components/Toast';

interface AdminViewProps {
  documents: LegalDocument[];
  onRefreshTemplates: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ documents, onRefreshTemplates }) => {
  const [templates, setTemplates] = useState<LegalTemplate[]>(getTemplates());
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'users' | 'documents'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New template form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Employment' | 'Business' | 'Real Estate' | 'Freelance'>('Business');
  const [newDescription, setNewDescription] = useState('');
  const [newMinutes, setNewMinutes] = useState(5);

  const { showToast } = useToast();

  const handleTogglePublish = (id: string) => {
    toggleTemplatePublish(id);
    setTemplates(getTemplates());
    onRefreshTemplates();
    showToast('Template publish state updated', 'info');
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tpl: LegalTemplate = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom business agreement template configured by staff admin.',
      icon: 'FileText',
      estimatedMinutes: newMinutes,
      isPublished: true,
      steps: [
        {
          id: 'parties',
          title: 'Parties Information',
          description: 'Names and identifiers of the executing parties.',
          fields: [
            { id: 'partyA', label: 'Primary Entity / First Party', type: 'text', required: true },
            { id: 'partyB', label: 'Counterparty / Second Party', type: 'text', required: true },
          ],
        },
        {
          id: 'terms',
          title: 'General Terms',
          description: 'Key obligations, compensation, and legal jurisdiction.',
          fields: [
            { id: 'effectiveDate', label: 'Effective Date', type: 'date', defaultValue: '2026-10-01', required: true },
            { id: 'governingLaw', label: 'Governing Law', type: 'text', defaultValue: 'State of Delaware, United States', required: true },
          ],
        },
      ],
    };

    saveTemplate(tpl);
    setTemplates(getTemplates());
    onRefreshTemplates();
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    showToast('New template published to catalog!', 'success');
  };

  // Mock staff & user accounts for Admin
  const registeredUsers = [
    { id: 'u1', name: 'Eleanor Vance', email: 'eleanor.vance@acmecorp.com', role: 'Super Admin', plan: 'Pro', docs: 8, status: 'Active' },
    { id: 'u2', name: 'Julian Sterling', email: 'julian.sterling@example.com', role: 'User', plan: 'Free', docs: 2, status: 'Active' },
    { id: 'u3', name: 'Dr. Clara Lin', email: 'clara.lin@summitrobotics.ai', role: 'User', plan: 'Business', docs: 14, status: 'Active' },
    { id: 'u4', name: 'Marcus Campbell', email: 'marcus.campbell@pacificheights.com', role: 'User', plan: 'Pro', docs: 6, status: 'Active' },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
            <Shield className="w-4 h-4" />
            <span>Staff Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            LegalEase Admin Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor platform system statistics, active users, generated agreements, and legal templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-xs transition-all cursor-pointer text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Template</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">1,248</p>
          <p className="text-[11px] text-emerald-600 font-medium">+14% this month</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Docs Generated</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">4,812</p>
          <p className="text-[11px] text-slate-400">All registered agreements</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>AI Generations</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">12,650</p>
          <p className="text-[11px] text-slate-400">Clause rewrites & drafts</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Exports</span>
            <Download className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">3,940</p>
          <p className="text-[11px] text-slate-400">PDF, DOCX & TXT</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Active Tenants</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">89%</p>
          <p className="text-[11px] text-emerald-600 font-medium">99.98% Service Uptime</p>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer px-2 ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Template Management ({templates.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer px-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          User Accounts ({registeredUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer px-2 ${
            activeTab === 'documents'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Recent Platform Documents ({documents.length})
        </button>
      </div>

      {/* TEMPLATE MANAGEMENT */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Configured Legal Templates</h3>
            <span className="text-xs text-slate-400">Click toggle to publish or unpublish instantly</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Template</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Estimated Time</th>
                  <th className="px-6 py-3.5">Sections</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {templates.map(tpl => (
                  <tr key={tpl.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{tpl.title}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs">{tpl.description}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {tpl.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {tpl.estimatedMinutes} minutes
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {tpl.steps.length} guided steps
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(tpl.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                          tpl.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {tpl.isPublished ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Draft / Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleTogglePublish(tpl.id)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER ACCOUNTS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Registered Platform Users</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Plan</th>
                <th className="px-6 py-3.5">Documents</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registeredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">{u.role}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{u.docs} created</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ALL DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">All Client Documents</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4 font-semibold text-slate-900">{d.title}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{d.templateCategory}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(d.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD TEMPLATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Add New Legal Template</h3>
            <form onSubmit={handleAddTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mutual Confidentiality Undertaking"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                >
                  <option value="Employment">Employment</option>
                  <option value="Business">Business</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of this legal contract's purpose and covenants..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Completion Minutes
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={newMinutes}
                  onChange={e => setNewMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Publish Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
