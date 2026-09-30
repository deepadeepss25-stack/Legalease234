export type DocumentStatus = 'Draft' | 'Generating' | 'Ready' | 'Archived';

export type TemplateCategory = 'Employment' | 'Business' | 'Real Estate' | 'Freelance';

export interface DocumentClause {
  id: string;
  title: string;
  body: string;
}

export interface DocumentSection {
  id: string;
  number: string;
  title: string;
  clauses: DocumentClause[];
}

export interface DocumentSignatureBlock {
  partyTitle: string;
  name: string;
  role?: string;
  entityName?: string;
  signatureDate?: string;
}

export interface DocumentContent {
  title: string;
  subtitle?: string;
  preamble: string;
  effectiveDate: string;
  recitals?: string[];
  sections: DocumentSection[];
  signatureBlocks: DocumentSignatureBlock[];
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  label: string;
  summary: string;
  timestamp: string;
  content: DocumentContent;
}

export interface BrandSettings {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  fontFamily: 'Inter' | 'Merriweather' | 'Playfair Display' | 'Roboto';
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
}

export interface LegalDocument {
  id: string;
  userId: string;
  templateId: string;
  templateCategory: TemplateCategory;
  title: string;
  status: DocumentStatus;
  content: DocumentContent;
  keyTerms: Record<string, string>;
  branding: BrandSettings;
  versions: DocumentVersion[];
  isFavorite: boolean;
  formData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'radio';
  placeholder?: string;
  defaultValue?: string | number;
  options?: { label: string; value: string }[];
  required?: boolean;
  helpText?: string;
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  fields: QuestionnaireField[];
}

export interface LegalTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  icon: string;
  estimatedMinutes: number;
  isPopular?: boolean;
  isPublished: boolean;
  steps: QuestionnaireStep[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  company: string;
  avatarUrl: string;
  plan: 'Free' | 'Pro' | 'Business';
  documentsCreatedThisMonth: number;
  monthlyLimit: number;
}
