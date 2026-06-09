import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import OpenAI from "openai";
import schema from "./schema-ptf.json";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `${process.env.AKKODIS_API_URL}/deployments/${process.env.AKKODIS_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AKKODIS_API_VERSION },
  defaultHeaders: { "api-key": process.env.OPENAI_API_KEY },
});

function buildPrompt(rawText: string, fileName: string, profileData?: Record<string, unknown>): string {
  type FieldDef = {
    type: string;
    description: string;
    rule?: string;
  };

  type Schema = {
    specifications: Record<string, FieldDef>;
    profiles: Record<string, FieldDef>;
  };

  const { specifications: specs, profiles } = schema as Schema;

  const formatFields = (fields: Record<string, FieldDef>) =>
    Object.entries(fields)
      .map(([key, v]) => {
        let line = `- "${key}" (${v.type}): ${v.description}`;
        if (v.rule) line += ` [RULE: ${v.rule}]`;
        return line;
      })
      .join("\n");

  const specFields = formatFields(specs);
  const profileFields = formatFields(profiles);

  let profileSection = "";
  if (profileData) {
    profileSection = `\n---\nCANDIDATE PROFILE (JSON):\n${JSON.stringify(profileData, null, 2)}\n---\n`;
  }

  return `You are a document analysis assistant. Extract structured information from the following specification document and candidate profile.

File name: ${fileName}

Return ONLY a valid JSON object with this structure:
{
  "specifications": { ... },
  "profiles": { ... }
}

SPECIFICATIONS fields (extracted from the specification document):
${specFields}

PROFILES fields (extracted from the candidate profile JSON):
${profileFields}

If a field cannot be found in either source, set its value to null.

---
SPECIFICATION DOCUMENT:
${rawText}
---
${profileSection}
Respond with ONLY the JSON object, no explanation, no markdown fences.`;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const specFile = formData.get("specFile") as File | null;
  const profileFile = formData.get("profileFile") as File | null;

  if (!specFile) {
    return NextResponse.json(
      { error: "specFile is required" },
      { status: 400 },
    );
  }

  if (!profileFile) {
    return NextResponse.json(
      { error: "profileFile is required" },
      { status: 400 },
    );
  }

  // 1. Extract raw text from spec
  let rawText = "";

  if (specFile.name.endsWith(".docx")) {
    const buffer = Buffer.from(await specFile.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value;
  } else if (specFile.name.endsWith(".pdf")) {
    const arrayBuffer = await specFile.arrayBuffer();
    const { extractText } = await import("unpdf");
    const result = await extractText(new Uint8Array(arrayBuffer));
    rawText = Array.isArray(result.text)
      ? result.text.join("\n")
      : String(result.text);
  } else {
    return NextResponse.json(
      { error: "Unsupported format. Use .docx or .pdf" },
      { status: 400 },
    );
  }

  // 2. Parse profile JSON (optional)
  let profileData: Record<string, unknown> | undefined;

  if (profileFile) {
    const profileContent = await profileFile.text();
    try {
      profileData = JSON.parse(profileContent);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in profile file" },
        { status: 400 },
      );
    }
  }

  // 3. Call OpenAI to extract structured data
  const fileName = specFile.name.replace(/\.(docx|pdf)$/i, "");
  const completion = await openai.chat.completions.create({
    model: process.env.AKKODIS_DEPLOYMENT_NAME!,
    temperature: 0,
    messages: [{ role: "user", content: buildPrompt(rawText, fileName, profileData) }],
  });

  const content = completion.choices[0]?.message?.content ?? "";

  // 3. Parse AI response
  let structured: Record<string, unknown>;
  try {
    structured = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: content },
      { status: 500 },
    );
  }

  return NextResponse.json({ structured, rawText });
}
