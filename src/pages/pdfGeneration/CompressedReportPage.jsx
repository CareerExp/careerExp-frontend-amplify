import { CircularProgress, Box } from "@mui/material";
import ReactECharts from "echarts-for-react";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../../redux/slices/authSlice.js";
import {
  generateDeatiledDataOfCareers,
  selectDetailedCareerData,
  selectFullName,
  selectInterestProfileData,
  selectPersonalityInsight,
} from "../../redux/slices/onetSlice.js";
import { uploadCdrToStorage } from "../../redux/slices/unifiedRecordSlice.js";
import { fonts } from "../../utility/fonts.js";
import { data } from "./assessmnetExample.js";
import DetailedCareerPathways from "./pdfPages/DetailedCareerPathways.jsx";
import FirstPage from "./pdfPages/FrontPage.jsx";
import NewPage from "./pdfPages/NewPage.jsx";
import PersonalityFactor from "./pdfPages/PersonalityFactor.jsx";
import PersonalityInsightsPage from "./pdfPages/PersonalityInsightsPage.jsx";
import { colorMap } from "./pdfUtility/colorCode.js";
import { dynamicGraph } from "./pdfUtility/dynamicGraph.js";
import { getFirstName } from "./pdfUtility/getFirstName.js";
import { mergePdfs } from "./pdfUtility/mergePdf.js";
// separate componenets for pdf
import RenderTextWithLineBreaks from "./pdfUtility/RenderTextWithLineBreaks.jsx";
import { splitTextIntoPages } from "./pdfUtility/splitTextIntoPages.js";
import { top3Sphere } from "./pdfUtility/top3Sphere.js";

const CompressedReportPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const attempt = searchParams.get("attempt");
  const dispatchToRedux = useDispatch();
  const pdfRef = useRef();
  const isAuthenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  // data to be shown on pdf
  const fullName = useSelector(selectFullName);
  const personalityInsight = useSelector(selectPersonalityInsight);
  const detailedCareerData = useSelector(selectDetailedCareerData);
  const interestProfileData = useSelector(selectInterestProfileData);
  // data to be shown on pdf
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [savingToStorage, setSavingToStorage] = useState(false);

  // const fullName = data.fullname;
  // const personalityInsight = data.userReportdata;
  // const detailedCareerData = data.totalData;
  // const interestProfileData = data.interestProfileData;

  // console.log("interestProfileData", interestProfileData);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true); // Set loading to true before making the request
          await dispatchToRedux(
            generateDeatiledDataOfCareers({
              userId,
              token,
              attemptNumber: attempt,
            })
          );
          setLoading(false); // Set loading to false after the request is done
        } catch (error) {
          console.log("error", error);
          setLoading(false); // Set loading to false even if there is an error
        }
      }
    };

    fetchData();
  }, [isAuthenticated, userId, token, dispatchToRedux]);

  // console.log("userId", userId);
  // console.log("detailedCareerData", detailedCareerData);
  // console.log("fullName", fullName);
  // console.log("personalityInsight", personalityInsight);
  // console.log("interestProfielDara", interestProfileData);

  // const generatePdf = async () => {
  //   try {
  //     setButtonLoading(true);
  //     const element = pdfRef.current; // Get the content to render as PDF
  //     const fileName = `${fullName}_CDR.pdf`;

  //     const options = {
  //       margin: 0,
  //       filename: fileName,
  //       image: {
  //         type: "jpeg",
  //         quality: 0.98,
  //       },
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         letterRendering: true,
  //         scrollY: 0,
  //         windowWidth: 1024, // Force desktop viewport width
  //         onrendered: function (canvas) {
  //           document.body.style.overflow = "auto"; // Reset scroll after render
  //         },
  //       },
  //       jsPDF: {
  //         unit: "mm",
  //         format: "a4",
  //         orientation: "portrait",
  //         compress: true,
  //         hotfixes: ["px_scaling"],
  //         preferCSSPageSize: true,
  //       },
  //     };

  //     // Prepare the document for PDF generation
  //     const preparePdfGeneration = () => {
  //       // Store current scroll position
  //       const scrollPos = window.pageYOffset;
  //       // Temporarily disable scrolling
  //       document.body.style.overflow = "hidden";
  //       // Force window scroll to top
  //       window.scrollTo(0, 0);
  //       return scrollPos;
  //     };

  //     // Restore document state after PDF generation
  //     const cleanupPdfGeneration = (scrollPos) => {
  //       document.body.style.overflow = "auto";
  //       window.scrollTo(0, scrollPos);
  //     };

  //     const pdfSections = [
  //       { id: "pdf-section-0", fileName: `${fullName}_part0.pdf` },
  //       { id: "pdf-section-1", fileName: `${fullName}_part1.pdf` },
  //       { id: "pdf-section-2", fileName: `${fullName}_part2.pdf` },
  //       { id: "pdf-section-3", fileName: `${fullName}_part3.pdf` },
  //       { id: "pdf-section-4", fileName: `${fullName}_part4.pdf` },
  //       { id: "pdf-section-5", fileName: `${fullName}_part5.pdf` },
  //       { id: "pdf-section-6", fileName: `${fullName}_part6.pdf` },
  //       { id: "pdf-section-7", fileName: `${fullName}_part7.pdf` },
  //     ];

  //     let pdfBlobs = [];
  //     const scrollPos = preparePdfGeneration();

  //     try {
  //       for (let section of pdfSections) {
  //         const element = document.getElementById(section.id);
  //         if (!element) continue;

  //         await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay between sections
  //         const pdfBlob = await html2pdf()
  //           .from(element)
  //           .set(options)
  //           .outputPdf("blob");
  //         pdfBlobs.push(pdfBlob);
  //       }

  //       let pdfBlob = await mergePdfs(pdfBlobs, fileName);

  //       // Save Locally
  //       const localDownloadLink = document.createElement("a");
  //       localDownloadLink.href = URL.createObjectURL(pdfBlob);
  //       localDownloadLink.download = fileName;
  //       document.body.appendChild(localDownloadLink);
  //       localDownloadLink.click();
  //       document.body.removeChild(localDownloadLink);

  //       // Convert Blob to File for AWS Upload
  //       const pdfFile = new File([pdfBlob], fileName, {
  //         type: "application/pdf",
  //       });

  //       // Prepare FormData for upload
  //       const formData = new FormData();
  //       formData.append("cdr", pdfFile);
  //       setButtonLoading(false);
  //       setSavingToStorage(true);

  //       // Upload to AWS using dispatch function
  //       const response = await dispatchToRedux(
  //         uploadCdrToStorage({
  //           token,
  //           formData,
  //           userId,
  //           attemptNumber: attempt,
  //         })
  //       );
  //       setSavingToStorage(false);

  //       console.log("Upload response:", response);
  //     } finally {
  //       cleanupPdfGeneration(scrollPos);
  //     }
  //   } catch (error) {
  //     console.error("Error generating or uploading PDF:", error.message);
  //     setButtonLoading(false);
  //     setSavingToStorage(false);
  //   }
  // };

  // New function to generate compressed PDF
  const generateCompressedPdf = async () => {
    setLoading(true);
    try {
      const pdfs = []; // plain JS array

      for (let i = 0; i < 8; i++) {
        const element = document.getElementById(`pdf-section-${i}`);
        if (element) {
          const opt = {
            margin: [5, 0, 5, 0],
            filename: fileName,
            image: { type: "jpeg", quality: 0.6 }, // lower quality
            html2canvas: { scale: 1.5, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          };
          const pdfBlob = await html2pdf()
            .set(opt)
            .from(element)
            .output("blob");
          pdfs.push(pdfBlob);
        }
      }

      const mergedPdfBlob = await mergePdfs(pdfs);

      const pdfDoc = await PDFLib.PDFDocument.load(
        await mergedPdfBlob.arrayBuffer()
      );
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
      });
      const compressedBlob = new Blob([compressedBytes], {
        type: "application/pdf",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(compressedBlob);
      link.download = fileName.replace(".pdf", "-compressed.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating compressed PDF", err);
    } finally {
      setLoading(false);
    }
  };

  // calculating character length
  const maxCharsPerPage = 2265;
  const textPages = splitTextIntoPages(
    personalityInsight?.personality_insight || "",
    maxCharsPerPage
  );

  return (
    <>
      {loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : (
        <div>
          {" "}
          <div style={{ backgroundColor: "gray" }}>
            <button
              onClick={generateCompressedPdf}
              style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                zIndex: 1000,
                backgroundImage:
                  "linear-gradient(to top left, #720361, #bf2f75)",
                border: "none",
                padding: "0.6rem 1rem",
                borderRadius: "90px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
                fontSize: "1.125rem",
                gap: "0.875rem",
                color: "white",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              }}
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "200px",
                    height: "100%",
                  }}
                >
                  <CircularProgress
                    size={24}
                    sx={{ color: "white", marginRight: "8px" }}
                  />{" "}
                  Downloading...
                </Box>
              ) : savingToStorage ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "200px",
                    height: "100%",
                  }}
                >
                  <CircularProgress
                    size={24}
                    sx={{ color: "white", marginRight: "8px" }}
                  />{" "}
                  Saving Data...
                </Box>
              ) : (
                "Generate PDF"
              )}
            </button>
            {/* Content to be rendered in the PDF */}

            <div ref={pdfRef}>
              {/* Front Page /Cover Page */}
              <div id="pdf-section-0">
                <FirstPage
                  fullName={fullName}
                  assessmentDate={interestProfileData?.createdAt}
                />
                {/* About this report  */}
                <NewPage pageNumber={2}>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0px 45px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#720361",
                        // padding: "10px 20px",
                        textAlign: "center",
                        marginTop: "-20px",
                        padding: 0,
                      }}
                    >
                      About this Report
                    </span>

                    <div style={{ marginTop: "20px", textAlign: "justify" }}>
                      <span>
                        The Career Directions Report is derived from well tested
                        and proven methodologies that analyze an individuals’
                        interests using six domains – Realistic, Conventional,
                        Enterprising, Social, Artistic and Investigative. We
                        call these Interest Spheres and a short explanation of
                        each one is shown later.
                        <br /> <br />
                        We all have unique personalities and interests that come
                        together to define who we are. The weight of influence
                        of each of these Interest Spheres is different for each
                        one of us and how they combine gives us insights on the
                        career choices we can make . Our natural personality
                        traits influence the success that we are likely to
                        achieve in these careers, so the analysis you will see
                        in this Career Directions Report gives you tailored
                        Personality Insights that give you an additional pointer
                        when you are selecting the career path that is best
                        suited to you.
                        <br /> <br />
                        Our predictive algorithms use the responses that you
                        have given to present to you 20 different job profiles
                        that you should investigate further and consider for
                        your future. You will see a ‘Personality Factor’
                        assigned to each job. This is based on our analysis of
                        your personality as derived from your survey results.
                        <br /> <br />
                        Remember your future is in your hands to craft as you
                        choose. Initial choices will no doubt be refined as you
                        explore the opportunities that are right for you.
                        <br /> <br /> Share the findings of this report with
                        your friends and family and get them to help you assess
                        and fine-tune your career ideas so you can visualize the
                        best future for you.
                        <br /> <br />
                        The world of work is moving at a tremendous pace. We
                        encourage you to use the resources on the
                        CareerExplorer.me platform to navigate in the direction
                        that is best for you.
                      </span>
                    </div>
                  </div>
                </NewPage>
                {/* Table of Content  */}
                <NewPage pageNumber={3}>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0px 45px",
                      textAlign: "center",
                      lineHeight: "40px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#720361",
                        // padding: "10px 20px",
                        textAlign: "center",
                        marginTop: "-20px",
                        padding: 0,
                        lineHeight: "40px",
                      }}
                    >
                      Table Of Contents
                    </span>

                    <div style={{ marginTop: "20px", textAlign: "justify" }}>
                      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            <span style={{ color: "#FF8A00" }}>
                              Section 1:{" "}
                            </span>
                            Your Career Journey unfolds
                          </p>
                          <span>4</span>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            <span style={{ color: "#FF8A00" }}>
                              Section 2:{" "}
                            </span>{" "}
                            Career Interest
                          </p>
                          <span>6</span>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            {" "}
                            <span style={{ color: "#FF8A00" }}>
                              Section 3:{" "}
                            </span>
                            Top 20 Carers you must consider
                          </p>
                          <span>8</span>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            {" "}
                            <span style={{ color: "#FF8A00" }}>
                              Section 4:{" "}
                            </span>
                            Personality Insights
                          </p>
                          <span>12</span>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            {" "}
                            <span style={{ color: "#FF8A00" }}>
                              Section 5:{" "}
                            </span>
                            Detailed Career Pathways
                          </p>
                          <span>20</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </NewPage>
                {/* Section 1  */}
                <div>
                  {textPages.map((pageText, index) => (
                    <NewPage key={index} pageNumber={4 + index}>
                      <div
                        style={{
                          position: "relative",
                          zIndex: 1,
                          padding: "0px 45px",
                          textAlign: "left",
                        }}
                      >
                        {index === 0 && (
                          <>
                            <div style={{ textAlign: "left" }}>
                              <span
                                style={{
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                  marginTop: "20px",
                                  color: "#FF8A00",
                                }}
                              >
                                Section 1
                              </span>
                            </div>

                            <span
                              style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: "#720361",
                                // padding: "10px 20px",
                                textAlign: "center",
                                marginTop: "-20px",
                                padding: 0,
                              }}
                            >
                              Your Career Journey unfolds
                            </span>
                          </>
                        )}

                        <div style={{ marginTop: "0px", textAlign: "justify" }}>
                          <span>
                            {index === 0 && (
                              <>
                                Your Career Directions Report draws on the
                                assessments that you have completed and the
                                information that you have shared on your
                                educational preferences and aspirations.
                                <br /> <br />
                              </>
                            )}
                            {RenderTextWithLineBreaks(pageText)}
                          </span>
                        </div>
                      </div>
                    </NewPage>
                  ))}
                </div>
                {/* Section 2  */}
                <NewPage pageNumber={6}>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0px 45px",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          marginTop: "20px",
                          color: "#FF8A00",
                        }}
                      >
                        Section 2
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#720361",
                        // padding: "10px 20px",
                        textAlign: "center",
                        marginTop: "-20px",
                        padding: 0,
                        // marginTop: "-20px",
                      }}
                    >
                      Career Interests
                    </span>

                    <div style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          marginTop: "20px",
                          color: "#8C001B",
                        }}
                      >
                        Interest Profile Graph
                      </span>
                    </div>

                    <div style={{ marginTop: "0px", textAlign: "justify" }}>
                      <span>
                        {getFirstName(fullName)}, your Interests Profile Graph
                        is derived from your responses in the first part of your
                        Assessment. Core elements that make up who you always
                        remain, but as your experiences grow some of your
                        interests become more or less pronounced on the graph.
                        Your initial focus should be selecting careers that
                        bring together a combination of your top 3 Interest
                        Spheres.
                        <br /> <br />
                        <div style={{ paddingTop: "30px" }}>
                          <ReactECharts
                            option={dynamicGraph(interestProfileData)}
                            style={{ height: "400px", width: "100%" }}
                          />
                        </div>
                      </span>

                      <div style={{ paddingTop: "30px" }}>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#8C001B",
                          }}
                        >
                          Top 3 Sphere
                        </span>

                        <div style={{ marginTop: "0px", textAlign: "justify" }}>
                          {top3Sphere(interestProfileData)?.map(
                            (sphere, index) => (
                              <div key={index}>{sphere}</div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </NewPage>
                {/* Interest Sphere Scores */}
                <NewPage pageNumber={7}>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0px 45px",
                      textAlign: "left",
                    }}
                  >
                    <span>
                      {interestProfileData?.results?.result?.map(
                        (sphere, index) => (
                          <div key={index} style={{ marginBottom: "20px" }}>
                            <div>
                              <strong>
                                Interest Sphere:{" "}
                                <span
                                  style={{ color: "#720361", fontSize: "18px" }}
                                >
                                  {sphere.area}
                                </span>
                              </strong>
                            </div>
                            <div>
                              <strong>Score: {sphere.score}</strong>
                            </div>
                            <div>{sphere.description}</div>
                          </div>
                        )
                      )}
                    </span>
                  </div>
                </NewPage>
                {/* section 3 personality factor */}
                <PersonalityFactor
                  interestProfileData={interestProfileData}
                  fullName={fullName}
                />
                {/* section 4 personality insighnts  */}
                <PersonalityInsightsPage
                  personalityInsight={personalityInsight}
                />

                <NewPage pageNumber={19}>
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0px 45px",
                      textAlign: "left",
                      height: "100vh", // Ensure full height of the page
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%", // Ensure it stretches
                        padding: "20px", // Add padding to avoid text sticking to the edges
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#FF8A00",
                          margin: "0",
                        }}
                      >
                        Section 5
                      </p>
                      <p
                        style={{
                          fontSize: "32px",
                          fontWeight: "bold",
                          color: "#720361",
                          padding: "10px 20px",
                          textAlign: "center",
                          margin: "10px 0 0 0", // Proper margin adjustment
                        }}
                      >
                        Detailed Career Pathways
                      </p>
                    </div>
                  </div>
                </NewPage>
              </div>
              {/* Detailed Career Pathways  */}

              <div id="pdf-section-1">
                {detailedCareerData[0] &&
                  interestProfileData?.careers?.career[0] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[0]}
                      interestProfileData={
                        interestProfileData?.careers?.career[0]
                      }
                      pageNumber={20}
                    />
                  )}
                {detailedCareerData[1] &&
                  interestProfileData?.careers?.career[1] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[1]}
                      interestProfileData={
                        interestProfileData?.careers?.career[1]
                      }
                      pageNumber={23}
                    />
                  )}
                {detailedCareerData[2] &&
                  interestProfileData?.careers?.career[2] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[2]}
                      interestProfileData={
                        interestProfileData?.careers?.career[2]
                      }
                      pageNumber={26}
                    />
                  )}
              </div>

              <div id="pdf-section-2">
                {detailedCareerData[3] &&
                  interestProfileData?.careers?.career[3] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[3]}
                      interestProfileData={
                        interestProfileData?.careers?.career[3]
                      }
                      pageNumber={29}
                    />
                  )}
                {detailedCareerData[4] &&
                  interestProfileData?.careers?.career[4] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[4]}
                      interestProfileData={
                        interestProfileData?.careers?.career[4]
                      }
                      pageNumber={32}
                    />
                  )}
                {detailedCareerData[5] &&
                  interestProfileData?.careers?.career[5] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[5]}
                      interestProfileData={
                        interestProfileData?.careers?.career[5]
                      }
                      pageNumber={35}
                    />
                  )}
              </div>

              <div id="pdf-section-3">
                {detailedCareerData[6] &&
                  interestProfileData?.careers?.career[6] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[6]}
                      interestProfileData={
                        interestProfileData?.careers?.career[6]
                      }
                      pageNumber={38}
                    />
                  )}
                {detailedCareerData[7] &&
                  interestProfileData?.careers?.career[7] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[7]}
                      interestProfileData={
                        interestProfileData?.careers?.career[7]
                      }
                      pageNumber={41}
                    />
                  )}
                {detailedCareerData[8] &&
                  interestProfileData?.careers?.career[8] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[8]}
                      interestProfileData={
                        interestProfileData?.careers?.career[8]
                      }
                      pageNumber={44}
                    />
                  )}
              </div>

              <div id="pdf-section-4">
                {detailedCareerData[9] &&
                  interestProfileData?.careers?.career[9] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[9]}
                      interestProfileData={
                        interestProfileData?.careers?.career[9]
                      }
                      pageNumber={47}
                    />
                  )}
                {detailedCareerData[10] &&
                  interestProfileData?.careers?.career[10] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[10]}
                      interestProfileData={
                        interestProfileData?.careers?.career[10]
                      }
                      pageNumber={50}
                    />
                  )}
                {detailedCareerData[11] &&
                  interestProfileData?.careers?.career[11] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[11]}
                      interestProfileData={
                        interestProfileData?.careers?.career[11]
                      }
                      pageNumber={53}
                    />
                  )}
              </div>

              <div id="pdf-section-5">
                {detailedCareerData[12] &&
                  interestProfileData?.careers?.career[12] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[12]}
                      interestProfileData={
                        interestProfileData?.careers?.career[12]
                      }
                      pageNumber={56}
                    />
                  )}
                {detailedCareerData[13] &&
                  interestProfileData?.careers?.career[13] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[13]}
                      interestProfileData={
                        interestProfileData?.careers?.career[13]
                      }
                      pageNumber={59}
                    />
                  )}
                {detailedCareerData[14] &&
                  interestProfileData?.careers?.career[14] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[14]}
                      interestProfileData={
                        interestProfileData?.careers?.career[14]
                      }
                      pageNumber={62}
                    />
                  )}
              </div>

              <div id="pdf-section-6">
                {detailedCareerData[15] &&
                  interestProfileData?.careers?.career[15] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[15]}
                      interestProfileData={
                        interestProfileData?.careers?.career[15]
                      }
                      pageNumber={65}
                    />
                  )}
                {detailedCareerData[16] &&
                  interestProfileData?.careers?.career[16] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[16]}
                      interestProfileData={
                        interestProfileData?.careers?.career[16]
                      }
                      pageNumber={68}
                    />
                  )}
                {detailedCareerData[17] &&
                  interestProfileData?.careers?.career[17] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[17]}
                      interestProfileData={
                        interestProfileData?.careers?.career[17]
                      }
                      pageNumber={71}
                    />
                  )}
              </div>

              <div id="pdf-section-7">
                {detailedCareerData[18] &&
                  interestProfileData?.careers?.career[18] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[18]}
                      interestProfileData={
                        interestProfileData?.careers?.career[18]
                      }
                      pageNumber={74}
                    />
                  )}
                {detailedCareerData[19] &&
                  interestProfileData?.careers?.career[19] && (
                    <DetailedCareerPathways
                      detailedCareerData={detailedCareerData[19]}
                      interestProfileData={
                        interestProfileData?.careers?.career[19]
                      }
                      pageNumber={77}
                    />
                  )}
              </div>

              {/* ending  */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompressedReportPage;
