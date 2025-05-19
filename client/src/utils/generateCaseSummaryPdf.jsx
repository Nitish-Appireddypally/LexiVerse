// src/utils/generateCaseSummaryPdf.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import download from 'downloadjs';
import lexiverseLogo from '../assets/lexiverse-logo.png'; // Ensure this path is correct

const themeColor = rgb(0.98, 0.78, 0.18); // Yellow-Gold
const darkSlate = rgb(0.13, 0.15, 0.20);  // Slate-900

export async function generateCaseSummaryPdf(caseData) {
  const {
    caseTitle,
    userInfo,
    caseDetails,
    evidenceFiles = [],
    createdAt = new Date().toISOString(),
  } = caseData;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw LexiVerse Logo
  const logoImageBytes = await fetch(lexiverseLogo).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);
  page.drawImage(logoImage, {
    x: 40,
    y: height - 80,
    width: 50,
    height: 50,
  });

  // Header Text
  page.drawText("LexiVerse Case Summary", {
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

  let cursorY = height - 100;

  const drawSectionTitle = (text) => {
    cursorY -= 30;
    page.drawText(text, {
      x: 40,
      y: cursorY,
      size: 14,
      font: boldFont,
      color: themeColor,
    });
    cursorY -= 10;
  };

  const drawTextBlock = (label, value) => {
    cursorY -= 18;
    page.drawText(`${label}:`, { x: 50, y: cursorY, size: 12, font: boldFont, color: darkSlate });
    page.drawText(value || '-', { x: 150, y: cursorY, size: 12, font, color: darkSlate });
  };

  // Sections
  drawSectionTitle(' User Information');
  drawTextBlock('Name', userInfo.name);
  drawTextBlock('Email', userInfo.email);
  drawTextBlock('Phone', userInfo.phone);

  drawSectionTitle(' Case Details');
  drawTextBlock('Case Type', caseTitle);
  drawTextBlock('Summary', caseDetails.summary);
  drawTextBlock('Incident', caseDetails.incident);
  if (caseDetails.notes) drawTextBlock('Notes', caseDetails.notes);

  drawSectionTitle('Evidence Files');
  if (evidenceFiles.length > 0) {
    evidenceFiles.forEach((file, idx) => {
      cursorY -= 15;
      page.drawText(`• ${file.name}`, {
        x: 60,
        y: cursorY,
        size: 11,
        font,
        color: darkSlate,
      });
    });
  } else {
    cursorY -= 15;
    page.drawText('No evidence uploaded.', {
      x: 60,
      y: cursorY,
      size: 11,
      font,
      color: darkSlate,
    });
  }

  // Footer
  page.drawLine({
    start: { x: 40, y: 60 },
    end: { x: width - 40, y: 60 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText('LexiVerse © 2025 — Secure Legal Automation', {
    x: 40,
    y: 45,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `${caseTitle.replace(/\s+/g, '_')}_summary.pdf`, 'application/pdf');
}