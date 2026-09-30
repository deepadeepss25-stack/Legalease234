import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  Undo2,
  Redo2,
  Sparkles,
  Download,
  Share2,
  Printer,
  Check,
  Search,
  Replace,
  Plus,
  Trash2,
  ChevronRight,
  Shield,
  Clock,
  Eye,
  Settings,
  Sliders,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  HelpCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { LegalDocument, DocumentSection, DocumentClause, BrandSettings } from '../types';
import {
  saveDocument,
  createDocumentVersion,
  restoreDocumentVersion,
} from '../services/storage';
import { executeAiEdit, extractKeyTermsWithAi } from '../services/aiService';
import { useToast } from '../components/Toast';
import { ExportModal } from '../components/ExportModal';

interface DocumentEditorViewProps {
  document: LegalDocument;
  onBack: () => void;
  onRefreshDoc: (updatedDoc: LegalDocument) => void;
}

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({
  document: initialDoc,
  onBack,
  onRefreshDoc,
}) => {
  const [doc, setDoc] = useState<LegalDocument>(initialDoc);
  const [activeTab, setActiveTab] = useState<'ai' | 'terms' | 'branding' | 'history'>('ai');
  
  // Right sidebar drawer on smaller screens or toggleable
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftOutline, setShowLeftOutline] = useState(true);

  // Undo / Redo history
  const [historyStack, setHistoryStack] = useState<LegalDocument[]>([initialDoc]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Autosave status state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  // Search and Find & Replace
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  // AI Assistant states
  const [selectedText, setSelectedText] = useState('');
  const [selectedContext, setSelectedContext] = useState('');
  const [customAiInstruction, setCustomAiInstruction] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [proposedChange, setProposedChange] = useState<{
    originalText: string;
    suggestedText: string;
    explanation: string;
    sectionId?: string;
    clauseId?: string;
  } | null>(null);

  // Export Modal
  const [showExportModal, setShowExportModal] = useState(false);

  const { showToast } = useToast();
  const documentRef = useRef<HTMLDivElement>(null);

  // Sync state if initialDoc changes
  useEffect(() => {
    setDoc(initialDoc);
  }, [initialDoc.id]);

  // Update doc with history tracking
  const updateDocWithHistory = (newDoc: LegalDocument, skipHistory = false) => {
    setDoc(newDoc);
    setSaveStatus('dirty');

    if (!skipHistory) {
      const nextStack = historyStack.slice(0, historyIndex + 1);
      nextStack.push(JSON.parse(JSON.stringify(newDoc)));
      setHistoryStack(nextStack);
      setHistoryIndex(nextStack.length - 1);
    }

    // Debounced autosave
    triggerAutosave(newDoc);
  };

  const saveTimeoutRef = useRef<any>(null);
  const triggerAutosave = (docToSave: LegalDocument) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus('saving');
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(docToSave);
      setSaveStatus('saved');
      onRefreshDoc(docToSave);
    }, 1000);
  };

  const handleManualSave = () => {
    saveDocument(doc);
    setSaveStatus('saved');
    showToast('Saved just now ✓', 'success');
    onRefreshDoc(doc);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const target = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDoc(JSON.parse(JSON.stringify(target)));
      saveDocument(target);
      setSaveStatus('saved');
      showToast('Undo applied', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const target = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDoc(JSON.parse(JSON.stringify(target)));
      saveDocument(target);
      setSaveStatus('saved');
      showToast('Redo applied', 'info');
    }
  };

  // Clause editing
  const handleClauseChange = (secIdx: number, clauseIdx: number, newBody: string) => {
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    updated.content.sections[secIdx].clauses[clauseIdx].body = newBody;
    updateDocWithHistory(updated);
  };

  const handleClauseTitleChange = (secIdx: number, clauseIdx: number, newTitle: string) => {
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    updated.content.sections[secIdx].clauses[clauseIdx].title = newTitle;
    updateDocWithHistory(updated);
  };

  // Add clause to section
  const handleAddClause = (secIdx: number) => {
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    const clauseNum = updated.content.sections[secIdx].clauses.length + 1;
    const newClause: DocumentClause = {
      id: `c-${secIdx + 1}-${clauseNum}-${Date.now().toString(36)}`,
      title: 'Additional Covenant',
      body: 'The parties mutually agree to maintain compliance with all relevant regulatory guidelines in connection with this section.',
    };
    updated.content.sections[secIdx].clauses.push(newClause);
    updateDocWithHistory(updated);
    showToast('New clause added to section', 'success');
  };

  // Remove clause
  const handleRemoveClause = (secIdx: number, clauseIdx: number) => {
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    updated.content.sections[secIdx].clauses.splice(clauseIdx, 1);
    updateDocWithHistory(updated);
    showToast('Clause removed', 'info');
  };

  // Add new section
  const handleAddSection = () => {
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    const secNum = updated.content.sections.length + 1;
    const newSection: DocumentSection = {
      id: `sec-${secNum}-${Date.now().toString(36)}`,
      number: String(secNum),
      title: 'Miscellaneous & Additional Provisions',
      clauses: [
        {
          id: `c-${secNum}-1-${Date.now().toString(36)}`,
          title: 'Notices & Communications',
          body: 'All formal legal notices required under this Agreement shall be delivered in writing via certified mail or tracked courier to the respective registered addresses.',
        },
      ],
    };
    updated.content.sections.push(newSection);
    updateDocWithHistory(updated);
    showToast('New section created', 'success');
  };

  // Scroll to section
  const scrollToSection = (secId: string) => {
    const el = document.getElementById(`doc-sec-${secId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Text selection handler for AI assistant
  const handleTextSelection = (secId?: string, clauseId?: string) => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';
    if (text) {
      setSelectedText(text);
      setSelectedContext(`Section ${secId || ''}, Clause ${clauseId || ''}`);
      setActiveTab('ai');
      setShowRightPanel(true);
    }
  };

  // AI Assistant action executor
  const handleAiAction = async (action: 'rewrite' | 'simplify' | 'make_formal' | 'explain' | 'shorten' | 'expand' | 'improve_clarity' | 'add_clause') => {
    setIsAiLoading(true);
    try {
      const targetText = selectedText || doc.content.sections[0]?.clauses[0]?.body || '';
      const result = await executeAiEdit({
        action,
        text: targetText,
        context: selectedContext || 'Legal agreement clause',
        customInstruction: customAiInstruction,
      });

      setProposedChange({
        originalText: targetText,
        suggestedText: result.suggestedText,
        explanation: result.explanation,
      });

      showToast('AI proposed replacement ready for review', 'info');
    } catch (err: any) {
      showToast(`AI Assistant error: ${err.message || 'Failed to edit'}`, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Accept AI Changes
  const handleAcceptAiChange = () => {
    if (!proposedChange) return;

    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    let replaced = false;

    // Search and replace across sections
    for (const sec of updated.content.sections) {
      for (const clause of sec.clauses) {
        if (clause.body.includes(proposedChange.originalText)) {
          clause.body = clause.body.replace(proposedChange.originalText, proposedChange.suggestedText);
          replaced = true;
          break;
        }
      }
      if (replaced) break;
    }

    if (!replaced) {
      // If exact string was not found, replace the first clause or append
      if (updated.content.sections[0]?.clauses[0]) {
        updated.content.sections[0].clauses[0].body = proposedChange.suggestedText;
      }
    }

    updateDocWithHistory(updated);
    setProposedChange(null);
    setSelectedText('');
    setCustomAiInstruction('');
    showToast('Changes accepted and applied to document ✓', 'success');
  };

  // Reject AI Changes
  const handleRejectAiChange = () => {
    setProposedChange(null);
    showToast('Proposed AI changes rejected', 'info');
  };

  // Find & Replace
  const handleExecuteReplace = () => {
    if (!findText) return;
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    let count = 0;

    for (const sec of updated.content.sections) {
      for (const clause of sec.clauses) {
        if (clause.body.includes(findText)) {
          clause.body = clause.body.replaceAll(findText, replaceText);
          count++;
        }
      }
    }

    if (count > 0) {
      updateDocWithHistory(updated);
      showToast(`Replaced ${count} occurrence(s)`, 'success');
    } else {
      showToast('No matching text found', 'info');
    }
  };

  // Branding updates
  const handleUpdateBranding = (updates: Partial<BrandSettings>) => {
    const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
    updated.branding = { ...updated.branding, ...updates };
    updateDocWithHistory(updated);
  };

  // Create Version Snapshot
  const handleCreateSnapshot = () => {
    const summary = prompt('Enter a brief summary for this revision version:', 'Manual edits and review');
    if (summary !== null) {
      createDocumentVersion(doc.id, summary);
      const reloaded = saveDocument(doc);
      setDoc(reloaded);
      onRefreshDoc(reloaded);
      showToast('Version snapshot created!', 'success');
    }
  };

  // Restore Version
  const handleRestoreVersion = (versionId: string) => {
    if (confirm('Restore document to this previous version? Current unsaved work will be preserved as a new version.')) {
      const restored = restoreDocumentVersion(doc.id, versionId);
      if (restored) {
        setDoc(restored);
        onRefreshDoc(restored);
        showToast('Document restored to selected version ✓', 'success');
      }
    }
  };

  // Print Document directly
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ─────────────────────────────────────────────────────────────
          TOP WORKSPACE TOOLBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        {/* Left: Back & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={doc.title}
              onChange={e => {
                const updated = { ...doc, title: e.target.value };
                updateDocWithHistory(updated);
              }}
              className="font-bold text-sm sm:text-base text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-all truncate max-w-xs sm:max-w-md"
            />
            {/* Status indicator */}
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                saveStatus === 'saved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              {saveStatus === 'saved' ? 'Saved just now ✓' : 'Saving...'}
            </span>
          </div>
        </div>

        {/* Center: Formatting & Find / Replace shortcuts */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= historyStack.length - 1}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-300 mx-1" />

          <button
            onClick={() => setShowFindReplace(!showFindReplace)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              showFindReplace ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
            title="Find & Replace"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find</span>
          </button>
        </div>

        {/* Right: AI Assistant, Save, Export */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Toggle Button */}
          <button
            onClick={() => {
              setActiveTab('ai');
              setShowRightPanel(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Manual Save */}
          <button
            onClick={handleManualSave}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Save Document"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Export Dropdown / Trigger */}
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Find and Replace Drawer */}
      {showFindReplace && (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center gap-3 animate-in slide-in-from-top-1 duration-150 z-30">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find in document..."
              value={findText}
              onChange={e => setFindText(e.target.value)}
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg w-48 sm:w-60 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Replace className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceText}
              onChange={e => setReplaceText(e.target.value)}
              className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg w-48 sm:w-60 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleExecuteReplace}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowFindReplace(false)}
            className="text-xs text-slate-400 hover:text-slate-600 ml-auto"
          >
            Close
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN 3-COLUMN WORKSPACE
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT COLUMN: SECTIONS NAVIGATION ── */}
        <aside
          className={`w-64 bg-white border-r border-slate-200/80 shrink-0 hidden md:flex flex-col justify-between transition-all duration-200 ${
            showLeftOutline ? '' : 'w-12'
          }`}
        >
          <div className="p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sections ({doc.content.sections.length})
              </span>
              <button
                onClick={handleAddSection}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                title="Add New Section"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-1">
              {doc.content.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs"
                >
                  <span className="font-mono text-slate-400 font-semibold">{sec.number}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{sec.title}</p>
                    <p className="text-[11px] text-slate-400">{sec.clauses.length} clause(s)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Version Snapshot trigger */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleCreateSnapshot}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Save Version Snapshot</span>
            </button>
          </div>
        </aside>

        {/* ── CENTER COLUMN: WHITE DOCUMENT SHEET ON LIGHT-GRAY WORKSPACE ── */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex justify-center bg-slate-100"
          onMouseUp={() => handleTextSelection()}
        >
          {/* Printable Page Sheet */}
          <div
            ref={documentRef}
            style={{
              fontFamily:
                doc.branding.fontFamily === 'Merriweather'
                  ? 'Merriweather, serif'
                  : doc.branding.fontFamily === 'Playfair Display'
                  ? '"Playfair Display", serif'
                  : 'Inter, sans-serif',
            }}
            className="w-full max-w-3xl bg-white shadow-xl rounded-sm border border-slate-200/80 p-8 sm:p-14 lg:p-16 space-y-8 text-slate-800 transition-all min-h-[1050px] relative"
          >
            {/* Brand Header Bar */}
            {doc.branding.showHeader && (
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-2xs"
                    style={{ backgroundColor: doc.branding.primaryColor || '#2563EB' }}
                  >
                    {doc.branding.companyName ? doc.branding.companyName.charAt(0) : 'L'}
                  </div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {doc.branding.companyName || 'Corporate Entity'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Official Legal Instrument
                </span>
              </div>
            )}

            {/* Document Title Header */}
            <div className="text-center space-y-2 pt-2">
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase"
                style={{
                  borderBottom: `2px solid ${doc.branding.primaryColor || '#2563EB'}`,
                  display: 'inline-block',
                  paddingBottom: '4px',
                }}
              >
                {doc.content.title}
              </h1>
              {doc.content.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {doc.content.subtitle}
                </p>
              )}
              <p className="text-xs text-slate-400 font-mono pt-1">
                Effective Date: {doc.content.effectiveDate}
              </p>
            </div>

            {/* Preamble */}
            <div className="text-sm leading-relaxed text-slate-700 text-justify bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <p className="indent-6">{doc.content.preamble}</p>
            </div>

            {/* Recitals */}
            {doc.content.recitals && doc.content.recitals.length > 0 && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-600 italic">
                <p className="font-bold text-xs uppercase tracking-wider text-slate-500 not-italic">
                  Recitals
                </p>
                {doc.content.recitals.map((recital, idx) => (
                  <p key={idx} className="pl-4 border-l-2 border-slate-200">
                    {recital}
                  </p>
                ))}
              </div>
            )}

            {/* Sections & Clauses */}
            <div className="space-y-8 pt-4">
              {doc.content.sections.map((section, secIdx) => (
                <div
                  key={section.id}
                  id={`doc-sec-${section.id}`}
                  className="space-y-4 pt-4 border-t border-slate-100 scroll-mt-20 group/sec"
                >
                  {/* Section Title */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span className="text-blue-600 font-mono">{section.number}.</span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
                          updated.content.sections[secIdx].title = e.target.value;
                          updateDocWithHistory(updated);
                        }}
                        className="bg-transparent font-bold hover:bg-slate-50 focus:bg-white px-1 rounded border border-transparent focus:border-blue-500 focus:outline-none"
                      />
                    </h2>

                    <button
                      onClick={() => handleAddClause(secIdx)}
                      className="opacity-0 group-hover/sec:opacity-100 transition-opacity text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      title="Add Clause"
                    >
                      <Plus className="w-3.5 h-3.5" /> Clause
                    </button>
                  </div>

                  {/* Clauses list */}
                  <div className="space-y-4">
                    {section.clauses.map((clause, clauseIdx) => (
                      <div
                        key={clause.id}
                        className="group/clause relative p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-200"
                        onMouseUp={() => handleTextSelection(section.number, clause.id)}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="text-slate-400 font-mono text-[11px]">
                              {section.number}.{clauseIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={clause.title}
                              onChange={e =>
                                handleClauseTitleChange(secIdx, clauseIdx, e.target.value)
                              }
                              className="bg-transparent font-bold hover:bg-white focus:bg-white px-1 py-0.5 rounded border border-transparent focus:border-blue-500 focus:outline-none"
                            />
                          </span>

                          <div className="flex items-center gap-1 opacity-0 group-hover/clause:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSelectedText(clause.body);
                                setSelectedContext(`Section ${section.number}: ${clause.title}`);
                                setActiveTab('ai');
                                setShowRightPanel(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Send to AI Assistant"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveClause(secIdx, clauseIdx)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Clause"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Editable Clause Body */}
                        <textarea
                          rows={Math.max(2, Math.ceil(clause.body.length / 80))}
                          value={clause.body}
                          onChange={e => handleClauseChange(secIdx, clauseIdx, e.target.value)}
                          className="w-full text-xs sm:text-sm text-slate-700 leading-relaxed bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-blue-500/30 p-1.5 rounded-lg border border-transparent hover:border-slate-200/60"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Block */}
            {doc.content.signatureBlocks && doc.content.signatureBlocks.length > 0 && (
              <div className="pt-10 border-t-2 border-slate-200 space-y-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  {doc.content.signatureBlocks.map((sig, idx) => (
                    <div key={idx} className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-900">{sig.partyTitle}</p>
                      <div className="border-b border-slate-300 pt-8" />
                      <div className="space-y-1 text-xs text-slate-700">
                        <p>
                          <span className="text-slate-400">By:</span> <strong>{sig.name}</strong>
                        </p>
                        {sig.role && (
                          <p>
                            <span className="text-slate-400">Title:</span> {sig.role}
                          </p>
                        )}
                        {sig.entityName && (
                          <p>
                            <span className="text-slate-400">Entity:</span> {sig.entityName}
                          </p>
                        )}
                        <p>
                          <span className="text-slate-400">Date:</span> {sig.signatureDate || doc.content.effectiveDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Footer */}
            {doc.branding.showFooter && (
              <div className="pt-8 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{doc.branding.companyName || 'CONFIDENTIAL'}</span>
                {doc.branding.showPageNumbers && <span>Page 1 of 1</span>}
                <span>STRICTLY CONFIDENTIAL</span>
              </div>
            )}
          </div>
        </main>

        {/* ── RIGHT COLUMN: AI ASSISTANT, KEY TERMS, BRANDING, VERSION HISTORY ── */}
        <aside
          className={`w-80 lg:w-96 bg-white border-l border-slate-200/80 shrink-0 flex flex-col justify-between transition-all duration-200 ${
            showRightPanel ? '' : 'hidden'
          }`}
        >
          {/* Right Header Navigation Tabs */}
          <div>
            <div className="flex items-center justify-between px-3 border-b border-slate-200/80 bg-slate-50/75">
              <div className="flex items-center">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'ai'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Assistant
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'terms'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Key Terms
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'branding'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Branding
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'history'
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  History
                </button>
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)] space-y-5">
              {/* ──────────────────────────────────
                  TAB 1: AI ASSISTANT PANEL
              ────────────────────────────────── */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      LegalEase AI Assistant
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select text in the document sheet, then choose an AI refinement action.
                    </p>
                  </div>

                  {/* Target text snippet */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Target Clause / Text
                    </span>
                    <p className="text-xs text-slate-700 italic line-clamp-3">
                      "{selectedText || doc.content.sections[0]?.clauses[0]?.body || 'Highlight any clause to target'}"
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                      Quick Legal Actions
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAiAction('rewrite')}
                        disabled={isAiLoading}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all text-left shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Rewrite
                      </button>
                      <button
                        onClick={() => handleAiAction('simplify')}
                        disabled={isAiLoading}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all text-left shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Simplify
                      </button>
                      <button
                        onClick={() => handleAiAction('make_formal')}
                        disabled={isAiLoading}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all text-left shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Make Formal
                      </button>
                      <button
                        onClick={() => handleAiAction('explain')}
                        disabled={isAiLoading}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all text-left shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Explain Clause
                      </button>
                      <button
                        onClick={() => handleAiAction('shorten')}
                        disabled={isAiLoading}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all text-left shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Shorten
                      </button>
                      <button
                        onClick={() => handleAiAction('expand')}
                        disabled={isAiLoading}
                        className="p-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all text-left shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Expand & Protect
                      </button>
                    </div>
                  </div>

                  {/* Custom Instruction Box */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                      Custom Instruction
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Add 14-day cure period for default..."
                      value={customAiInstruction}
                      onChange={e => setCustomAiInstruction(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-900"
                    />
                    <button
                      onClick={() => handleAiAction('add_clause')}
                      disabled={isAiLoading || !customAiInstruction}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Draft Custom Clause</span>
                    </button>
                  </div>

                  {/* Proposed Changes Diff Card (Never auto-overwrites without confirmation!) */}
                  {proposedChange && (
                    <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          Proposed AI Replacement
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-blue-100 text-xs text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                        {proposedChange.suggestedText}
                      </div>

                      <p className="text-[11px] text-blue-800 leading-tight">
                        <strong>Rationale:</strong> {proposedChange.explanation}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleAcceptAiChange}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept Changes
                        </button>
                        <button
                          onClick={handleRejectAiChange}
                          className="flex-1 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────────────────────────
                  TAB 2: KEY TERMS PANEL
              ────────────────────────────────── */}
              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Extracted Key Terms</h3>
                      <p className="text-xs text-slate-500">Core parameters extracted from clauses</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {Object.entries(doc.keyTerms).map(([key, val]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {key}
                        </span>
                        <input
                          type="text"
                          value={val}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(doc)) as LegalDocument;
                            updated.keyTerms[key] = e.target.value;
                            updateDocWithHistory(updated);
                          }}
                          className="w-full text-xs font-semibold text-slate-800 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Auto-refresh terms button */}
                  <button
                    onClick={async () => {
                      const allText = doc.content.sections
                        .map(s => s.clauses.map(c => `${c.title}: ${c.body}`).join('\n'))
                        .join('\n\n');
                      showToast('Re-extracting key terms with AI...', 'info');
                      const terms = await extractKeyTermsWithAi(allText);
                      const updated = { ...doc, keyTerms: { ...doc.keyTerms, ...terms } };
                      updateDocWithHistory(updated);
                      showToast('Key terms refreshed from document body', 'success');
                    }}
                    className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Sync Terms from Document
                  </button>
                </div>
              )}

              {/* ──────────────────────────────────
                  TAB 3: BRANDING CUSTOMIZATION
              ────────────────────────────────── */}
              {activeTab === 'branding' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Brand Settings</h3>
                    <p className="text-xs text-slate-500">Customize styling, headers, and company logo</p>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={doc.branding.companyName}
                      onChange={e => handleUpdateBranding({ companyName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Primary Color */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Primary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={doc.branding.primaryColor}
                        onChange={e => handleUpdateBranding({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={doc.branding.primaryColor}
                        onChange={e => handleUpdateBranding({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Font Family
                    </label>
                    <select
                      value={doc.branding.fontFamily}
                      onChange={e => handleUpdateBranding({ fontFamily: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                    >
                      <option value="Inter">Inter (Modern Clean Sans)</option>
                      <option value="Merriweather">Merriweather (Classic Legal Serif)</option>
                      <option value="Playfair Display">Playfair Display (Executive Editorial)</option>
                    </select>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="flex items-center justify-between text-xs text-slate-700 font-medium cursor-pointer">
                      <span>Show Company Header</span>
                      <input
                        type="checkbox"
                        checked={doc.branding.showHeader}
                        onChange={e => handleUpdateBranding({ showHeader: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs text-slate-700 font-medium cursor-pointer">
                      <span>Show Confidentiality Footer</span>
                      <input
                        type="checkbox"
                        checked={doc.branding.showFooter}
                        onChange={e => handleUpdateBranding({ showFooter: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs text-slate-700 font-medium cursor-pointer">
                      <span>Show Page Numbers</span>
                      <input
                        type="checkbox"
                        checked={doc.branding.showPageNumbers}
                        onChange={e => handleUpdateBranding({ showPageNumbers: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ──────────────────────────────────
                  TAB 4: VERSION HISTORY
              ────────────────────────────────── */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Version History</h3>
                      <p className="text-xs text-slate-500">Track and restore previous iterations</p>
                    </div>
                    <button
                      onClick={handleCreateSnapshot}
                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      + Save v{(doc.versions?.length || 0) + 1}
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {doc.versions?.map((ver, idx) => (
                      <div
                        key={ver.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                          idx === 0
                            ? 'bg-blue-50/50 border-blue-200'
                            : 'bg-white border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {ver.label} {idx === 0 && <span className="text-[10px] text-blue-600 uppercase tracking-wider ml-1 font-semibold">(Current)</span>}
                          </span>
                          {idx !== 0 && (
                            <button
                              onClick={() => handleRestoreVersion(ver.id)}
                              className="text-blue-600 hover:underline font-semibold text-[11px] cursor-pointer"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px] leading-snug">{ver.summary}</p>
                        <p className="text-slate-400 text-[10px]">
                          {new Date(ver.timestamp).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        document={doc}
      />
    </div>
  );
};
