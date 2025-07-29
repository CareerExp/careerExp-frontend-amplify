import React from "react";

import { fonts } from "../../../utility/fonts.js";

const PdfFooter = ({ pageNumber }) => {
  return (
    <div
      style={{
        position: "relative",
        bottom: -350,
        left: -10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: 0.5,
        padding: "0 20px",
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
        © CareerExplorer.me @2025
      </p>
      <p
        style={{
          color: "#787878",
          textAlign: "right",
          fontSize: "12px",
          fontFamily: fonts.poppins,
          fontWeight: "bold",
          marginLeft: "500px",
        }}
      >
        Page {pageNumber}
      </p>
    </div>
  );
};

export default PdfFooter;
