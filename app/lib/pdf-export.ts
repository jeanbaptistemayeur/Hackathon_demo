import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PtfFormData } from "../schemas/ptf-form.schema";
import {
  buildPtfBlocks,
  loadBlockImages,
  loadLogo,
  type Block,
  type LoadedImage,
} from "./ptf-content";

// Couleurs charte Akkodis en RGB
const RGB = {
  brand: [30, 58, 95] as [number, number, number],
  brandMedium: [44, 82, 130] as [number, number, number],
  accent: [253, 185, 19] as [number, number, number],
  line: [220, 229, 242] as [number, number, number],
  ink: [26, 32, 44] as [number, number, number],
};

const PAGE = { width: 210, height: 297 }; // A4 mm
const MARGIN = 18;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;
const FONT = "helvetica";

export async function generatePtfPdf(data: PtfFormData): Promise<Blob> {
  const blocks = buildPtfBlocks(data);
  const [logo, images] = await Promise.all([loadLogo(), loadBlockImages(blocks)]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE.height - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const writeWrapped = (
    text: string,
    opts: {
      size: number;
      style?: "normal" | "bold";
      color?: [number, number, number];
      lineGap?: number;
      indent?: number;
    },
  ) => {
    const { size, style = "normal", color = RGB.ink, lineGap = 1.4, indent = 0 } = opts;
    doc.setFont(FONT, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const maxWidth = CONTENT_WIDTH - indent;
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    const lineHeight = (size / 2.83465) * lineGap; // pt -> mm approx
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, MARGIN + indent, y);
      y += lineHeight;
    }
  };

  const renderTitlePage = (block: Extract<Block, { type: "titlePage" }>) => {
    if (logo) {
      const targetWidth = 60;
      const targetHeight = (logo.height / logo.width) * targetWidth;
      const x = (PAGE.width - targetWidth) / 2;
      y = 60;
      doc.addImage(logo.dataUrl, "PNG", x, y, targetWidth, targetHeight);
      y += targetHeight + 16;
    } else {
      y = 90;
    }
    doc.setFont(FONT, "bold");
    doc.setFontSize(24);
    doc.setTextColor(...RGB.brand);
    const titleLines = doc.splitTextToSize(block.title, CONTENT_WIDTH) as string[];
    for (const line of titleLines) {
      doc.text(line, PAGE.width / 2, y, { align: "center" });
      y += 11;
    }
    if (block.subtitle) {
      y += 4;
      doc.setFont(FONT, "normal");
      doc.setFontSize(15);
      doc.setTextColor(...RGB.brandMedium);
      const subLines = doc.splitTextToSize(block.subtitle, CONTENT_WIDTH) as string[];
      for (const line of subLines) {
        doc.text(line, PAGE.width / 2, y, { align: "center" });
        y += 8;
      }
    }
    if (block.org) {
      doc.setFontSize(12);
      doc.setTextColor(...RGB.brandMedium);
      doc.text(block.org, PAGE.width / 2, y, { align: "center" });
      y += 8;
    }
    y += 6;
    doc.setDrawColor(...RGB.accent);
    doc.setLineWidth(1);
    doc.line(PAGE.width / 2 - 30, y, PAGE.width / 2 + 30, y);
    doc.addPage();
    y = MARGIN;
  };

  const renderTable = (block: Extract<Block, { type: "table" }>) => {
    const totalW = block.widths?.reduce((a, b) => a + b, 0) ?? 0;
    const columnStyles: Record<number, { cellWidth: number }> = {};
    if (block.widths && totalW > 0) {
      block.widths.forEach((w, i) => {
        columnStyles[i] = { cellWidth: (w / totalW) * CONTENT_WIDTH };
      });
    }
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [block.headers],
      body: block.rows,
      tableWidth: CONTENT_WIDTH,
      styles: { font: FONT, fontSize: 8.5, cellPadding: 1.6, textColor: RGB.ink, lineColor: RGB.line, lineWidth: 0.1 },
      headStyles: { fillColor: RGB.brand, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
      alternateRowStyles: { fillColor: [244, 247, 252] },
      columnStyles,
    });
    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
    y = (finalY ?? y) + 4;
  };

  const renderEncart = (block: Extract<Block, { type: "encart" }>) => {
    const boxWidth = CONTENT_WIDTH * 0.72;
    const rowH = 7;
    const labelW = boxWidth * 0.32;
    const totalH = block.rows.length * rowH + 2;
    ensureSpace(totalH + 2);
    const x0 = MARGIN;
    const yTop = y;
    // fond label
    for (let i = 0; i < block.rows.length; i++) {
      const ry = yTop + i * rowH;
      doc.setFillColor(238, 242, 248);
      doc.rect(x0, ry, labelW, rowH, "F");
      doc.setFont(FONT, "bold");
      doc.setFontSize(9);
      doc.setTextColor(...RGB.brand);
      doc.text(block.rows[i].label, x0 + 2, ry + 4.6);
      doc.setFont(FONT, "normal");
      doc.setTextColor(...RGB.ink);
      const vLines = doc.splitTextToSize(
        block.rows[i].value,
        boxWidth - labelW - 4,
      ) as string[];
      doc.text(vLines[0] ?? "", x0 + labelW + 2, ry + 4.6);
    }
    // bordures
    doc.setDrawColor(...RGB.line);
    doc.setLineWidth(0.2);
    for (let i = 1; i < block.rows.length; i++) {
      doc.line(x0, yTop + i * rowH, x0 + boxWidth, yTop + i * rowH);
    }
    doc.setDrawColor(...RGB.brandMedium);
    doc.setLineWidth(0.3);
    doc.rect(x0, yTop, boxWidth, block.rows.length * rowH);
    // bord gauche accent
    doc.setDrawColor(...RGB.accent);
    doc.setLineWidth(1.2);
    doc.line(x0, yTop, x0, yTop + block.rows.length * rowH);
    y = yTop + block.rows.length * rowH + 5;
  };

  const renderSignature = (block: Extract<Block, { type: "signature" }>) => {
    const colW = CONTENT_WIDTH / 2;
    const headerH = 8;
    const bodyH = 34;
    ensureSpace(headerH + bodyH + 4);
    const x0 = MARGIN;
    const yTop = y;
    // en-têtes
    doc.setFillColor(...RGB.brand);
    doc.rect(x0, yTop, colW, headerH, "F");
    doc.rect(x0 + colW, yTop, colW, headerH, "F");
    doc.setFont(FONT, "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Pour le Client", x0 + 3, yTop + 5.4);
    doc.text("Pour le Prestataire", x0 + colW + 3, yTop + 5.4);
    // corps
    const drawEntries = (entries: { label: string; value: string }[], cx: number) => {
      let cy = yTop + headerH + 6;
      doc.setFontSize(9.5);
      for (const e of entries) {
        doc.setFont(FONT, "bold");
        doc.setTextColor(...RGB.ink);
        const lbl = `${e.label} : `;
        doc.text(lbl, cx + 3, cy);
        doc.setFont(FONT, "normal");
        doc.text(e.value, cx + 3 + doc.getTextWidth(lbl), cy);
        cy += 8;
      }
    };
    drawEntries(block.client, x0);
    drawEntries(block.provider, x0 + colW);
    // bordures
    doc.setDrawColor(...RGB.line);
    doc.setLineWidth(0.3);
    doc.rect(x0, yTop, colW, headerH + bodyH);
    doc.rect(x0 + colW, yTop, colW, headerH + bodyH);
    y = yTop + headerH + bodyH + 5;
  };

  const renderImage = (block: Extract<Block, { type: "image" }>) => {
    const img: LoadedImage | undefined = images.get(block.src);
    if (!img) return;
    const fmt = block.format === "jpeg" ? "JPEG" : "PNG";
    if (block.fullPage) {
      // Chaque image pleine page sur sa propre page A4
      doc.addPage();
      const availW = PAGE.width - MARGIN * 2;
      const availH = PAGE.height - MARGIN * 2;
      const ratio = Math.min(availW / img.width, availH / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      const x = (PAGE.width - w) / 2;
      doc.addImage(img.dataUrl, fmt, x, MARGIN, w, h);
      y = PAGE.height - MARGIN;
    } else {
      const w = CONTENT_WIDTH;
      const h = (img.height / img.width) * w;
      ensureSpace(h + 4);
      doc.addImage(img.dataUrl, fmt, MARGIN, y, w, h);
      y += h + 4;
    }
  };

  for (const block of blocks) {
    switch (block.type) {
      case "titlePage":
        renderTitlePage(block);
        break;
      case "h1": {
        y += 4;
        ensureSpace(12);
        writeWrapped(block.text, { size: 15, style: "bold", color: RGB.brand, lineGap: 1.3 });
        doc.setDrawColor(...RGB.brandMedium);
        doc.setLineWidth(0.4);
        doc.line(MARGIN, y, PAGE.width - MARGIN, y);
        y += 4;
        break;
      }
      case "h2": {
        y += 3;
        ensureSpace(9);
        writeWrapped(block.text, { size: 12, style: "bold", color: RGB.brandMedium, lineGap: 1.3 });
        y += 1.5;
        break;
      }
      case "h3": {
        y += 2;
        ensureSpace(8);
        writeWrapped(block.text, { size: 10.5, style: "bold", color: RGB.brand, lineGap: 1.3 });
        y += 1;
        break;
      }
      case "p":
        writeWrapped(block.text, { size: 10, lineGap: 1.45 });
        y += 1.5;
        break;
      case "kv": {
        doc.setFont(FONT, "bold");
        doc.setFontSize(10);
        const label = `${block.label} : `;
        const labelWidth = doc.getTextWidth(label);
        ensureSpace(5);
        doc.setTextColor(...RGB.ink);
        doc.text(label, MARGIN, y);
        doc.setFont(FONT, "normal");
        const valueLines = doc.splitTextToSize(
          block.value,
          CONTENT_WIDTH - labelWidth,
        ) as string[];
        doc.text(valueLines[0] ?? "", MARGIN + labelWidth, y);
        y += 5;
        for (let i = 1; i < valueLines.length; i++) {
          ensureSpace(5);
          doc.text(valueLines[i], MARGIN + labelWidth, y);
          y += 5;
        }
        y += 0.5;
        break;
      }
      case "bullet": {
        doc.setFont(FONT, "normal");
        doc.setFontSize(10);
        doc.setTextColor(...RGB.ink);
        const lines = doc.splitTextToSize(block.text, CONTENT_WIDTH - 5) as string[];
        ensureSpace(5);
        doc.text("•", MARGIN, y);
        for (let i = 0; i < lines.length; i++) {
          if (i > 0) ensureSpace(5);
          doc.text(lines[i], MARGIN + 5, y);
          y += 5;
        }
        break;
      }
      case "table":
        renderTable(block);
        break;
      case "encart":
        renderEncart(block);
        break;
      case "signature":
        renderSignature(block);
        break;
      case "image":
        renderImage(block);
        break;
      case "spacer":
        y += 3;
        break;
    }
  }

  return doc.output("blob");
}

export { downloadBlob } from "./ptf-content";
