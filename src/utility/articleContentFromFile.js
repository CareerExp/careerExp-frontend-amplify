/**
 * Extract article content from PDF or Word (.docx) for use in the rich text editor.
 * PDF → plain text converted to simple HTML paragraphs.
 * DOCX → HTML via mammoth (preserves headings, lists, bold, etc.).
 */

/**
 * @param {File} file - PDF or .docx file
 * @returns {Promise<{ content: string }>} - HTML string for Quill
 */
export async function extractContentFromFile(file) {
  if (!file) throw new Error("No file provided");
  const name = (file.name || "").toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isDocx =
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (isPdf) {
    return extractFromPdf(file);
  }
  if (isDocx) {
    return extractFromDocx(file);
  }
  throw new Error("Unsupported file type. Please use a PDF or Word (.docx) file.");
}

/**
 * @param {File} file - PDF file
 * @returns {Promise<{ content: string }>}
 */
async function extractFromPdf(file) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const [pdfjsLib, workerUrlModule] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.min.mjs?url").catch(() => ({ default: "" })),
  ]);
  const pdfjs = pdfjsLib.default || pdfjsLib;
  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions && workerUrlModule.default) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrlModule.default;
  }

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer, useSystemFonts: true });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const parts = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => (item.str || "")).join(" ");
    if (pageText.trim()) parts.push(pageText.trim());
  }

  const rawText = parts.join("\n\n");
  const content = rawText
    ? rawText
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("")
    : "<p></p>";
  return { content };
}

/**
 * @param {File} file - .docx file
 * @returns {Promise<{ content: string }>}
 */
async function extractFromDocx(file) {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const content = (result.value || "").trim() || "<p></p>";
  return { content };
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
