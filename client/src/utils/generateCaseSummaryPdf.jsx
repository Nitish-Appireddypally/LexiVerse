import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import download from 'downloadjs';
import lexiverseLogo from '../assets/lexiverse-logo.png';

const themeColor = rgb(0.98, 0.78, 0.18);
const darkSlate = rgb(0.13, 0.15, 0.20);

const PAGE_MARGIN_LEFT = 40;
const PAGE_MARGIN_RIGHT = 40;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MAX_TEXT_WIDTH = PAGE_WIDTH - PAGE_MARGIN_LEFT - PAGE_MARGIN_RIGHT - 110; // 110 is label area + margin

function splitTextIntoLines(text, font, size, maxWidth) {
  if (!text) return ['-'];
  // Split on newlines first
  const paragraphs = text.split(/\r?\n/);
  const lines = [];

  paragraphs.forEach(paragraph => {
    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
  });

  return lines;
}


export async function generateCaseSummaryPdf(caseData) {
  const {
    caseTitle,
    userInfo,
    caseDetails,
    evidenceFiles = [],
    createdAt = new Date().toISOString(),
  } = caseData;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw Logo
  const logoImageBytes = await fetch(lexiverseLogo).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);
  page.drawImage(logoImage, { x: 40, y: height - 80, width: 50, height: 50 });

  // Header
  page.drawText('LexiVerse Case Summary', {
    x: 100,
    y: height - 50,
    size: 20,
    font: boldFont,
    color: themeColor,
  });
  page.drawText(`Date: ${new Date(createdAt).toLocaleString()}`, {
    x: width - 200,
    y: height - 50,
    size: 10,
    font,
    color: darkSlate,
  });

  let cursorY = height - 110;

  const drawSectionTitle = (text) => {
  cursorY -= 30;
  page.drawText(text, {
    x: 40,
    y: cursorY,
    size: 14,
    font: boldFont,
    color: themeColor,
  });
  cursorY -= 20; // increased space after heading
};


  const drawTextBlock = (label, value) => {
    const labelX = PAGE_MARGIN_LEFT + 10;
    const valueX = PAGE_MARGIN_LEFT + 110;
    const fontSize = 12;
    const lineHeight = fontSize + 4;

    // Draw label
    page.drawText(`${label}:`, {
      x: labelX,
      y: cursorY,
      size: fontSize,
      font: boldFont,
      color: darkSlate,
    });

    if (!value) {
      // Draw dash if no value
      page.drawText('-', {
        x: valueX,
        y: cursorY,
        size: fontSize,
        font,
        color: darkSlate,
      });
      cursorY -= lineHeight;
      return;
    }

    // Split value text into wrapped lines
    const lines = splitTextIntoLines(value, font, fontSize, MAX_TEXT_WIDTH);

    // Draw first line aligned with label
    page.drawText(lines[0], {
      x: valueX,
      y: cursorY,
      size: fontSize,
      font,
      color: darkSlate,
    });
    cursorY -= lineHeight;

    // Draw subsequent lines
    for (let i = 1; i < lines.length; i++) {
      page.drawText(lines[i], {
        x: valueX,
        y: cursorY,
        size: fontSize,
        font,
        color: darkSlate,
      });
      cursorY -= lineHeight;
    }
  };

  // User Info
  drawSectionTitle('User Information');
  drawTextBlock('Name', userInfo.name);
  drawTextBlock('Email', userInfo.email);
  drawTextBlock('Phone', userInfo.phone);

  // Case Details
  drawSectionTitle('Case Details');
  drawTextBlock('Case Type', caseTitle);
  drawTextBlock('Summary', caseDetails.summary);
  drawTextBlock('Incident', caseDetails.incident);
  if (caseDetails.notes) drawTextBlock('Notes', caseDetails.notes);

  // Evidence
  drawSectionTitle('Evidence Files');
  if (evidenceFiles.length > 0) {
    const fontSize = 11;
    const lineHeight = fontSize + 4;
    evidenceFiles.forEach((file) => {
      cursorY -= lineHeight;
      // Wrap file names too, if needed
      const lines = splitTextIntoLines(`• ${file.name}`, font, fontSize, width - PAGE_MARGIN_LEFT * 2);
      lines.forEach(line => {
        page.drawText(line, { x: PAGE_MARGIN_LEFT + 20, y: cursorY, size: fontSize, font, color: darkSlate });
        cursorY -= lineHeight;
      });
    });
  } else {
    cursorY -= 15;
    page.drawText('No evidence uploaded.', {
      x: PAGE_MARGIN_LEFT + 20,
      y: cursorY,
      size: 11,
      font,
      color: darkSlate,
    });
  }

  // Footer
  page.drawLine({
    start: { x: PAGE_MARGIN_LEFT, y: 60 },
    end: { x: width - PAGE_MARGIN_RIGHT, y: 60 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText('LexiVerse © 2025 — Secure Legal Automation', {
    x: PAGE_MARGIN_LEFT,
    y: 45,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `${caseTitle.replace(/\s+/g, '_')}_summary.pdf`, 'application/pdf');
}
