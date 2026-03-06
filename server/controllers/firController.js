// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const puppeteer = require('puppeteer');
// // We no longer need 'fs' or 'path' for saving files
// // const fs = require('fs');
// // const path = require('path');

// // The createFirHtml helper function remains the same...
// const createFirHtml = (caseData) => {
//   // ... (no changes to this function)
//   const { complainant, offense, accused, witnesses } = caseData.full_details;
//   const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');
//   const generatePersonList = (people, type) => {
//     if (!people || people.every(p => !p.name)) return `<p>No ${type} mentioned.</p>`;
//     return `<ul>${people.map(p => p.name ? `<li><strong>${p.name}</strong> - ${p.address || 'No address given'}</li>` : '').join('')}</ul>`;
//   };
//   return `
//     <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>First Information Report</title>
//     <style>body{font-family:sans-serif;margin:40px;color:#333;}.header{text-align:center;border-bottom:2px solid #333;padding-bottom:10px;margin-bottom:20px;}.header h1{margin:0;color:#1F2937;}.header p{margin:5px 0 0;font-size:14px;}.section{margin-bottom:25px;}.section h2{font-size:16px;color:#1F2937;border-bottom:1px solid #ccc;padding-bottom:5px;margin-bottom:10px;}.section p,.section li{font-size:14px;line-height:1.6;}.label{font-weight:bold;}ul{padding-left:20px;}</style>
//     </head><body><div class="header"><h1>First Information Report (FIR)</h1><p>Generated via LexiVerse Platform</p></div>
//     <div class="section"><h2>1. Complainant's Details</h2><p><span class="label">Name:</span> ${complainant.name}</p><p><span class="label">Father's/Husband's Name:</span> ${complainant.fatherName}</p><p><span class="label">Address:</span> ${complainant.address}</p><p><span class="label">Contact:</span> ${complainant.phone} | ${complainant.email}</p></div>
//     <div class="section"><h2>2. Offense Details</h2><p><span class="label">Date & Time of Offense:</span> ${formatDate(offense.offenseDate)} at ${offense.offenseTime}</p><p><span class="label">Place of Offense:</span> ${offense.placeOfOffense}</p><p><span class="label">Case Type:</span> ${caseData.case_type}</p><p><span class="label">Delay in Reporting (if any):</span> ${offense.delayReason || 'N/A'}</p></div>
//     <div class="section"><h2>3. Accused Person(s)</h2>${generatePersonList(accused, 'accused persons')}</div><div class="section"><h2>4. Witness(es)</h2>${generatePersonList(witnesses, 'witnesses')}</div>
//     <div class="section"><h2>5. Narrative of the Incident</h2><p>${caseData.description}</p></div></body></html>
//   `;
// };

// // --- START: UPDATED MAIN CONTROLLER FUNCTION ---
// const generateFirPdf = async (req, res) => {
//   const caseId = parseInt(req.params.id);
//   const userId = req.user.id;

//   try {
//     const caseData = await prisma.case.findFirst({
//       where: {
//         id: caseId,
//         participants: { some: { user_id: userId, role_in_case: 'Petitioner' } }
//       }
//     });

//     if (!caseData) {
//       return res.status(404).json({ message: 'Case not found or you do not have access.' });
//     }

//     const htmlContent = createFirHtml(caseData);

//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

//     // Generate the PDF as a buffer in memory instead of saving to a file
//     const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

//     await browser.close();

//     // --- We no longer save the file or create a DB record here ---
//     // We send the file directly to the user.

//     const fileName = `FIR-CASE-${caseId}.pdf`;

//     // Set headers to trigger a download in the browser
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     res.setHeader('Content-Type', 'application/pdf');

//     // Send the PDF buffer as the response
//     res.send(pdfBuffer);

//     console.log(`✅ FIR generated and sent for download for case ${caseId}`);

//   } catch (error) {
//     console.error('Error generating FIR:', error);
//     res.status(500).json({ message: 'Server error while generating FIR.' });
//   }
// };
// // --- END: UPDATED MAIN CONTROLLER FUNCTION ---

// module.exports = {
//   generateFirPdf,
// };

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const puppeteer = require("puppeteer");

// // This function is the same as the version you liked, with only the subtitle text changed.
// const createFirHtml = (caseData) => {
//   const { complainant, offense, accused, witnesses } = caseData.full_details;
//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//   const generatePersonList = (people, type) => {
//     if (!people || people.every((p) => !p.name && !p.address)) {
//       return `<p class="empty-list">No ${type} mentioned.</p>`;
//     }
//     return people
//       .map((p) => {
//         if (!p.name) return "";
//         return `
//         <div class="person-item">
//             <p class="person-name">${p.name}</p>
//             <p class="person-details">${p.address || "No address or details provided."}</p>
//         </div>
//       `;
//       })
//       .join("");
//   };

//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <title>First Information Report - Case #${caseData.id}</title>
//         <link rel="preconnect" href="https://fonts.googleapis.com">
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//         <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
//         <style>
//             :root {
//                 --charcoal: #1F2937;
//                 --gold: #FBBF24;
//                 --ivory: #F9FAFB;
//                 --text-main: #374151;
//                 --text-light: #6B7280;
//                 --border-color: #E5E7EB;
//             }
//             body {
//                 font-family: 'Roboto', sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 color: var(--text-main);
//                 background-color: white;
//             }
//             .page-container {
//                 padding: 40px 50px;
//             }
//             .main-title {
//                 font-family: 'Merriweather', serif;
//                 text-align: center;
//                 font-size: 24px;
//                 font-weight: 700;
//                 color: var(--charcoal);
//                 margin: 0;
//             }
//             .sub-title {
//                 text-align: center;
//                 font-size: 14px;
//                 color: var(--text-light);
//                 margin: 5px 0 30px 0;
//             }
//             .section {
//                 margin-top: 20px;
//             }
//             .section h2 {
//                 font-family: 'Merriweather', serif;
//                 font-size: 18px;
//                 font-weight: 700;
//                 color: var(--charcoal);
//                 border-bottom: 2px solid var(--gold);
//                 padding-bottom: 6px;
//                 margin-bottom: 15px;
//             }
//             .details-table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 font-size: 14px;
//                 line-height: 1.7;
//             }
//             .details-table td {
//                 padding: 5px 0;
//                 vertical-align: top;
//             }
//             .label-cell {
//                 width: 200px;
//                 font-weight: 500;
//                 color: var(--text-light);
//             }
//             .narrative {
//                 font-size: 14px;
//                 line-height: 1.7;
//                 white-space: pre-wrap;
//                 background-color: var(--ivory);
//                 padding: 15px;
//                 border-radius: 8px;
//                 border: 1px solid var(--border-color);
//             }
//             .person-item {
//                 padding: 6px 0;
//                 border-bottom: 1px solid #f3f4f6;
//             }
//             .person-item:last-child { border-bottom: none; }
//             .person-name { font-weight: 500; color: var(--charcoal); margin: 0 0 4px; }
//             .person-details { font-size: 13px; color: var(--text-light); margin: 0; }
//             .empty-list { color: var(--text-light); font-style: italic; }
//         </style>
//     </head>
//     <body>
//         <div class="page-container">
//             <div class="main-title">First Information Report</div>
//             <div class="sub-title">(Under Section 154 of the Code of Criminal Procedure, 1973)</div>

//             <div class="section">
//                 <h2>1. Complainant's Details</h2>
//                 <table class="details-table">
//                     <tbody>
//                         <tr><td class="label-cell">Name:</td> <td>${complainant.name}</td></tr>
//                         <tr><td class="label-cell">Father's/Husband's Name:</td> <td>${complainant.fatherName}</td></tr>
//                         <tr><td class="label-cell">Address:</td> <td>${complainant.address}</td></tr>
//                         <tr><td class="label-cell">Contact:</td> <td>${complainant.phone} | ${complainant.email}</td></tr>
//                     </tbody>
//                 </table>
//             </div>

//             <div class="section">
//                 <h2>2. Offense Details</h2>
//                 <table class="details-table">
//                      <tbody>
//                         <tr><td class="label-cell">Date & Time:</td> <td>${formatDate(offense.offenseDate)} at ${offense.offenseTime}</td></tr>
//                         <tr><td class="label-cell">Place of Offense:</td> <td>${offense.placeOfOffense}</td></tr>
//                         <tr><td class="label-cell">Case Type:</td> <td>${caseData.case_type}</td></tr>
//                         <tr><td class="label-cell">Delay in Reporting:</td> <td>${offense.delayReason || "N/A"}</td></tr>
//                     </tbody>
//                 </table>
//             </div>

//             <div class="section">
//                 <h2>3. Accused Person(s)</h2>
//                 ${generatePersonList(accused, "accused persons")}
//             </div>

//             <div class="section">
//                 <h2>4. Witness(es)</h2>
//                 ${generatePersonList(witnesses, "witnesses")}
//             </div>

//             <div class="section">
//                 <h2>5. Narrative of the Incident</h2>
//                 <div class="narrative">${caseData.description}</div>
//             </div>
//         </div>
//     </body>
//     </html>
//   `;
// };

// // This function is updated to remove the default header but keeps the margins and footer you liked.
// const generateFirPdf = async (req, res) => {
//   const caseId = parseInt(req.params.id);
//   const userId = req.user.id;
//   let browser;

//   try {
//     const caseData = await prisma.case.findFirst({
//       where: {
//         id: caseId,
//         participants: { some: { user_id: userId, role_in_case: "Petitioner" } },
//       },
//     });

//     if (!caseData) {
//       return res
//         .status(404)
//         .json({ message: "Case not found or you do not have access." });
//     }

//     const htmlContent = createFirHtml(caseData);
//     browser = await puppeteer.launch({
//       headless: "new",
//       executablePath: puppeteer.executablePath(),
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--disable-gpu",
//       ],
//     });

//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//     const footerTemplate = `
//       <div style="font-size: 9px; text-align: center; width: 100%; color: #888; padding: 0 50px;">
//         Generated by LexiVerse on ${new Date().toLocaleDateString("en-IN")} |
//         Page <span class="pageNumber"></span> of <span class="totalPages"></span>
//       </div>
//     `;

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       displayHeaderFooter: true,
//       headerTemplate: "<span></span>", // This blank template removes the default header
//       footerTemplate: footerTemplate,
//       // Reverted to the original margins you approved
//       margin: {
//         top: "40px",
//         bottom: "60px",
//         left: "40px",
//         right: "40px",
//       },
//     });

//     await browser.close();

//     const fileName = `FIR-DRAFT-CASE-${caseId}.pdf`;
//     res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
//     res.setHeader("Content-Type", "application/pdf");
//     res.send(pdfBuffer);

//     console.log(`✅ Final FIR generated for case ${caseId}`);
//   } catch (error) {
//     console.error("Error generating final FIR:", error);
//     res.status(500).json({ message: "Server error while generating FIR." });
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };

// const updateInvestigationDetails = async (req, res) => {
//   const caseId = parseInt(req.params.id);
//   const user = req.user;
//   const {
//     fir_number,
//     police_station,
//     investigating_officer,
//     io_contact,
//     status,
//   } = req.body;

//   try {
//     // First, verify that the user has access to this case
//     const caseData = await prisma.case.findFirst({
//       where: {
//         id: caseId,
//         participants: { some: { user_id: user.id } },
//       },
//     });

//     if (user.role !== "Admin" && !caseData) {
//       return res.status(403).json({
//         message: "Forbidden: You do not have access to update this case.",
//       });
//     }

//     // Use a transaction to update both the case status and the FIR details together
//     const [, updatedCase] = await prisma.$transaction([
//       // Use upsert: update the FIR record if it exists, or create it if it doesn't
//       prisma.fIR.upsert({
//         where: { case_id: caseId },
//         update: {
//           fir_number,
//           police_station,
//           investigating_officer,
//           io_contact,
//         },
//         create: {
//           case_id: caseId,
//           fir_number,
//           police_station,
//           investigating_officer,
//           io_contact,
//         },
//       }),
//       // Also update the main case status
//       prisma.case.update({
//         where: { id: caseId },
//         data: { status },
//       }),
//     ]);

//     res.status(200).json(updatedCase);
//   } catch (error) {
//     console.error("Error updating investigation details:", error);
//     res.status(500).json({ message: "Server error while updating details." });
//   }
// };

// module.exports = {
//   generateFirPdf,
//   updateInvestigationDetails,
// };

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PDFDocument = require("pdfkit");

const generateFirPdf = async (req, res) => {
  const caseId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const caseData = await prisma.case.findFirst({
      where: {
        id: caseId,
        participants: {
          some: { user_id: userId, role_in_case: "Petitioner" },
        },
      },
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found or you do not have access.",
      });
    }

    const { complainant, offense, accused, witnesses } = caseData.full_details;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=FIR-CASE-${caseId}.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).text("FIRST INFORMATION REPORT", { align: "center" });

    doc
      .fontSize(12)
      .text("(Under Section 154 of the Code of Criminal Procedure, 1973)", {
        align: "center",
      });

    doc.moveDown();

    // Complainant
    doc.fontSize(16).text("1. Complainant Details");
    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Name: ${complainant.name}`);
    doc.text(`Father/Husband Name: ${complainant.fatherName}`);
    doc.text(`Address: ${complainant.address}`);
    doc.text(`Phone: ${complainant.phone}`);
    doc.text(`Email: ${complainant.email}`);

    doc.moveDown();

    // Offense
    doc.fontSize(16).text("2. Offense Details");
    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Date: ${offense.offenseDate}`);
    doc.text(`Time: ${offense.offenseTime}`);
    doc.text(`Place: ${offense.placeOfOffense}`);
    doc.text(`Case Type: ${caseData.case_type}`);

    doc.moveDown();

    // Accused
    doc.fontSize(16).text("3. Accused Persons");
    doc.moveDown(0.5);

    if (accused?.length) {
      accused.forEach((a, i) => {
        doc.text(`${i + 1}. ${a.name} - ${a.address}`);
      });
    } else {
      doc.text("No accused mentioned.");
    }

    doc.moveDown();

    // Witness
    doc.fontSize(16).text("4. Witnesses");
    doc.moveDown(0.5);

    if (witnesses?.length) {
      witnesses.forEach((w, i) => {
        doc.text(`${i + 1}. ${w.name} - ${w.address}`);
      });
    } else {
      doc.text("No witnesses mentioned.");
    }

    doc.moveDown();

    // Narrative
    doc.fontSize(16).text("5. Narrative of Incident");
    doc.moveDown(0.5);

    doc.fontSize(12).text(caseData.description);

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        `Generated by LexiVerse on ${new Date().toLocaleDateString("en-IN")}`,
        { align: "center" },
      );

    doc.end();

    console.log(`✅ FIR generated for case ${caseId}`);
  } catch (error) {
    console.error("Error generating FIR:", error);
    res.status(500).json({
      message: "Server error while generating FIR.",
    });
  }
};
const updateInvestigationDetails = async (req, res) => {
  const caseId = parseInt(req.params.id);
  const user = req.user;

  const {
    fir_number,
    police_station,
    investigating_officer,
    io_contact,
    status,
  } = req.body;

  try {
    const caseData = await prisma.case.findFirst({
      where: {
        id: caseId,
        participants: {
          some: { user_id: user.id },
        },
      },
    });

    if (user.role !== "Admin" && !caseData) {
      return res.status(403).json({
        message: "Forbidden: You do not have access",
      });
    }

    const [, updatedCase] = await prisma.$transaction([
      prisma.fIR.upsert({
        where: { case_id: caseId },
        update: {
          fir_number,
          police_station,
          investigating_officer,
          io_contact,
        },
        create: {
          case_id: caseId,
          fir_number,
          police_station,
          investigating_officer,
          io_contact,
        },
      }),

      prisma.case.update({
        where: { id: caseId },
        data: { status },
      }),
    ]);

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating investigation details:", error);
    res.status(500).json({
      message: "Server error while updating details.",
    });
  }
};
module.exports = {
  generateFirPdf,
  updateInvestigationDetails,
};
