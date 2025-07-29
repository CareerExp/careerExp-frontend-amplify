import React from "react";

import PdfFooter from "../pdfComponents/PdfFooter";
import PdfHeader from "../pdfComponents/PdfHeader";

const NewPage = ({ children, pageNumber }) => {
  return (
    <div
      style={{
        width: "210mm",
        height: "297mm",
        margin: "auto",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {PdfHeader()}

      <div>{children}</div>

      <div
        style={{
          position: "absolute",
          bottom: "380px",
          left: "20px",
        }}
      >
        {/* {PdfFooter()} */}
        <PdfFooter pageNumber={pageNumber} />
      </div>
    </div>
  );
};

export default NewPage;
