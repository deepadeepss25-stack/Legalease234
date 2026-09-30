import { LegalDocument, LegalTemplate, UserProfile, DocumentVersion } from '../types';
import { INITIAL_TEMPLATES } from '../data/templates';
import { SEED_DOCUMENTS } from '../data/seedDocuments';

const STORAGE_KEYS = {
  DOCUMENTS: 'legalease_documents_v1',
  TEMPLATES: 'legalease_templates_v1',
  USER: 'legalease_user_v1',
  AUTH_TOKEN: 'legalease_auth_token_v1',
};

const DEFAULT_USER: UserProfile = {
  id: 'user-001',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@acmecorp.com',
  role: 'admin',
  company: 'Acme Corporation',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  plan: 'Pro',
  documentsCreatedThisMonth: 4,
  monthlyLimit: 50,
};

// Initialize Storage
export function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SEED_DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEMPLATES)) {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(INITIAL_TEMPLATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  }
}

// User & Auth Management
export function getCurrentUser(): UserProfile {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return DEFAULT_USER;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function updateUser(updates: Partial<UserProfile>): UserProfile {
  const current = getCurrentUser();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  window.dispatchEvent(new Event('legalease:user_updated'));
  return updated;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) !== 'false';
}

export function setAuthenticated(isAuth: boolean) {
  if (isAuth) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'true');
  } else {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'false');
  }
  window.dispatchEvent(new Event('legalease:auth_updated'));
}

export function loginUser(email: string, _password?: string): UserProfile {
  const user = getCurrentUser();
  const updated = { ...user, email };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  setAuthenticated(true);
  return updated;
}

export function registerUser(name: string, email: string): UserProfile {
  const newUser: UserProfile = {
    ...DEFAULT_USER,
    id: `user-${Date.now()}`,
    name,
    email,
    documentsCreatedThisMonth: 1,
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  setAuthenticated(true);
  return newUser;
}

export function logoutUser() {
  setAuthenticated(false);
}

// Documents Management
export function getDocuments(): LegalDocument[] {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getDocumentById(id: string): LegalDocument | undefined {
  const docs = getDocuments();
  return docs.find(d => d.id === id);
}

export function saveDocument(document: LegalDocument): LegalDocument {
  const docs = getDocuments();
  const index = docs.findIndex(d => d.id === document.id);
  const now = new Date().toISOString();
  const docToSave = { ...document, updatedAt: now };

  if (index >= 0) {
    docs[index] = docToSave;
  } else {
    docs.unshift(docToSave);
  }

  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  window.dispatchEvent(new Event('legalease:docs_updated'));
  return docToSave;
}

export function createDocument(docData: Omit<LegalDocument, 'id' | 'createdAt' | 'updatedAt' | 'versions'>): LegalDocument {
  const now = new Date().toISOString();
  const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  const initialVersion: DocumentVersion = {
    id: `v1-${Date.now()}`,
    versionNumber: 1,
    label: 'v1 — Initial Document',
    summary: 'Document created from template questionnaire.',
    timestamp: now,
    content: JSON.parse(JSON.stringify(docData.content)),
  };

  const newDoc: LegalDocument = {
    ...docData,
    id,
    createdAt: now,
    updatedAt: now,
    versions: [initialVersion],
  };

  const docs = getDocuments();
  docs.unshift(newDoc);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

  // Increment user usage
  const user = getCurrentUser();
  updateUser({ documentsCreatedThisMonth: (user.documentsCreatedThisMonth || 0) + 1 });

  window.dispatchEvent(new Event('legalease:docs_updated'));
  return newDoc;
}

export function createDocumentVersion(docId: string, summary: string): DocumentVersion | null {
  const doc = getDocumentById(docId);
  if (!doc) return null;

  const now = new Date().toISOString();
  const nextNum = (doc.versions?.length || 0) + 1;
  const newVersion: DocumentVersion = {
    id: `v${nextNum}-${Date.now()}`,
    versionNumber: nextNum,
    label: `v${nextNum} — Manual Revision`,
    summary: summary || 'Document updated',
    timestamp: now,
    content: JSON.parse(JSON.stringify(doc.content)),
  };

  doc.versions = [newVersion, ...(doc.versions || [])];
  doc.updatedAt = now;
  saveDocument(doc);
  return newVersion;
}

export function restoreDocumentVersion(docId: string, versionId: string): LegalDocument | null {
  const doc = getDocumentById(docId);
  if (!doc || !doc.versions) return null;

  const targetVersion = doc.versions.find(v => v.id === versionId);
  if (!targetVersion) return null;

  doc.content = JSON.parse(JSON.stringify(targetVersion.content));
  const now = new Date().toISOString();
  const nextNum = doc.versions.length + 1;
  
  const restoreVersion: DocumentVersion = {
    id: `v${nextNum}-${Date.now()}`,
    versionNumber: nextNum,
    label: `v${nextNum} — Restored from ${targetVersion.label}`,
    summary: `Restored to version state from ${new Date(targetVersion.timestamp).toLocaleDateString()}`,
    timestamp: now,
    content: JSON.parse(JSON.stringify(targetVersion.content)),
  };

  doc.versions = [restoreVersion, ...doc.versions];
  doc.updatedAt = now;
  saveDocument(doc);
  return doc;
}

export function deleteDocument(id: string): boolean {
  const docs = getDocuments();
  const filtered = docs.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
  window.dispatchEvent(new Event('legalease:docs_updated'));
  return true;
}

export function duplicateDocument(id: string): LegalDocument | null {
  const doc = getDocumentById(id);
  if (!doc) return null;

  const now = new Date().toISOString();
  const duplicated: LegalDocument = {
    ...doc,
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${doc.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
    versions: [
      {
        id: `v1-${Date.now()}`,
        versionNumber: 1,
        label: 'v1 — Duplicated Copy',
        summary: `Created as a copy of ${doc.title}`,
        timestamp: now,
        content: JSON.parse(JSON.stringify(doc.content)),
      }
    ],
  };

  const docs = getDocuments();
  docs.unshift(duplicated);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  window.dispatchEvent(new Event('legalease:docs_updated'));
  return duplicated;
}

export function toggleFavorite(id: string): boolean {
  const doc = getDocumentById(id);
  if (!doc) return false;
  doc.isFavorite = !doc.isFavorite;
  saveDocument(doc);
  return doc.isFavorite;
}

export function archiveDocument(id: string): LegalDocument | null {
  const doc = getDocumentById(id);
  if (!doc) return null;
  doc.status = doc.status === 'Archived' ? 'Ready' : 'Archived';
  saveDocument(doc);
  return doc;
}

// Templates Management (Admin)
export function getTemplates(): LegalTemplate[] {
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
  if (!raw) return INITIAL_TEMPLATES;
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_TEMPLATES;
  }
}

export function saveTemplate(template: LegalTemplate): LegalTemplate {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === template.id);
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  window.dispatchEvent(new Event('legalease:templates_updated'));
  return template;
}

export function toggleTemplatePublish(id: string): boolean {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);
  if (!template) return false;
  template.isPublished = !template.isPublished;
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  window.dispatchEvent(new Event('legalease:templates_updated'));
  return template.isPublished;
}
