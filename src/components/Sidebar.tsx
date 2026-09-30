import React from 'react';
import { LegalEaseLogo } from './LegalEaseLogo';
import {
  LayoutDashboard,
  FilePlus2,
  FolderOpen,
  Layers,
  Star,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
  collapsed = false,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Document', icon: FilePlus2, highlight: true },
    { id: 'documents', label: 'My Documents', icon: FolderOpen },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-all duration-200 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand */}
      <div>
        <div className="h-18 px-5 border-b border-slate-100 flex items-center justify-between">
          <div
            className="cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            {collapsed ? (
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                L
              </div>
            ) : (
              <LegalEaseLogo size="sm" />
            )}
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          {mainNav.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : item.highlight
                    ? 'text-blue-600 hover:bg-blue-50/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-blue-600' : item.highlight ? 'text-blue-600' : 'text-slate-500'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.highlight && (
                  <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">
                    + New
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin link if user is admin */}
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              title={collapsed ? 'Admin Portal' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Shield className="w-5 h-5 text-purple-600 shrink-0" />
              {!collapsed && (
                <>
                  <span>Admin Portal</span>
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                    Staff
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Usage summary widget (when expanded) */}
      {!collapsed && (
        <div className="mx-3.5 my-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
            <span>{user.plan} Plan Usage</span>
            <span className="font-semibold text-blue-600">{user.documentsCreatedThisMonth} / {user.monthlyLimit}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (user.documentsCreatedThisMonth / user.monthlyLimit) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>AI drafts reset monthly</span>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Upgrade
            </button>
          </p>
        </div>
      )}

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          onClick={() => onNavigate('landing')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>Public Website</span>}
        </button>

        <button
          onClick={() => alert('LegalEase Support Center: Reach our legal-tech support team 24/7 at support@legalease.ai')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          {!collapsed && <span>Help & Support</span>}
        </button>

        {/* User Mini Profile */}
        <div className={`mt-2 pt-2 border-t border-slate-100 flex items-center gap-2.5 px-1 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.company}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
