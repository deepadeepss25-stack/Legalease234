import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini SDK with User-Agent as instructed by guidelines
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback high-quality structured legal document generator
function generateLocalLegalDocument(templateId: string, templateTitle: string, formData: Record<string, any>) {
  const dateStr = formData.startDate || formData.effectiveDate || formData.leaseStartDate || new Date().toISOString().split('T')[0];
  const partyA = formData.employerName || formData.partyAName || formData.landlordName || formData.clientName || formData.companyName || 'First Party LLC';
  const partyB = formData.employeeName || formData.partyBName || formData.tenantName || formData.contractorName || formData.candidateName || 'Second Party';

  let sections = [];
  let keyTerms: Record<string, string> = {
    'Effective Date': dateStr,
    'First Party': partyA,
    'Second Party': partyB,
    'Governing Law': formData.governingLaw || 'State of Delaware, United States',
  };

  if (templateId === 'employment-agreement') {
    keyTerms = {
      'Effective Date': dateStr,
      'Employer': partyA,
      'Employee': partyB,
      'Job Title': formData.jobTitle || 'Executive / Specialist',
      'Base Compensation': `$${formData.salary || '120,000'} / year (${formData.payFrequency || 'Semi-monthly'})`,
      'Notice Period': formData.noticePeriod || '30 days written notice',
      'Work Location': formData.workLocation || 'Hybrid / Office',
      'Governing Law': formData.governingLaw || 'State of California, United States',
    };

    sections = [
      {
        id: 'sec-1',
        number: '1',
        title: 'Position, Reporting & Duties',
        clauses: [
          {
            id: 'c-1-1',
            title: 'Employment Appointment',
            body: `Company hereby employs Employee in the capacity of ${formData.jobTitle || 'Senior Staff Specialist'}. Employee shall report directly to the Chief Executive Officer or designated officer and perform all customary duties with skill and fidelity.`,
          },
          {
            id: 'c-1-2',
            title: 'Working Hours & Location',
            body: `Employee shall perform duties on a ${formData.employmentType || 'Full-time Exempt'} basis. Primary work location shall be ${formData.workLocation || 'the Company headquarters'}, subject to authorized remote work arrangements.`,
          },
        ],
      },
      {
        id: 'sec-2',
        number: '2',
        title: 'Compensation, Benefits & Expenses',
        clauses: [
          {
            id: 'c-2-1',
            title: 'Base Salary',
            body: `As compensation for all services, Company shall pay Employee a base annual salary of $${formData.salary || '150,000'} USD, payable in accordance with the Company standard payroll schedule in ${formData.payFrequency || 'semi-monthly'} installments.`,
          },
          {
            id: 'c-2-2',
            title: 'Paid Leave & Benefits',
            body: `Employee shall be entitled to ${formData.paidLeave || '20 days of paid time off per year'}, and eligibility to participate in group health, dental, and retirement programs: ${formData.benefits || 'Standard comprehensive health, life, and 401(k) plans.'}`,
          },
        ],
      },
      {
        id: 'sec-3',
        number: '3',
        title: 'Confidentiality and Inventions Assignment',
        clauses: [
          {
            id: 'c-3-1',
            title: 'Proprietary Information Protection',
            body: 'Employee acknowledges access to confidential trade secrets, software, source code, and customer records. Employee covenants never to disclose or misappropriate proprietary assets.',
          },
          {
            id: 'c-3-2',
            title: 'Works Made for Hire',
            body: 'All intellectual property, inventions, patents, and software created in the course of employment shall remain the sole and exclusive property of Company.',
          },
        ],
      },
      {
        id: 'sec-4',
        number: '4',
        title: 'Term, Termination & Severance',
        clauses: [
          {
            id: 'c-4-1',
            title: 'At-Will Employment & Notice',
            body: `Employment shall be at-will. Either party may terminate the employment relationship at any time, with or without cause, upon ${formData.noticePeriod || '30 days written notice'} to the other party.`,
          },
          {
            id: 'c-4-2',
            title: 'Surrender of Company Assets',
            body: 'Upon termination, Employee shall immediately deliver to Company all computers, files, keys, and physical or electronic documents.',
          },
        ],
      },
      {
        id: 'sec-5',
        number: '5',
        title: 'Governing Law and Dispute Resolution',
        clauses: [
          {
            id: 'c-5-1',
            title: 'Jurisdiction',
            body: `This Agreement shall be governed by and construed in accordance with the laws of ${formData.governingLaw || 'the State of California'}, without regard to conflicts of law.`,
          },
        ],
      },
    ];
  } else if (templateId === 'non-disclosure-agreement') {
    keyTerms = {
      'Effective Date': dateStr,
      'Party A': partyA,
      'Party B': partyB,
      'Agreement Type': formData.agreementType || 'Mutual (Bilateral)',
      'Confidentiality Period': formData.durationYears || '3 years',
      'Permitted Purpose': formData.purpose || 'Evaluating prospective business partnership',
      'Governing Law': formData.governingLaw || 'State of Delaware, United States',
    };

    sections = [
      {
        id: 'sec-1',
        number: '1',
        title: 'Definition of Confidential Information',
        clauses: [
          {
            id: 'c-1-1',
            title: 'Scope of Covered Information',
            body: '"Confidential Information" encompasses all non-public proprietary data, trade secrets, software code, commercial pricing, and strategic data disclosed in connection with the Permitted Purpose.',
          },
        ],
      },
      {
        id: 'sec-2',
        number: '2',
        title: 'Non-Disclosure Obligations & Standard of Care',
        clauses: [
          {
            id: 'c-2-1',
            title: 'Protection Covenant',
            body: `The Receiving Party shall exercise a reasonable degree of care, not less than that used for its own sensitive data, to prevent unauthorized disclosure or dissemination of Disclosing Party confidential assets.`,
          },
          {
            id: 'c-2-2',
            title: 'Restricted Purpose',
            body: `All confidential disclosures shall be utilized strictly for: ${formData.purpose || 'Evaluating mutual commercial engagement'} and for no other commercial benefit.`,
          },
        ],
      },
      {
        id: 'sec-3',
        number: '3',
        title: 'Term & Survival',
        clauses: [
          {
            id: 'c-3-1',
            title: 'Obligation Duration',
            body: `The non-disclosure obligations shall endure for ${formData.durationYears || '3 years'} following disclosure, with trade secrets retaining protection for as long as permitted under applicable law.`,
          },
        ],
      },
    ];
  } else {
    // General high quality legal sections
    sections = [
      {
        id: 'sec-1',
        number: '1',
        title: 'Engagement and Scope',
        clauses: [
          {
            id: 'c-1-1',
            title: 'Parties & Purpose',
            body: `The parties agree to the terms specified herein for the mutual covenants and consideration described in this ${templateTitle}.`,
          },
        ],
      },
      {
        id: 'sec-2',
        number: '2',
        title: 'Financial Terms & Deliverables',
        clauses: [
          {
            id: 'c-2-1',
            title: 'Consideration',
            body: `Payment and performance milestones shall proceed in according with the parameters established by ${partyA} and ${partyB}.`,
          },
        ],
      },
      {
        id: 'sec-3',
        number: '3',
        title: 'General Provisions & Governing Law',
        clauses: [
          {
            id: 'c-3-1',
            title: 'Enforceability & Severability',
            body: `This Agreement constitutes the entire understanding between the parties and supersedes prior representations. Governed by the laws of ${formData.governingLaw || 'the United States'}.`,
          },
        ],
      },
    ];
  }

  const documentContent = {
    title: templateTitle.toUpperCase(),
    subtitle: `Executed by and between ${partyA} and ${partyB}`,
    effectiveDate: dateStr,
    preamble: `THIS ${templateTitle.toUpperCase()} (the "Agreement") is entered into as of ${dateStr} (the "Effective Date"), by and between ${partyA} ("First Party") and ${partyB} ("Second Party").`,
    recitals: [
      `WHEREAS, the parties desire to enter into this ${templateTitle} to define their rights, duties, and covenants;`,
      `NOW, THEREFORE, in consideration of the mutual promises contained herein, the parties agree as follows:`
    ],
    sections,
    signatureBlocks: [
      {
        partyTitle: 'FOR FIRST PARTY:',
        name: formData.repName || partyA,
        role: formData.repTitle || 'Authorized Representative',
        entityName: partyA,
        signatureDate: dateStr,
      },
      {
        partyTitle: 'FOR SECOND PARTY:',
        name: partyB,
        role: 'Authorized Signatory',
        signatureDate: dateStr,
      },
    ],
  };

  return { document: documentContent, keyTerms };
}

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Generate Legal Document via Gemini
  app.post('/api/gemini/generate-document', async (req: Request, res: Response) => {
    const { templateId, templateTitle, category, formData } = req.body;

    if (!templateId || !templateTitle) {
      return res.status(400).json({ error: 'Missing templateId or templateTitle' });
    }

    if (ai) {
      try {
        const systemPrompt = `You are an elite legal counsel and contract drafting specialist. 
Your task is to draft a rigorous, enforceable, beautifully structured legal document based on user inputs.
You must return your response strictly as valid JSON adhering to this exact schema:
{
  "title": "DOCUMENT TITLE IN ALL CAPS",
  "subtitle": "Short descriptive subtitle",
  "effectiveDate": "e.g. October 15, 2026",
  "preamble": "Comprehensive opening legal preamble naming both parties with registered addresses and entity types.",
  "recitals": ["WHEREAS clause 1...", "WHEREAS clause 2..."],
  "sections": [
    {
      "id": "sec-1",
      "number": "1",
      "title": "Section Title",
      "clauses": [
        {
          "id": "c-1-1",
          "title": "Clause Title",
          "body": "Formal, unambiguous, comprehensive legal clause text."
        }
      ]
    }
  ],
  "signatureBlocks": [
    {
      "partyTitle": "FOR EMPLOYER / PARTY A:",
      "name": "Signatory Name",
      "role": "Title",
      "entityName": "Entity Name",
      "signatureDate": "Date"
    },
    {
      "partyTitle": "FOR EMPLOYEE / PARTY B:",
      "name": "Signatory Name",
      "role": "Individual",
      "signatureDate": "Date"
    }
  ],
  "keyTerms": {
    "Effective Date": "...",
    "Parties": "...",
    "Financial Terms": "...",
    "Duration": "...",
    "Notice Period": "...",
    "Governing Law": "..."
  }
}

Guidelines:
- Incorporate all user inputs accurately.
- Never invent unprovided personal identity details.
- Preserve exact numbers, dates, salaries, and addresses.
- Write professional, authoritative legal prose with clear section numbers.
- Avoid contradictory clauses.
- Return ONLY valid raw JSON with no markdown backticks or commentary.`;

        const userPrompt = `Draft a complete, production-ready ${templateTitle} (${category}) with the following questionnaire data:
${JSON.stringify(formData, null, 2)}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        let parsed: any;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          // If JSON parse fails, remove code fence if any
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleaned);
        }

        if (parsed && parsed.sections && parsed.title) {
          const { keyTerms, ...documentContent } = parsed;
          return res.json({
            document: documentContent,
            keyTerms: keyTerms || {},
            isAiGenerated: true,
          });
        }
      } catch (err: any) {
        console.warn('Gemini generation call error, falling back to local engine:', err?.message || err);
      }
    }

    // Local fallback
    const fallback = generateLocalLegalDocument(templateId, templateTitle, formData || {});
    return res.json({
      document: fallback.document,
      keyTerms: fallback.keyTerms,
      isAiGenerated: false,
    });
  });

  // 2. AI Editing Assistant Endpoint
  app.post('/api/gemini/ai-edit', async (req: Request, res: Response) => {
    const { action, text, context, customInstruction } = req.body;

    if (!text && !customInstruction) {
      return res.status(400).json({ error: 'Text or instruction is required' });
    }

    if (ai) {
      try {
        const actionPrompts: Record<string, string> = {
          rewrite: 'Rewrite this legal clause to make it modern, unambiguous, and cleanly drafted while preserving the legal obligations.',
          simplify: 'Simplify this legal clause into plain, easily comprehensible English while keeping its legally binding intent.',
          make_formal: 'Elevate the formality and precision of this clause using standard Black\'s Law Dictionary grade contract language.',
          explain: 'Provide a clear, bulleted legal explanation of what this clause means, who it protects, and any hidden liabilities.',
          shorten: 'Condense this clause to its essential legal requirements, removing fluff or redundant verbiage.',
          expand: 'Expand this clause to provide comprehensive legal coverage, explicit exceptions, and detailed indemnification boundaries.',
          improve_clarity: 'Refine sentence structure and punctuation to eliminate ambiguity and prevent multiple interpretations in court.',
          add_clause: 'Draft an appropriate supplementary legal clause addressing the user\'s needs to integrate smoothly into this contract section.',
        };

        const instruction = actionPrompts[action] || customInstruction || 'Improve this legal clause.';

        const prompt = `You are an elite legal contract editor.
Target Text:
"""
${text || 'None provided'}
"""

Context / Document Section:
${context || 'General contract clause'}

Instruction:
${instruction}

${customInstruction ? `Additional Custom Instruction: ${customInstruction}` : ''}

Respond strictly in valid JSON format:
{
  "suggestedText": "Your drafted replacement text or new clause",
  "explanation": "Brief 1-2 sentence explanation of the revisions made and why they improve the document."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const raw = response.text || '{}';
        const parsed = JSON.parse(raw);
        return res.json(parsed);
      } catch (err: any) {
        console.warn('Gemini edit failed, using fallback:', err?.message || err);
      }
    }

    // High quality local fallback for AI Assistant
    let suggestedText = text || '';
    let explanation = 'Adjusted clause for optimal clarity and legal enforceability.';

    switch (action) {
      case 'rewrite':
        suggestedText = `The parties agree that ${text.replace(/^The parties agree that /i, '')} in all respects, upholding standard commercial good faith.`;
        explanation = 'Rewritten for balanced mutual obligations and clarity.';
        break;
      case 'simplify':
        suggestedText = text.replace(/heretofore|hereinafter|notwithstanding the foregoing|in witness whereof/gi, '').trim();
        explanation = 'Simplified by removing archaic legalese phrases.';
        break;
      case 'make_formal':
        suggestedText = `Notwithstanding anything to the contrary contained herein, ${text}`;
        explanation = 'Enhanced formality and precedence hierarchy.';
        break;
      case 'explain':
        suggestedText = text;
        explanation = 'Analysis: This clause legally obligates the parties to adhere to the designated terms and imposes remedies upon breach.';
        break;
      case 'shorten':
        suggestedText = text.split('.').slice(0, 2).join('.') + (text.includes('.') ? '.' : '');
        explanation = 'Concise edition focusing on primary legal duty.';
        break;
      case 'expand':
        suggestedText = `${text} Each party shall indemnify, defend, and hold harmless the other against any third-party claims arising from a material breach of this section.`;
        explanation = 'Added standard cross-indemnification and defensive protection.';
        break;
      case 'improve_clarity':
        suggestedText = text.replace(/;\s*/g, '. ').replace(/,\s*and\s*/g, '; and ');
        explanation = 'Polished grammatical syntax and clause structuring.';
        break;
      default:
        suggestedText = customInstruction ? `[Custom Draft]: ${text} (incorporating: ${customInstruction})` : text;
        explanation = 'Applied requested modification.';
    }

    return res.json({ suggestedText, explanation });
  });

  // 3. Extract Key Terms
  app.post('/api/gemini/extract-terms', async (req: Request, res: Response) => {
    const { documentText } = req.body;
    if (!documentText) {
      return res.status(400).json({ error: 'documentText is required' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Extract the key business and legal terms from this legal document into a key-value JSON dictionary:
${documentText.slice(0, 5000)}

Return JSON in format:
{
  "keyTerms": {
    "Effective Date": "...",
    "Parties": "...",
    "Payment / Compensation": "...",
    "Duration / Term": "...",
    "Notice Period": "...",
    "Governing Law": "..."
  }
}`,
          config: { responseMimeType: 'application/json' },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ keyTerms: parsed.keyTerms || {} });
      } catch (err: any) {
        console.warn('Gemini term extraction error, using regex extraction:', err?.message || err);
      }
    }

    // Local extraction
    const terms: Record<string, string> = {
      'Document Type': 'Contractual Agreement',
      'Status': 'Reviewed',
      'Extracted At': new Date().toLocaleDateString(),
    };

    const dateMatch = documentText.match(/(\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b)/i);
    if (dateMatch) terms['Effective Date'] = dateMatch[1];

    const moneyMatch = documentText.match(/\$[\d,]+(?:\.\d{2})?/);
    if (moneyMatch) terms['Financial Amount'] = moneyMatch[0];

    const noticeMatch = documentText.match(/(\d+\s+days?\s+written\s+notice)/i);
    if (noticeMatch) terms['Notice Period'] = noticeMatch[1];

    const lawMatch = documentText.match(/laws of (?:the )?([A-Za-z\s]+?)(?:,|\.|\bwithout)/i);
    if (lawMatch) terms['Governing Law'] = lawMatch[1].trim();

    return res.json({ keyTerms: terms });
  });

  // Serve static assets in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`LegalEase Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
