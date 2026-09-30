import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle } from 'docx';
import { LegalDocument } from '../types';

export interface ExportProgressCallback {
  (step: string, progress: number): void;
}

// Download helper
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. Plain Text Export
export async function exportToTxt(
  doc: LegalDocument,
  onProgress?: ExportProgressCallback
): Promise<void> {
  onProgress?.('Formatting plain text document...', 30);
  await new Promise(r => setTimeout(r, 200));

  let text = '';
  text += doc.content.title.toUpperCase() + '\n';
  if (doc.content.subtitle) {
    text += doc.content.subtitle + '\n';
  }
  text += `Effective Date: ${doc.content.effectiveDate}\n`;
  text += '='.repeat(60) + '\n\n';

  text += doc.content.preamble + '\n\n';

  if (doc.content.recitals && doc.content.recitals.length > 0) {
    text += 'RECITALS:\n';
    doc.content.recitals.forEach(recital => {
      text += `  • ${recital}\n`;
    });
    text += '\n';
  }

  doc.content.sections.forEach(section => {
    text += `SECTION ${section.number}. ${section.title.toUpperCase()}\n`;
    text += '-'.repeat(40) + '\n';
    section.clauses.forEach(clause => {
      text += `${clause.title}:\n`;
      text += `${clause.body}\n\n`;
    });
  });

  if (doc.content.signatureBlocks && doc.content.signatureBlocks.length > 0) {
    text += 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement:\n\n';
    doc.content.signatureBlocks.forEach(sig => {
      text += `${sig.partyTitle}\n`;
      text += `Signature: ___________________________\n`;
      text += `Name: ${sig.name}\n`;
      if (sig.role) text += `Title: ${sig.role}\n`;
      if (sig.entityName) text += `Entity: ${sig.entityName}\n`;
      text += `Date: ${sig.signatureDate || '__________'}\n\n`;
    });
  }

  onProgress?.('Generating downloadable text file...', 90);
  await new Promise(r => setTimeout(r, 150));

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
  triggerDownload(blob, filename);

  onProgress?.('Download complete!', 100);
}

// 2. PDF Export using jsPDF
export async function exportToPdf(
  doc: LegalDocument,
  onProgress?: ExportProgressCallback
): Promise<void> {
  onProgress?.('Initializing PDF canvas & typography...', 20);
  await new Promise(r => setTimeout(r, 250));

  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 54; // 0.75 inch
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageOverflow = (heightNeeded: number) => {
    if (cursorY + heightNeeded > pageHeight - margin) {
      pdf.addPage();
      cursorY = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    if (doc.branding.showHeader) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(140, 150, 165);
      const companyHeader = doc.branding.companyName || 'LegalEase Generated Document';
      pdf.text(companyHeader.toUpperCase(), margin, margin - 15);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin - 8, pageWidth - margin, margin - 8);
    }
  };

  drawHeaderFooter();

  onProgress?.('Styling document headings and clauses...', 50);
  await new Promise(r => setTimeout(r, 200));

  // Brand Accent Bar
  if (doc.branding.primaryColor) {
    pdf.setFillColor(37, 99, 235); // default blue #2563EB
    pdf.rect(margin, cursorY, contentWidth, 3, 'F');
    cursorY += 16;
  }

  // Document Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(15, 23, 42); // dark navy
  const titleLines = pdf.splitTextToSize(doc.content.title.toUpperCase(), contentWidth);
  pdf.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 20 + 4;

  if (doc.content.subtitle) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(doc.content.subtitle, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 18;
  }

  cursorY += 12;

  // Preamble
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(30, 41, 59);
  const preambleLines = pdf.splitTextToSize(doc.content.preamble, contentWidth);
  checkPageOverflow(preambleLines.length * 14 + 10);
  pdf.text(preambleLines, margin, cursorY);
  cursorY += preambleLines.length * 14 + 16;

  // Recitals
  if (doc.content.recitals && doc.content.recitals.length > 0) {
    doc.content.recitals.forEach(recital => {
      const recLines = pdf.splitTextToSize(recital, contentWidth - 16);
      checkPageOverflow(recLines.length * 13 + 8);
      pdf.text('•', margin + 4, cursorY);
      pdf.text(recLines, margin + 16, cursorY);
      cursorY += recLines.length * 13 + 8;
    });
    cursorY += 12;
  }

  onProgress?.('Building section blocks and signature layout...', 75);
  await new Promise(r => setTimeout(r, 200));

  // Sections
  doc.content.sections.forEach(sec => {
    checkPageOverflow(40);
    // Section Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${sec.number}. ${sec.title.toUpperCase()}`, margin, cursorY);
    cursorY += 16;

    // Clauses
    sec.clauses.forEach(clause => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(30, 41, 59);
      checkPageOverflow(26);
      pdf.text(`${sec.number}.${clause.id.split('-').pop() || '1'} ${clause.title}`, margin, cursorY);
      cursorY += 13;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(51, 65, 85);
      const bodyLines = pdf.splitTextToSize(clause.body, contentWidth);
      checkPageOverflow(bodyLines.length * 13 + 12);
      pdf.text(bodyLines, margin, cursorY);
      cursorY += bodyLines.length * 13 + 12;
    });

    cursorY += 8;
  });

  // Signature Block
  if (doc.content.signatureBlocks && doc.content.signatureBlocks.length > 0) {
    checkPageOverflow(120);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('IN WITNESS WHEREOF, the parties have executed this Agreement:', margin, cursorY);
    cursorY += 24;

    const blockWidth = (contentWidth - 20) / Math.min(doc.content.signatureBlocks.length, 2);
    doc.content.signatureBlocks.forEach((sig, idx) => {
      const colX = margin + (idx % 2) * (blockWidth + 20);
      const startBlockY = cursorY;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(sig.partyTitle, colX, startBlockY);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setDrawColor(180, 190, 205);
      pdf.setLineWidth(0.75);
      pdf.line(colX, startBlockY + 36, colX + blockWidth - 10, startBlockY + 36);

      pdf.text(`By: ${sig.name}`, colX, startBlockY + 48);
      if (sig.role) pdf.text(`Title: ${sig.role}`, colX, startBlockY + 60);
      if (sig.entityName) pdf.text(`Entity: ${sig.entityName}`, colX, startBlockY + 72);
      pdf.text(`Date: ${sig.signatureDate || new Date().toISOString().split('T')[0]}`, colX, startBlockY + 84);

      if (idx % 2 === 1 || idx === doc.content.signatureBlocks.length - 1) {
        cursorY += 100;
      }
    });
  }

  // Page Numbers
  if (doc.branding.showPageNumbers) {
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(140, 150, 165);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - margin + 20,
        { align: 'right' }
      );
      if (doc.branding.showFooter) {
        pdf.text(
          'CONFIDENTIAL & LEGALLY BINDING',
          margin,
          pageHeight - margin + 20
        );
      }
    }
  }

  onProgress?.('Finalizing and downloading PDF...', 95);
  await new Promise(r => setTimeout(r, 200));

  const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  pdf.save(filename);

  onProgress?.('Export completed successfully!', 100);
}

// 3. DOCX Export using docx library
export async function exportToDocx(
  doc: LegalDocument,
  onProgress?: ExportProgressCallback
): Promise<void> {
  onProgress?.('Preparing Word document hierarchy...', 25);
  await new Promise(r => setTimeout(r, 200));

  const docxParagraphs: Paragraph[] = [];

  // Title
  docxParagraphs.push(
    new Paragraph({
      text: doc.content.title.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
    })
  );

  if (doc.content.subtitle) {
    docxParagraphs.push(
      new Paragraph({
        text: doc.content.subtitle,
        alignment: AlignmentType.CENTER,
        spacing: { after: 250 },
      })
    );
  }

  docxParagraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: doc.content.preamble,
          size: 22, // 11pt
        }),
      ],
      spacing: { after: 200 },
    })
  );

  if (doc.content.recitals && doc.content.recitals.length > 0) {
    doc.content.recitals.forEach(recital => {
      docxParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: recital,
              italics: true,
              size: 21,
            }),
          ],
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
    });
  }

  onProgress?.('Converting clauses and section headers...', 60);
  await new Promise(r => setTimeout(r, 200));

  doc.content.sections.forEach(sec => {
    docxParagraphs.push(
      new Paragraph({
        text: `SECTION ${sec.number}. ${sec.title.toUpperCase()}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      })
    );

    sec.clauses.forEach(clause => {
      docxParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${clause.title}: `,
              bold: true,
              size: 21,
            }),
            new TextRun({
              text: clause.body,
              size: 21,
            }),
          ],
          spacing: { after: 150 },
        })
      );
    });
  });

  // Signature Block
  if (doc.content.signatureBlocks && doc.content.signatureBlocks.length > 0) {
    docxParagraphs.push(
      new Paragraph({
        text: 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement.',
        spacing: { before: 400, after: 200 },
      })
    );

    doc.content.signatureBlocks.forEach(sig => {
      docxParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${sig.partyTitle}\n`, bold: true }),
            new TextRun({ text: `Signature: ___________________________\n` }),
            new TextRun({ text: `Name: ${sig.name}\n` }),
            new TextRun({ text: sig.role ? `Title: ${sig.role}\n` : '' }),
            new TextRun({ text: sig.entityName ? `Entity: ${sig.entityName}\n` : '' }),
            new TextRun({ text: `Date: ${sig.signatureDate || new Date().toISOString().split('T')[0]}\n` }),
          ],
          spacing: { after: 200 },
        })
      );
    });
  }

  onProgress?.('Packing DOCX binary stream...', 85);
  await new Promise(r => setTimeout(r, 200));

  const wordDoc = new Document({
    sections: [
      {
        properties: {},
        children: docxParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
  triggerDownload(blob, filename);

  onProgress?.('DOCX download complete!', 100);
}
