import { http } from "./http";

// NOTE: backend இல்லனா app still run ஆக mock mode use பண்ணலாம்.
// கீழே mock data fallback add பண்ணிருக்கேன்.

const mockDocs = [
  {
    id: "001",
    language: "Tamil",
    source: "Manual",
    license: "CC BY",
    createdAt: "2026-02-17",
    excerpt: "Sample text preview…",
    rawText: "Apple released a new iphone",
    cleanText: "Apple released a new iphone",
    tokens: ["Apple", "released", "a", "new", "iphone"],
    pos: [
      { token: "Apple", tag: "NOUN" },
      { token: "released", tag: "VERB" },
      { token: "iphone", tag: "NOUN" },
    ],
  },
];

export async function uploadDocument(payload) {
  // payload: { inputType, text, file, url, language, source, license, title, domain }
  // Backend suggested (FastAPI) flow exists :contentReference[oaicite:3]{index=3}
  // Endpoint suggestion:
  // POST /api/documents/upload  -> returns { jobId }
  try {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") form.append(k, v);
    });

    const res = await http.post("/api/documents/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { jobId }
  } catch (e) {
    // mock job
    return { jobId: "mock-job-123" };
  }
}

export async function getJobStatus(jobId) {
  // GET /api/jobs/:jobId -> { status: "processing|done|failed", steps: {...}, documentId? }
  try {
    const res = await http.get(`/api/jobs/${jobId}`);
    return res.data;
  } catch {
    // mock progress
    return {
      status: "done",
      steps: { extracting: true, cleaning: true, nlp: true },
      documentId: "001",
    };
  }
}

export async function searchDocuments(params) {
  // GET /api/documents?query=&language=&source=&from=&to=
  try {
    const res = await http.get("/api/documents", { params });
    return res.data; // { items: [...] }
  } catch {
    return { items: mockDocs };
  }
}

export async function getDocumentById(id) {
  // GET /api/documents/:id
  try {
    const res = await http.get(`/api/documents/${id}`);
    return res.data;
  } catch {
    return mockDocs.find((d) => d.id === id) || null;
  }
}

export function downloadJson(obj, filename = "dataset.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(rows, filename = "dataset.csv") {
  const escape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const header = Object.keys(rows[0] || {}).join(",");
  const body = rows.map((r) => Object.values(r).map(escape).join(",")).join("\n");
  const csv = header + "\n" + body;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
