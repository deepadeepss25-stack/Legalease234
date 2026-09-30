import { LegalDocument } from '../types';

export const SEED_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-emp-001',
    userId: 'user-001',
    templateId: 'employment-agreement',
    templateCategory: 'Employment',
    title: 'Employment Agreement — Julian Sterling',
    status: 'Ready',
    isFavorite: true,
    createdAt: '2026-09-28T14:30:00.000Z',
    updatedAt: '2026-09-29T16:15:00.000Z',
    formData: {
      employerName: 'Acme Corporation Inc.',
      employerAddress: '100 Market St, Suite 400, San Francisco, CA 94105',
      repName: 'Eleanor Vance',
      repTitle: 'Chief Executive Officer',
      employeeName: 'Julian M. Sterling',
      employeeAddress: '742 Evergreen Terrace, San Francisco, CA 94110',
      employeeEmail: 'julian.sterling@example.com',
      jobTitle: 'Senior Staff Software Engineer',
      startDate: '2026-10-15',
      employmentType: 'Full-time Exempt',
      salary: '165,000',
      payFrequency: 'Semi-monthly',
      workLocation: 'Hybrid (San Francisco HQ / Remote)',
      paidLeave: '20 days + standard federal holidays',
      benefits: 'Comprehensive health, dental, vision insurance and 401(k) plan with 4% company match.',
      noticePeriod: '30 days written notice',
      governingLaw: 'State of California, United States',
    },
    keyTerms: {
      'Effective Date': 'October 15, 2026',
      'Employee': 'Julian M. Sterling',
      'Employer': 'Acme Corporation Inc.',
      'Position': 'Senior Staff Software Engineer',
      'Base Compensation': '$165,000 / year (Semi-monthly)',
      'Notice Period': '30 days written notice',
      'Employment Type': 'Full-time Exempt',
      'Governing Law': 'State of California, United States',
    },
    branding: {
      companyName: 'Acme Corporation',
      primaryColor: '#2563EB',
      fontFamily: 'Inter',
      showHeader: true,
      showFooter: true,
      showPageNumbers: true,
    },
    versions: [
      {
        id: 'v1',
        versionNumber: 1,
        label: 'v1 — Initial AI Draft',
        summary: 'Generated baseline contract from questionnaire input.',
        timestamp: '2026-09-28T14:30:00.000Z',
        content: {} as any, // populated below
      },
      {
        id: 'v2',
        versionNumber: 2,
        label: 'v2 — Updated Termination & Benefits Clause',
        summary: 'Clarified 30 days mutual written notice and 401(k) vesting details.',
        timestamp: '2026-09-29T16:15:00.000Z',
        content: {} as any,
      }
    ],
    content: {
      title: 'EMPLOYMENT AGREEMENT',
      subtitle: 'Standard At-Will Employment Contract',
      effectiveDate: 'October 15, 2026',
      preamble: 'THIS EMPLOYMENT AGREEMENT (the "Agreement") is entered into as of October 15, 2026 (the "Effective Date"), by and between Acme Corporation Inc., a Delaware corporation having its principal office at 100 Market St, Suite 400, San Francisco, CA 94105 ("Employer" or "Company"), and Julian M. Sterling, an individual residing at 742 Evergreen Terrace, San Francisco, CA 94110 ("Employee").',
      recitals: [
        'WHEREAS, Employer is engaged in developing commercial software solutions and wishes to engage Employee to render technical leadership services;',
        'WHEREAS, Employee possesses valuable technical expertise and desires to be employed by Employer upon the terms and conditions set forth herein;'
      ],
      sections: [
        {
          id: 'sec-1',
          number: '1',
          title: 'Position and Duties',
          clauses: [
            {
              id: 'c-1-1',
              title: 'Title & Reporting',
              body: 'Employer hereby employs Employee as Senior Staff Software Engineer. Employee shall report directly to the Chief Technology Officer or such other executive as designated by Employer.'
            },
            {
              id: 'c-1-2',
              title: 'Best Efforts & Performance',
              body: 'Employee agrees to devote their full business time, attention, skill, and best efforts to the faithful performance of duties assigned by Company, adhering to all applicable company policies and ethical guidelines.'
            },
            {
              id: 'c-1-3',
              title: 'Work Location & Schedule',
              body: 'Employee will perform duties under a hybrid arrangement, based out of the Employer headquarters in San Francisco, CA, with remote work days permitted in accordance with Company remote-work policy.'
            }
          ]
        },
        {
          id: 'sec-2',
          number: '2',
          title: 'Compensation and Benefits',
          clauses: [
            {
              id: 'c-2-1',
              title: 'Base Salary',
              body: 'In consideration for the services rendered hereunder, Employer shall pay Employee a base annual salary of $165,000 USD, payable in accordance with the standard payroll practices of Employer in semi-monthly installments, subject to standard statutory withholdings.'
            },
            {
              id: 'c-2-2',
              title: 'Employee Benefits & Paid Leave',
              body: 'Employee shall be entitled to participate in all health, dental, and retirement welfare benefit programs established for full-time employees, including 20 days of annual paid time off (PTO) in addition to federal holidays.'
            }
          ]
        },
        {
          id: 'sec-3',
          number: '3',
          title: 'Intellectual Property and Confidentiality',
          clauses: [
            {
              id: 'c-3-1',
              title: 'Proprietary Information',
              body: 'Employee acknowledges that during employment they will have access to confidential proprietary information. Employee agrees not to disclose, copy, or use any Company Trade Secrets outside of their employment duties.'
            },
            {
              id: 'c-3-2',
              title: 'Inventions and Work for Hire',
              body: 'All inventions, works of authorship, designs, trade secrets, software code, and patentable developments created or authored by Employee during employment that relate to Company business are "works made for hire" and shall solely belong to Employer.'
            }
          ]
        },
        {
          id: 'sec-4',
          number: '4',
          title: 'Term and Termination',
          clauses: [
            {
              id: 'c-4-1',
              title: 'At-Will Status & Notice',
              body: 'Employment shall be at-will. Either party may terminate this employment relationship at any time, with or without cause, upon thirty (30) days prior written notice to the other party.'
            },
            {
              id: 'c-4-2',
              title: 'Return of Company Property',
              body: 'Upon cessation of employment for any reason, Employee shall immediately surrender all equipment, laptops, credentials, files, and proprietary data to Company.'
            }
          ]
        },
        {
          id: 'sec-5',
          number: '5',
          title: 'Governing Law and Dispute Resolution',
          clauses: [
            {
              id: 'c-5-1',
              title: 'Governing Jurisdiction',
              body: 'This Agreement shall be construed, interpreted, and governed in accordance with the substantive laws of the State of California, United States, without giving effect to conflicts of laws principles.'
            }
          ]
        }
      ],
      signatureBlocks: [
        {
          partyTitle: 'FOR EMPLOYER:',
          name: 'Eleanor Vance',
          role: 'Chief Executive Officer',
          entityName: 'Acme Corporation Inc.',
          signatureDate: '2026-10-01'
        },
        {
          partyTitle: 'EMPLOYEE:',
          name: 'Julian M. Sterling',
          role: 'Individual',
          signatureDate: '2026-10-02'
        }
      ]
    }
  },
  {
    id: 'doc-nda-002',
    userId: 'user-001',
    templateId: 'non-disclosure-agreement',
    templateCategory: 'Business',
    title: 'Bilateral NDA — Apex Ventures & Summit Robotics',
    status: 'Ready',
    isFavorite: false,
    createdAt: '2026-09-25T11:00:00.000Z',
    updatedAt: '2026-09-26T09:40:00.000Z',
    formData: {
      agreementType: 'Mutual (Bilateral)',
      partyAName: 'Apex Ventures LLC',
      partyAAddress: '500 5th Avenue, New York, NY 10110',
      partyBName: 'Summit Robotics Labs Inc.',
      partyBAddress: '120 Technology Way, Cambridge, MA 02139',
      purpose: 'Evaluating potential strategic partnership, equity investment, and co-development of autonomous software.',
      durationYears: '3 years',
      effectiveDate: '2026-10-01',
      governingLaw: 'State of Delaware, United States',
    },
    keyTerms: {
      'Effective Date': 'October 1, 2026',
      'Disclosing Party': 'Apex Ventures LLC',
      'Receiving Party': 'Summit Robotics Labs Inc.',
      'Agreement Structure': 'Mutual Bilateral Non-Disclosure',
      'Confidentiality Term': '3 years from disclosure',
      'Governing Law': 'State of Delaware, United States',
      'Permitted Purpose': 'Evaluation of strategic partnership and software co-development',
    },
    branding: {
      companyName: 'Apex Ventures',
      primaryColor: '#0F172A',
      fontFamily: 'Merriweather',
      showHeader: true,
      showFooter: true,
      showPageNumbers: true,
    },
    versions: [
      {
        id: 'v1',
        versionNumber: 1,
        label: 'v1 — Baseline Bilateral Agreement',
        summary: 'Standard 3-year mutual confidentiality covenant.',
        timestamp: '2026-09-25T11:00:00.000Z',
        content: {} as any,
      }
    ],
    content: {
      title: 'MUTUAL NON-DISCLOSURE AGREEMENT',
      subtitle: 'Bilateral Proprietary Information Protection Agreement',
      effectiveDate: 'October 1, 2026',
      preamble: 'THIS MUTUAL NON-DISCLOSURE AGREEMENT (the "Agreement") is made effective as of October 1, 2026, by and between Apex Ventures LLC ("Party A") and Summit Robotics Labs Inc. ("Party B"). Each of Party A and Party B may be referred to individually as a "Party" and collectively as the "Parties".',
      recitals: [
        'WHEREAS, the Parties wish to explore and evaluate a prospective commercial collaboration, equity financing, and strategic technical alignment (the "Permitted Purpose");',
        'WHEREAS, in the course of discussions each Party may disclose to the other confidential technical, financial, and operational information.'
      ],
      sections: [
        {
          id: 'sec-1',
          number: '1',
          title: 'Definition of Confidential Information',
          clauses: [
            {
              id: 'c-1-1',
              title: 'Scope of Proprietary Data',
              body: '"Confidential Information" means any non-public information disclosed by one Party to the other, whether orally, in writing, electronically, or by inspection of tangible objects, including software architecture, business plans, algorithms, and customer lists.'
            }
          ]
        },
        {
          id: 'sec-2',
          number: '2',
          title: 'Obligations of Receiving Party',
          clauses: [
            {
              id: 'c-2-1',
              title: 'Standard of Care',
              body: 'The Receiving Party agrees to protect the Confidential Information using at least the same degree of care it uses to protect its own sensitive data, but not less than reasonable care.'
            },
            {
              id: 'c-2-2',
              title: 'Non-Disclosure & Permitted Use',
              body: 'The Receiving Party shall not use Confidential Information for any purpose outside the Permitted Purpose or disclose it to any third party without prior written consent.'
            }
          ]
        },
        {
          id: 'sec-3',
          number: '3',
          title: 'Term and Governing Law',
          clauses: [
            {
              id: 'c-3-1',
              title: 'Survival Duration',
              body: 'The non-disclosure obligations under this Agreement shall survive for a period of three (3) years following disclosure; provided, however, that trade secrets shall remain confidential perpetually.'
            },
            {
              id: 'c-3-2',
              title: 'Governing Law',
              body: 'This Agreement shall be governed exclusively by the laws of the State of Delaware, United States.'
            }
          ]
        }
      ],
      signatureBlocks: [
        {
          partyTitle: 'PARTY A:',
          name: 'Alexander Sterling',
          role: 'Managing Partner',
          entityName: 'Apex Ventures LLC',
          signatureDate: '2026-10-01'
        },
        {
          partyTitle: 'PARTY B:',
          name: 'Dr. Clara Lin',
          role: 'Chief Technology Officer',
          entityName: 'Summit Robotics Labs Inc.',
          signatureDate: '2026-10-01'
        }
      ]
    }
  },
  {
    id: 'doc-lease-003',
    userId: 'user-001',
    templateId: 'residential-lease-agreement',
    templateCategory: 'Real Estate',
    title: 'Residential Lease — 1850 Pine Street, Apt 3B',
    status: 'Ready',
    isFavorite: false,
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-21T14:10:00.000Z',
    formData: {
      landlordName: 'Pacific Heights Properties LLC',
      landlordAddress: '420 Montgomery St, San Francisco, CA',
      tenantName: 'Marcus Campbell',
      premisesAddress: '1850 Pine Street, Apt 3B, San Francisco, CA 94109',
      leaseStartDate: '2026-11-01',
      leaseEndDate: '2027-10-31',
      monthlyRent: '3,200',
      securityDeposit: '3,200',
      rentDueDay: '1st calendar day of each month',
      utilitiesIncluded: 'Water, sewer, and trash removal',
      petPolicy: 'Allowed with approval & $500 pet deposit',
    },
    keyTerms: {
      'Lease Term': 'November 1, 2026 to October 31, 2027',
      'Monthly Rent': '$3,200 USD due on the 1st',
      'Security Deposit': '$3,200 USD',
      'Premises': '1850 Pine Street, Apt 3B, San Francisco, CA',
      'Tenant': 'Marcus Campbell',
      'Landlord': 'Pacific Heights Properties LLC',
      'Pet Policy': 'Allowed with approval & $500 pet deposit',
    },
    branding: {
      companyName: 'Pacific Heights Properties',
      primaryColor: '#16A34A',
      fontFamily: 'Inter',
      showHeader: true,
      showFooter: true,
      showPageNumbers: true,
    },
    versions: [
      {
        id: 'v1',
        versionNumber: 1,
        label: 'v1 — Standard Lease Contract',
        summary: 'Standard 12-month fixed term residential lease agreement.',
        timestamp: '2026-09-20T10:00:00.000Z',
        content: {} as any,
      }
    ],
    content: {
      title: 'RESIDENTIAL LEASE AGREEMENT',
      subtitle: 'Fixed-Term Residential Tenancy Contract',
      effectiveDate: 'November 1, 2026',
      preamble: 'THIS RESIDENTIAL LEASE AGREEMENT (the "Lease") is entered into on November 1, 2026, by Pacific Heights Properties LLC ("Landlord"), and Marcus Campbell ("Tenant").',
      recitals: [
        'WHEREAS, Landlord is the owner of the real property situated at 1850 Pine Street, Apt 3B, San Francisco, CA 94109;',
        'WHEREAS, Tenant wishes to lease the Premises for residential occupancy subject to the covenants set forth herein.'
      ],
      sections: [
        {
          id: 'sec-1',
          number: '1',
          title: 'Term & Premise Occupancy',
          clauses: [
            {
              id: 'c-1-1',
              title: 'Fixed Lease Term',
              body: 'The term of this Lease commences on November 1, 2026, and shall terminate on October 31, 2027 at 11:59 PM, unless renewed or extended by mutual written agreement.'
            }
          ]
        },
        {
          id: 'sec-2',
          number: '2',
          title: 'Rent & Security Deposit',
          clauses: [
            {
              id: 'c-2-1',
              title: 'Monthly Rent Payment',
              body: 'Tenant agrees to pay Landlord monthly rent of $3,200 USD, payable on or before the 1st calendar day of each month via ACH electronic portal.'
            },
            {
              id: 'c-2-2',
              title: 'Security Deposit',
              body: 'Upon execution of this Lease, Tenant shall deposit with Landlord the sum of $3,200 USD as security for the faithful performance of all obligations hereunder.'
            }
          ]
        }
      ],
      signatureBlocks: [
        {
          partyTitle: 'LANDLORD:',
          name: 'Pacific Heights Properties LLC',
          role: 'Authorized Agent',
          signatureDate: '2026-10-01'
        },
        {
          partyTitle: 'TENANT:',
          name: 'Marcus Campbell',
          role: 'Primary Tenant',
          signatureDate: '2026-10-01'
        }
      ]
    }
  }
];

// Ensure version contents are assigned
SEED_DOCUMENTS.forEach(doc => {
  doc.versions.forEach(v => {
    v.content = JSON.parse(JSON.stringify(doc.content));
  });
});
