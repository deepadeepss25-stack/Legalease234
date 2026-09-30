import React, { useState } from 'react';
import {
  User,
  Shield,
  Palette,
  Bell,
  HardDrive,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { updateUser, getDocuments } from '../services/storage';
import { useToast } from '../components/Toast';

interface SettingsViewProps {
  user: UserProfile;
  onRefreshUser: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onRefreshUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'branding' | 'notifications' | 'account'>('profile');
  
  // Profile form
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  // Security form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Branding defaults
  const [defaultCompanyName, setDefaultCompanyName] = useState(user.company || 'Acme Corporation');
  const [defaultColor, setDefaultColor] = useState('#2563EB');
  const [defaultFont, setDefaultFont] = useState('Inter');

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [generationAlerts, setGenerationAlerts] = useState(true);
  const [exportAlerts, setExportAlerts] = useState(false);

  const { showToast } = useToast();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, company, avatarUrl });
    onRefreshUser();
    showToast('Profile updated successfully!', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password changed successfully!', 'success');
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Default branding presets saved!', 'success');
  };

  const handleExportAllData = () => {
    const docs = getDocuments();
    const exportBundle = {
      user,
      documentsCount: docs.length,
      documents: docs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legalease_export_${Date.now()}.json`;
    a.click();
    showToast('Exported complete data archive', 'success');
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile, security, default branding, and account settings
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-60 bg-slate-50/75 border-b md:border-b-0 md:border-r border-slate-200/80 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Branding Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'account'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Account & Data</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 sm:p-8">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">User Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your personal credentials and company affiliation</p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg w-72 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Security & Authentication</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage passwords, authentication factors, and active sessions</p>
              </div>

              {/* Password change */}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-800">Change Password</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              {/* Two-Factor Authentication UI */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-500">Require an authenticator app code on login</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(
                        !twoFactorEnabled ? '2FA enabled on your account' : '2FA disabled',
                        'info'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      twoFactorEnabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {twoFactorEnabled ? 'Enabled ✓' : 'Enable 2FA'}
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Active Browser Sessions</h4>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">Current Chrome Session (Active Now)</p>
                    <p className="text-slate-400">San Francisco, United States · IP: 198.51.100.24</p>
                  </div>
                  <span className="text-emerald-600 font-semibold">Current</span>
                </div>
              </div>
            </div>
          )}

          {/* BRANDING TAB */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Default Branding Presets</h3>
                <p className="text-xs text-slate-500 mt-0.5">Applied automatically to all new document drafts</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Default Company / Entity Name
                  </label>
                  <input
                    type="text"
                    value={defaultCompanyName}
                    onChange={e => setDefaultCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Default Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={defaultColor}
                      onChange={e => setDefaultColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={defaultColor}
                      onChange={e => setDefaultColor(e.target.value)}
                      className="text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase bg-slate-50 w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Default Font
                  </label>
                  <select
                    value={defaultFont}
                    onChange={e => setDefaultFont(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  >
                    <option value="Inter">Inter (Sans-Serif Modern)</option>
                    <option value="Merriweather">Merriweather (Classic Legal Serif)</option>
                    <option value="Playfair Display">Playfair Display (Executive Editorial)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Branding Presets
              </button>
            </form>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control when and how you receive alerts</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={e => setEmailAlerts(e.target.checked)}
                    className="mt-1 rounded text-blue-600"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Email Notifications</p>
                    <p className="text-[11px] text-slate-500">Receive summaries of finalized and shared legal contracts</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generationAlerts}
                    onChange={e => setGenerationAlerts(e.target.checked)}
                    className="mt-1 rounded text-blue-600"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Document Generation Notifications</p>
                    <p className="text-[11px] text-slate-500">Alert when AI completes long contract drafting</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportAlerts}
                    onChange={e => setExportAlerts(e.target.checked)}
                    className="mt-1 rounded text-blue-600"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Export Notifications</p>
                    <p className="text-[11px] text-slate-500">Confirmation email upon PDF or DOCX file downloads</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ACCOUNT & DATA TAB */}
          {activeTab === 'account' && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Account & Data Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">Export all document archives or manage tenancy</p>
              </div>

              {/* Data Export */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">
                  Export Document Data Archive
                </h4>
                <p className="text-xs text-slate-600">
                  Download a complete JSON archive containing all your drafted contracts, version histories, and brand settings.
                </p>
                <button
                  type="button"
                  onClick={handleExportAllData}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Archive (.JSON)</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Danger Zone</span>
                </div>
                <p className="text-xs text-rose-800">
                  Deleting your account will remove all your generated contracts and version records permanently.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Account deletion requested. For security compliance, please confirm with customer support.')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
