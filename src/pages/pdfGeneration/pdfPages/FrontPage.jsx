import React from "react";
import { firstPageBg, pdfLogo } from "../../../assets/assest.js";
import { fonts } from "../../../utility/fonts.js";
import { formatDate } from "../pdfUtility/formatDate.js";
const FrontPage = ({ fullName, assessmentDate }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "210mm",
        height: "297mm",
        margin: "auto",
        backgroundColor: "white",
      }}
    >
      <img
        src={firstPageBg}
        alt="First Page Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* Additional content can be added here */}

      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        <img
          src={pdfLogo}
          alt="Logo"
          style={{
            position: "absolute",
            top: 100,
            left: 100,
            width: "25%",
          }}
        />

        <div
          style={{
            width: "300px",
            height: "50px",
            position: "absolute",
            top: 300,
            left: 50,
            backgroundColor: "#BC2876",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "white",
              textAlign: "center",
              fontSize: "26px",
              fontWeight: 600,
              fontFamily: fonts.poppins,
            }}
          >
            {formatDate(assessmentDate)}
          </span>
        </div>

        <div
          style={{
            width: "300px",
            position: "absolute",
            top: 400,
            left: 50,
          }}
        >
          <span
            style={{
              color: "#720361",
              textAlign: "left",
              fontSize: "76px",
              fontWeight: "bold",
              fontFamily: fonts.poppins,
              lineHeight: "90px",
            }}
          >
            CAREER DIRECTIONS REPORTS
          </span>
        </div>

        <div
          style={{
            width: "300px",
            position: "absolute",
            top: 680,
            left: 50,
          }}
        >
          <span
            style={{
              color: "#787876",
              textAlign: "left",
              fontSize: "26px",
              fontWeight: "bold",
              fontFamily: fonts.poppins,
              lineHeight: "90px",
            }}
          >
            {fullName}
          </span>
        </div>

        <div
          style={{
            width: "400px",
            height: "50px",
            position: "absolute",
            top: 1072,
            left: 0,
            background: "linear-gradient(25deg, #BF2F75, #720361)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "0px 90px 0px 0px",
          }}
        >
          <span
            style={{
              color: "white",
              textAlign: "left",
              fontSize: "20px",
              fontFamily: fonts.poppins,
            }}
          >
            © CareerExplorer.me @2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
