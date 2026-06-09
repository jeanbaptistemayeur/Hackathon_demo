import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  PageBreak,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { PtfFormData } from "../schemas/ptf-form.schema";
import {
  buildPtfBlocks,
  COLORS,
  loadBlockImages,
  loadLogo,
  type Block,
  type LoadedImage,
} from "./ptf-content";

// Couleurs charte Akkodis
const BRAND = COLORS.brand;
const BRAND_MEDIUM = COLORS.brandMedium;
const ACCENT = COLORS.accent;
const LINE = COLORS.line;

function heading1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BRAND_MEDIUM, space: 4 } },
    children: [new TextRun({ text, bold: true, color: BRAND, size: 32 })],
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, bold: true, color: BRAND_MEDIUM, size: 24 })],
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, color: BRAND, size: 22 })],
  });
}

function para(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 22 })],
  });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label} : `, bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function cell(text: string, opts?: { header?: boolean; width?: number }): TableCell {
  return new TableCell({
    width: opts?.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts?.header ? { fill: BRAND } : undefined,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: opts?.header,
            color: opts?.header ? "FFFFFF" : undefined,
            size: 20,
          }),
        ],
      }),
    ],
  });
}

function buildTable(headers: string[], rows: string[][], widths?: number[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, { header: true, width: widths?.[i] })),
  });
  const bodyRows = rows.map(
    (r) =>
      new TableRow({
        children: r.map((c, i) => cell(c, { width: widths?.[i] })),
      }),
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: LINE },
    },
    rows: [headerRow, ...bodyRows],
  });
}

function spacer(): Paragraph {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

// Largeur de contenu en px (A4 - marges, ~96dpi) pour les images pleine largeur.
const CONTENT_PX = 642;

function encartTable(rows: { label: string; value: string }[]): Table {
  return new Table({
    width: { size: 70, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: BRAND_MEDIUM },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_MEDIUM },
      left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT },
      right: { style: BorderStyle.SINGLE, size: 4, color: BRAND_MEDIUM },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: LINE },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: LINE },
    },
    rows: rows.map(
      (r) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              shading: { fill: "EEF2F8" },
              margins: { top: 40, bottom: 40, left: 80, right: 80 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: r.label, bold: true, color: BRAND, size: 20 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              margins: { top: 40, bottom: 40, left: 80, right: 80 },
              children: [
                new Paragraph({ children: [new TextRun({ text: r.value, size: 20 })] }),
              ],
            }),
          ],
        }),
    ),
  });
}

function signatureTable(
  client: { label: string; value: string }[],
  provider: { label: string; value: string }[],
): Table {
  const headerRow = new TableRow({
    children: ["Pour le Client", "Pour le Prestataire"].map(
      (t) =>
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          shading: { fill: BRAND },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: t, bold: true, color: "FFFFFF", size: 22 })],
            }),
          ],
        }),
    ),
  });
  const lineParas = (entries: { label: string; value: string }[]) =>
    entries.map(
      (e) =>
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: `${e.label} : `, bold: true, size: 20 }),
            new TextRun({ text: e.value, size: 20 }),
          ],
        }),
    );
  const bodyRow = new TableRow({
    children: [client, provider].map(
      (entries) =>
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          margins: { top: 100, bottom: 400, left: 100, right: 100 },
          children: lineParas(entries),
        }),
    ),
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: LINE },
    },
    rows: [headerRow, bodyRow],
  });
}

function imageParagraphs(
  img: LoadedImage,
  format: "png" | "jpeg",
  pageBreakBefore: boolean,
): Paragraph[] {
  const width = CONTENT_PX;
  const height = Math.round((img.height / img.width) * width);
  const children: (ImageRun | TextRun)[] = [];
  if (pageBreakBefore) children.push(new PageBreak());
  children.push(
    new ImageRun({
      type: format === "jpeg" ? "jpg" : "png",
      data: img.arrayBuffer,
      transformation: { width, height },
    }),
  );
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: pageBreakBefore ? 0 : 120, after: 120 },
      children,
    }),
  ];
}

function renderBlock(
  block: Block,
  logo: LoadedImage | null,
  images: Map<string, LoadedImage>,
): (Paragraph | Table)[] {
  switch (block.type) {
    case "titlePage": {
      const items: (Paragraph | Table)[] = [];
      if (logo) {
        const targetWidth = 220;
        const targetHeight = Math.round((logo.height / logo.width) * targetWidth);
        items.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 240 },
            children: [
              new ImageRun({
                type: "png",
                data: logo.arrayBuffer,
                transformation: { width: targetWidth, height: targetHeight },
              }),
            ],
          }),
        );
      }
      items.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: logo ? 120 : 1200, after: 120 },
          children: [
            new TextRun({ text: block.title, bold: true, color: BRAND, size: 56 }),
          ],
        }),
      );
      if (block.subtitle) {
        items.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: block.subtitle, color: BRAND_MEDIUM, size: 32 }),
            ],
          }),
        );
      }
      if (block.org) {
        items.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: block.org, size: 26, color: BRAND_MEDIUM })],
          }),
        );
      }
      items.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
          children: [],
        }),
      );
      return items;
    }
    case "h1":
      return [heading1(block.text)];
    case "h2":
      return [heading2(block.text)];
    case "h3":
      return [heading3(block.text)];
    case "p":
      return [para(block.text)];
    case "kv":
      return [labelValue(block.label, block.value)];
    case "bullet":
      return [bullet(block.text)];
    case "table":
      return [buildTable(block.headers, block.rows, block.widths)];
    case "encart":
      return [encartTable(block.rows), spacer()];
    case "signature":
      return [signatureTable(block.client, block.provider)];
    case "image": {
      const img = images.get(block.src);
      if (!img) return [];
      return imageParagraphs(img, block.format, block.fullPage ?? false);
    }
    case "spacer":
      return [spacer()];
    default:
      return [];
  }
}

export async function generatePtfDocx(data: PtfFormData): Promise<Blob> {
  const blocks = buildPtfBlocks(data);
  const [logo, images] = await Promise.all([loadLogo(), loadBlockImages(blocks)]);
  const body: (Paragraph | Table)[] = [];
  for (const block of blocks) body.push(...renderBlock(block, logo, images));

  const doc = new Document({
    creator: "Akkodis",
    title:
      typeof data.project_title === "string" && data.project_title.trim() !== ""
        ? data.project_title
        : "Proposition Technique et Financière",
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            // A4 (twips)
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: body,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export { downloadBlob } from "./ptf-content";

