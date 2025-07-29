import React from "react";

import { pdfLogo } from "../../../assets/assest.js";
import { fonts } from "../../../utility/fonts.js";

const PdfHeader = () => {
  return (
    <div
      style={{
        position: "relative",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: 0.5,
        padding: "20px 20px",
      }}
    >
      <p
        style={{
          color: "#787878",
          textAlign: "left",
          fontSize: "12px",
          fontFamily: fonts.poppins,
          fontWeight: "bold",
        }}
      >
        Career Direction Report
      </p>
      <img src={pdfLogo} alt="" width={"100px"} />
    </div>
  );
};

export default PdfHeader;
