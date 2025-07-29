import { PDFDocument } from "pdf-lib";

export const mergePdfs = async (pdfBlobs, finalFileName) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (let blob of pdfBlobs) {
      const existingPdf = await PDFDocument.load(await blob.arrayBuffer());
      const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());

      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBlob = new Blob([await mergedPdf.save()], { type: "application/pdf" });

    // Create a download link for the merged PDF
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(mergedPdfBlob);
    downloadLink.download = finalFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    return mergedPdfBlob;
  } catch (error) {
    console.error("Error merging PDFs:", error);
  }
};
