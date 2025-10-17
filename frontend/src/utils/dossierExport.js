import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

// Export to TXT format
export const exportToTXT = (object) => {
  const content = `
╔═══════════════════════════════════════════════════════════════════════════╗
                          ETERNAL SENTINELS                             
                       ДОСЬЕ ES-${object.number}                                
╚═══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ОСНОВНАЯ ИНФОРМАЦИЯ]

Объект:            ES-${object.number}
Название:          ${object.name}
Кодовое имя:       "${object.codename}"
Класс угрозы:      ${object.threat_class}
Дата создания:     ${new Date(object.created_at).toLocaleString('ru-RU')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ОПИСАНИЕ]

${object.description}

${object.special_procedures ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ПРОЦЕДУРЫ СОДЕРЖАНИЯ]

${object.special_procedures}
` : ''}

${object.secret_data && object.secret_data !== '[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]' ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[СЕКРЕТНЫЕ ДАННЫЕ]

${object.secret_data}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Документ сгенерирован: ${new Date().toLocaleString('ru-RU')}
Организация: Eternal Sentinels (ES)
Классификация: КОНФИДЕНЦИАЛЬНО

╚═══════════════════════════════════════════════════════════════════════════╝
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ES-${object.number}-${object.name}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Export to PDF format (stylized)
export const exportToPDF = async (object) => {
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set font
    doc.setFont('helvetica');

    // Colors
    const redColor = [220, 38, 38];
    const darkBg = [15, 15, 15];
    const lightText = [230, 230, 230];

    let yPos = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Function to add new page if needed
    const checkPageBreak = (neededSpace) => {
      if (yPos + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Function to add wrapped text
    const addWrappedText = (text, fontSize, bold = false, color = lightText) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach(line => {
        checkPageBreak(7);
        doc.text(line, margin, yPos);
        yPos += 7;
      });
    };

    // Red background header
    doc.setFillColor(redColor[0], redColor[1], redColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ETERNAL SENTINELS', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`ДОСЬЕ ES-${object.number}`, pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('НАБЛЮДАЙ • СОДЕРЖИ • ЗАЩИЩАЙ', pageWidth / 2, 33, { align: 'center' });

    yPos = 50;

    // Section divider
    doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Main information section
    doc.setFillColor(redColor[0], redColor[1], redColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
    doc.text('ОСНОВНАЯ ИНФОРМАЦИЯ', margin + 2, yPos);
    yPos += 12;

    // Object details
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const details = [
      `Объект: ES-${object.number}`,
      `Название: ${object.name}`,
      `Кодовое имя: "${object.codename}"`,
      `Класс угрозы: ${object.threat_class}`,
      `Дата создания: ${new Date(object.created_at).toLocaleString('ru-RU')}`
    ];

    details.forEach(detail => {
      checkPageBreak(7);
      doc.text(detail, margin + 3, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Description section
    checkPageBreak(20);
    doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFillColor(redColor[0], redColor[1], redColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
    doc.text('ОПИСАНИЕ', margin + 2, yPos);
    yPos += 12;

    addWrappedText(object.description, 10, false, lightText);
    yPos += 5;

    // Special procedures section
    if (object.special_procedures) {
      checkPageBreak(20);
      doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      doc.setFillColor(redColor[0], redColor[1], redColor[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
      doc.text('ПРОЦЕДУРЫ СОДЕРЖАНИЯ', margin + 2, yPos);
      yPos += 12;

      addWrappedText(object.special_procedures, 10, false, lightText);
      yPos += 5;
    }

    // Secret data section
    if (object.secret_data && object.secret_data !== '[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]') {
      checkPageBreak(20);
      doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      doc.setFillColor(redColor[0], redColor[1], redColor[2]);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.rect(margin, yPos - 5, contentWidth, 8, 'F');
      doc.text('СЕКРЕТНЫЕ ДАННЫЕ', margin + 2, yPos);
      yPos += 12;

      addWrappedText(object.secret_data, 10, false, lightText);
      yPos += 5;
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setDrawColor(redColor[0], redColor[1], redColor[2]);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Документ сгенерирован: ${new Date().toLocaleString('ru-RU')}`, margin, footerY);
    doc.text('Eternal Sentinels (ES) | КОНФИДЕНЦИАЛЬНО', pageWidth - margin, footerY, { align: 'right' });

    // Save PDF
    doc.save(`ES-${object.number}-${object.name}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

// Export to DOC format (stylized)
export const exportToDOC = async (object) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: [
          // Header
          new Paragraph({
            text: 'ETERNAL SENTINELS',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            border: {
              bottom: {
                color: 'DC2626',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 24
              }
            }
          }),
          new Paragraph({
            text: `ДОСЬЕ ES-${object.number}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: 'Наблюдай • Содержи • Защищай',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            italics: true
          }),

          // Main information section
          new Paragraph({
            text: 'ОСНОВНАЯ ИНФОРМАЦИЯ',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 200 },
            border: {
              bottom: {
                color: 'DC2626',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12
              }
            }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Объект: ', bold: true }),
              new TextRun({ text: `ES-${object.number}` })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Название: ', bold: true }),
              new TextRun({ text: object.name })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Кодовое имя: ', bold: true }),
              new TextRun({ text: `"${object.codename}"` })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Класс угрозы: ', bold: true }),
              new TextRun({ text: object.threat_class })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Дата создания: ', bold: true }),
              new TextRun({ text: new Date(object.created_at).toLocaleString('ru-RU') })
            ],
            spacing: { after: 200 }
          }),

          // Description section
          new Paragraph({
            text: 'ОПИСАНИЕ',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 200 },
            border: {
              bottom: {
                color: 'DC2626',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12
              }
            }
          }),
          new Paragraph({
            text: object.description,
            spacing: { after: 200 }
          }),

          // Special procedures section (if exists)
          ...(object.special_procedures ? [
            new Paragraph({
              text: 'ПРОЦЕДУРЫ СОДЕРЖАНИЯ',
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 200 },
              border: {
                bottom: {
                  color: 'DC2626',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 12
                }
              }
            }),
            new Paragraph({
              text: object.special_procedures,
              spacing: { after: 200 }
            })
          ] : []),

          // Secret data section (if exists and accessible)
          ...(object.secret_data && object.secret_data !== '[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]' ? [
            new Paragraph({
              text: 'СЕКРЕТНЫЕ ДАННЫЕ',
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 200 },
              border: {
                bottom: {
                  color: 'DC2626',
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 12
                }
              }
            }),
            new Paragraph({
              text: object.secret_data,
              spacing: { after: 200 }
            })
          ] : []),

          // Footer
          new Paragraph({
            text: '',
            spacing: { before: 400 },
            border: {
              top: {
                color: 'DC2626',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 12
              }
            }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Документ сгенерирован: ', italics: true, size: 18 }),
              new TextRun({ text: new Date().toLocaleString('ru-RU'), italics: true, size: 18 })
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: 'Организация: Eternal Sentinels (ES)',
            italics: true,
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: 'Классификация: КОНФИДЕНЦИАЛЬНО',
            italics: true,
            bold: true
          })
        ]
      }]
    });

    // Generate and save document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `ES-${object.number}-${object.name}.docx`);
    return true;
  } catch (error) {
    console.error('DOC export error:', error);
    throw error;
  }
};
