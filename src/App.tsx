import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LandingPage } from './views/LandingPage';
import { AuthViews } from './views/AuthViews';
import { DashboardView } from './views/DashboardView';
import { TemplateSelectionView } from './views/TemplateSelectionView';
import { CreateDocumentWorkflow } from './views/CreateDocumentWorkflow';
import { DocumentEditorView } from './views/DocumentEditorView';
import { MyDocumentsView } from './views/MyDocumentsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';

import {
  getCurrentUser,
  isAuthenticated,
  getDocuments,
  getTemplates,
  logoutUser,
  getDocumentById,
  initStorage,
} from './services/storage';
import { LegalDocument, LegalTemplate, UserProfile } from './types';

function MainApp() {
  const [isAuth, setIsAuth] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(getCurrentUser());
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);

  // Navigation View State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize storage & sync on load
  useEffect(() => {
    initStorage();
    setIsAuth(isAuthenticated());
    setUser(getCurrentUser());
    setDocuments(getDocuments());
    setTemplates(getTemplates());

    const handleDocsUpdate = () => setDocuments(getDocuments());
    const handleUserUpdate = () => setUser(getCurrentUser());
    const handleTemplatesUpdate = () => setTemplates(getTemplates());
    const handleAuthUpdate = () => setIsAuth(isAuthenticated());

    window.addEventListener('legalease:docs_updated', handleDocsUpdate);
    window.addEventListener('legalease:user_updated', handleUserUpdate);
    window.addEventListener('legalease:templates_updated', handleTemplatesUpdate);
    window.addEventListener('legalease:auth_updated', handleAuthUpdate);

    return () => {
      window.removeEventListener('legalease:docs_updated', handleDocsUpdate);
      window.removeEventListener('legalease:user_updated', handleUserUpdate);
      window.removeEventListener('legalease:templates_updated', handleTemplatesUpdate);
      window.removeEventListener('legalease:auth_updated', handleAuthUpdate);
    };
  }, []);

  const refreshDocs = () => {
    setDocuments(getDocuments());
  };

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  const refreshTemplates = () => {
    setTemplates(getTemplates());
  };

  const navigateTo = (view: string, paramId?: string) => {
    if (view === 'edit') {
      if (paramId) {
        setActiveDocId(paramId);
        setCurrentView('edit');
      }
      return;
    }

    if (view === 'create') {
      if (paramId) {
        setSelectedTemplateId(paramId);
      } else {
        setSelectedTemplateId(null);
      }
      setCurrentView('create');
      return;
    }

    if (view === 'favorites') {
      setCurrentView('documents');
      return;
    }

    setActiveDocId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuth(false);
    setCurrentView('landing');
  };

  // 1. Landing Page View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigate={navigateTo}
        isLoggedIn={isAuth}
      />
    );
  }

  // 2. Authentication Views (login, register, forgot-password)
  if (currentView === 'login' || currentView === 'register' || currentView === 'forgot-password') {
    return (
      <AuthViews
        initialMode={currentView as any}
        onSuccess={() => {
          setIsAuth(true);
          setUser(getCurrentUser());
          setCurrentView('dashboard');
        }}
        onNavigateLanding={() => setCurrentView('landing')}
      />
    );
  }

  // 3. Document Creation Workflow
  if (currentView === 'create') {
    const activeTemplate = templates.find(t => t.id === selectedTemplateId);
    if (activeTemplate) {
      return (
        <CreateDocumentWorkflow
          template={activeTemplate}
          onCancel={() => setSelectedTemplateId(null)}
          onGenerated={(newDocId) => {
            refreshDocs();
            setActiveDocId(newDocId);
            setCurrentView('edit');
          }}
        />
      );
    }

    // If no template is selected yet, show the full template catalog
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar
          currentView="create"
          onNavigate={navigateTo}
          user={user}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            user={user}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <main className="flex-1 overflow-y-auto">
            <TemplateSelectionView
              onSelectTemplate={(tplId) => setSelectedTemplateId(tplId)}
              onNavigate={navigateTo}
            />
          </main>
        </div>
      </div>
    );
  }

  // 4. Document Editor View (/documents/:id/edit)
  if (currentView === 'edit') {
    const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];
    if (activeDoc) {
      return (
        <DocumentEditorView
          document={activeDoc}
          onBack={() => setCurrentView('dashboard')}
          onRefreshDoc={(updatedDoc) => {
            setDocuments(prev => prev.map(d => (d.id === updatedDoc.id ? updatedDoc : d)));
          }}
        />
      );
    }
  }

  // 5. Standard Dashboard Workspace Shell
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        currentView={currentView}
        onNavigate={navigateTo}
        user={user}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          user={user}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto pb-16">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              documents={documents}
              onNavigate={navigateTo}
              onRefreshDocs={refreshDocs}
            />
          )}

          {currentView === 'documents' && (
            <MyDocumentsView
              documents={documents}
              onNavigate={navigateTo}
              onRefreshDocs={refreshDocs}
            />
          )}

          {currentView === 'templates' && (
            <TemplateSelectionView
              onSelectTemplate={(tplId) => {
                setSelectedTemplateId(tplId);
                setCurrentView('create');
              }}
              onNavigate={navigateTo}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              user={user}
              onRefreshUser={refreshUser}
            />
          )}

          {currentView === 'admin' && (
            <AdminView
              documents={documents}
              onRefreshTemplates={refreshTemplates}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
