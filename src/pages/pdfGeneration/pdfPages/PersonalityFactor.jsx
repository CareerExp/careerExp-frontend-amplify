import { Rating } from "@mui/material";
import React from "react";

import { getFirstName } from "../pdfUtility/getFirstName";
import NewPage from "./NewPage";

const PersonalityFactor = ({ interestProfileData, fullName }) => {
  return (
    <>
      {/* personality factor analysis */}
      {/* 20 career  */}

      <NewPage pageNumber={8}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
          }}
        >
          {/* Section Title */}
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "24px", fontWeight: "bold", marginTop: "20px", color: "#FF8A00" }}>
              Section 3
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#720361",
              display: "block",
              padding: "10px 0",
              textAlign: "left",
            }}
          >
            Top 20 Careers you must consider
          </span>

          {/* Description */}
          <div style={{ marginBottom: "15px" }}>
            <span style={{ display: "block", lineHeight: "1.5" }}>
              Success in your career will come with making the right personal choices along with focus and
              perseverance. The next stage of our analysis is to look at the strengths that you bring with
              your natural personality and how these interface with career pathways based on your Interests
              and educational achievements.
              <br /> <br />
              We have identified 20 career pathways that you should seriously consider. For each of these we
              have analysed how your natural personality aligns with each one. This is represented on a 5 star
              scale. The stronger the fit the more likely you are likely to be successful in that career.
            </span>
          </div>

          {/* First 8 Careers */}
          <div
            style={{
              paddingTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
          >
            {interestProfileData?.careers?.career.slice(0, 8).map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "5px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "16px",
                      width: "90%",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {item.title}
                  </p>
                  <div
                    style={{
                      backgroundColor: "#bf2f75",
                      height: "24px",
                      width: "24px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      borderRadius: "50%",
                      fontWeight: "bold",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    P
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    padding: "5px 0",
                  }}
                >
                  <p
                    style={{
                      color: "gray",
                      fontWeight: 500,
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {item?.fit === "Best" ? "Good" : item?.fit} Fit
                  </p>
                  <Rating value={item?.match_score} readOnly size="small" style={{ fontSize: "1.2rem" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </NewPage>

      {/* 20 career continue  */}

      <NewPage pageNumber={9}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              paddingTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
          >
            {interestProfileData?.careers?.career.slice(8).map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "5px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "16px",
                      width: "90%",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {item.title}
                  </p>
                  <div
                    style={{
                      backgroundColor: "#bf2f75",
                      height: "24px",
                      width: "24px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      borderRadius: "50%",
                      fontWeight: "bold",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    P
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                    padding: "5px 0",
                  }}
                >
                  <p
                    style={{
                      color: "gray",
                      fontWeight: 500,
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {item?.fit === "Best" ? "Good" : item?.fit} Fit
                  </p>
                  <Rating value={item?.match_score} readOnly size="small" style={{ fontSize: "1.2rem" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </NewPage>
      {/* best fit analysis  */}
      <NewPage pageNumber={10}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#720361",
              display: "block",
              padding: "10px 0",
              textAlign: "left",
            }}
          >
            Best-fit Analysis
          </span>
          <div style={{ marginBottom: "15px" }}>
            <span style={{ display: "block", lineHeight: "1.5" }}>
              {getFirstName(fullName)} for each of the identified career pathways we have also analysed how
              well these fit with your current interests, educational preferences and aspirations. There are 3
              levels we have assigned to each career pathway:
            </span>

            <ul style={{ listStyleType: "disc", paddingLeft: "40px", margin: "15px 0" }}>
              <li>Perfect fit </li>
              <li>Great fit </li>
              <li>Best fit </li>
            </ul>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#FF8A00",
                display: "block",
                padding: "10px 0",
              }}
            >
              Detailed career pathways
            </span>
          </div>
          <span style={{ display: "block", lineHeight: "1.5", marginBottom: "10px" }}>
            For each career pathway that has been recommended for you there are 6 information sections that
            you should read and make notes on what you like or don't like:
          </span>
          <ul style={{ listStyleType: "disc", paddingLeft: "40px", margin: "15px 0" }}>
            <li>What people in these jobs do </li>
            <li>Knowledge required </li>
            <li>Skills required </li>
            <li>Abilities </li>
            <li>Personality type </li>
            <li>Technology competence </li>
          </ul>
          <span style={{ display: "block", lineHeight: "1.5", margin: "15px 0" }}>
            Academic requirements for each Career pathway are also identified along with relevant Colleges and
            Universities that offer the relevant programmes in the countries selected in the Educational
            survey.
          </span>
          <span style={{ display: "block", lineHeight: "1.5" }}>
            {getFirstName(fullName)}, please use this as the starting point on your career discovery and
            planning process.
          </span>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            marginTop: "20px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#FF8A00",
              display: "block",
              padding: "10px 0",
            }}
          >
            Important
          </span>
          <div style={{ marginBottom: "15px" }}>
            <span style={{ display: "block", lineHeight: "1.5" }}>
              You should not consider this as a closed or restricted list of careers. This is your starting
              point to use to investigate and dig down to find the right space for you. As you progress your
              education, the experiences and opportunities that become available to you will influence your
              career choices. Be open to change and seek help and assistance form your counsellors and friends
              and family to make your best choices.
            </span>
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#FF8A00",
              display: "block",
              padding: "10px 0",
            }}
          >
            What next?
          </span>
          <div>
            <span style={{ display: "block", lineHeight: "1.5" }}>
              Making the right career decisions needs careful analysis, investigation and reflection. As you
              become more informed you will instinctively develop a sense of the direction that's right for
              you.
            </span>
          </div>
        </div>
      </NewPage>
      {/* Important and what next  */}
      <NewPage pageNumber={11}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
          }}
        >
          <span style={{ display: "block", lineHeight: "1.5", marginBottom: "15px" }}>
            We recommend a 3-step plan for you to work through:
          </span>

          {/* Table */}
          <div style={{ marginTop: "20px", marginBottom: "25px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
            >
              <tbody>
                {/* Row 1: Network */}
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "bold",
                      width: "20%",
                      verticalAlign: "top",
                    }}
                  >
                    Network:
                  </td>
                  <td style={{ padding: "10px", lineHeight: "1.5" }}>
                    Speak to people you know in those fields. Ask them about their career journeys, what they
                    studied and how they got to their current job. What their aspirations are going forward.
                    What challenges they see on the horizon. Of course, ask for their guidance on
                    opportunities they can recommend in the field.
                  </td>
                </tr>

                {/* Row 2: Upskill */}
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "bold",
                      width: "20%",
                      verticalAlign: "top",
                    }}
                  >
                    Upskill:
                  </td>
                  <td style={{ padding: "10px", lineHeight: "1.5" }}>
                    Register for and complete some micro-credential or certification programmes online in the
                    fields that interest you most and are aligned to your selected career. CareerExplorer.me
                    has created the 'Opportunity' section on its platform for you to see options to build
                    knowledge and skills.
                  </td>
                </tr>

                {/* Row 3: Build Experiences */}
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "bold",
                      width: "20%",
                      verticalAlign: "top",
                    }}
                  >
                    Build Experiences:
                  </td>
                  <td style={{ padding: "10px", lineHeight: "1.5" }}>
                    Look into getting some work experience in your chosen fields. This can come in the form of
                    holiday jobs, remote work projects, virtual internships, or apprenticeships.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "20px" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#FF8A00",
                display: "block",
                padding: "10px 0",
              }}
            >
              And finally, you can take this Assessment up to 3 times
            </span>
            <div style={{ marginTop: "15px" }}>
              <span style={{ display: "block", lineHeight: "1.5" }}>
                As time goes by and you continue in your education and build new experiences and skills, your
                focus may change and you may want to look at alternative careers. This is very healthy and is
                a sign of maturity. You are now evaluating different options and engaging your mind towards
                new opportunities for you. You may now feel the need to re-assess yourself and check which
                career pathways now constitute your best-fit.
                <br /> <br />
                We are committed to helping you to achieve the success you deserve and so we provide 3
                Assessment takes that you can do for the one-time fee that you have paid. We advise you to
                spread your 3 attempts over one or two years to reflect the changes in your interests and
                attitudes.
                <br /> <br />
                Once you feel ready to take the assessment again, login to your account on CareerExplorer.me,
                go to 'My Assessments' in your personal workspace and hit the RE-ASSESS button to retake. All
                your Career Direction Reports will be logged for you under 'My Assessments' for you to see
                over a period of time, how your career thinking and planning has evolved.
                <br /> <br />
                Good Luck!
              </span>
            </div>
          </div>
        </div>
      </NewPage>
    </>
  );
};

export default PersonalityFactor;

// this is previously commented code

// import { Rating } from "@mui/material";
// import React from "react";

// import { getFirstName } from "../pdfUtility/getFirstName";
// import NewPage from "./NewPage";
// import { height, width } from "@mui/system";

// const PersonalityFactor = ({ interestProfileData, fullName }) => {
//   return (
//     <>
//       {/* personality factior analysis */}
//       {/* 20 career  */}

//       <NewPage pageNumber={8}>
//         <div
//           style={{
//             position: "relative",
//             zIndex: 1,
//             padding: "0px 45px",
//             textAlign: "left",
//           }}
//         >
//           {/* Section Title */}
//           <div style={{ textAlign: "left" }}>
//             <span style={{ fontSize: "24px", fontWeight: "bold", marginTop: "20px", color: "#FF8A00" }}>
//               Section 3
//             </span>
//           </div>
//           <span
//             style={{
//               fontSize: "32px",
//               fontWeight: "bold",
//               color: "#720361",
//               textAlign: "center",
//               padding: 0,
//               marginTop: "-20px",
//             }}
//           >
//             Top 20 Careers you must consider
//           </span>

//           {/* Description */}
//           <div>
//             <span>
//               Success in your career will come with making the right personal choices along with focus and
//               perseverance. The next stage of our analysis is to look at the strengths that you bring with
//               your natural personality and how these interface with career pathways based on your Interests
//               and educational achievements.
//               <br /> <br />
//               We have identified 20 career pathways that you should seriously consider. For each of these we
//               have analysed how your natural personality aligns with each one. This is represented on a 5 star
//               scale. The stronger the fit the more likely you are likely to be successful in that career.
//             </span>
//           </div>

//           {/* First 8 Careers */}
//           <div
//             style={{
//               paddingTop: "20px",
//               display: "grid",
//               gridTemplateColumns: "repeat(2, 1fr)",
//               gap: "20px",
//             }}
//           >
//             {interestProfileData?.careers?.career.slice(0, 8).map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   marginBottom: "10px",
//                   backgroundColor: "#ffffff", // White background
//                   border: "1px solid #e0e0e0", // Light gray border
//                   padding: "0 10px", // Add padding
//                   borderRadius: "10px",
//                   boxShadow: "1px 1px 10px rgba(0, 0, 0, 0.1)", // Optional: Keep for UI

//                   // border: "1px solid black",
//                 }}
//               >
//                 {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <p style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>{item.title}</p>
//                   <p style={{ color: "gray", fontWeight: 500, width: "120px", textAlign: "right" }}>
//                     {item.fit} Fit
//                   </p>
//                 </div>
//                 <div>
//                   <Rating value={item?.match_score} sx={{ fontSize: "1.2rem" }} />
//                 </div> */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     // border: "1px solid black",
//                     alignItems: "center",
//                     width: "100%",
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontWeight: "bold",
//                       color: "black",
//                       fontSize: "16px",
//                       // border: "1px solid black",
//                       width: "90%",
//                     }}
//                   >
//                     {item.title}
//                   </p>
//                   <div
//                     style={{
//                       backgroundColor: "#bf2f75",
//                       height: "1.5rem",
//                       width: "1.5rem",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center", // Ensure vertical centering
//                       color: "white",
//                       borderRadius: "50%", // Make it circular
//                       fontWeight: "bold",
//                       fontSize: "1rem",
//                     }}
//                   >
//                     P
//                   </div>

//                   {/* <p style={{ color: "gray", fontWeight: 500, width: "120px", textAlign: "right" }}>
//                     {item.fit} Fit
//                   </p> */}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     // border: "1px solid black",
//                     width: "100%",
//                     alignItems: "center",
//                     marginTop: "-10px",
//                   }}
//                 >
//                   {/* <Rating value={item?.match_score} sx={{ fontSize: "1.2rem" }} /> */}

//                   <p
//                     style={{
//                       color: "gray",
//                       fontWeight: 500,
//                       width: "120px",
//                       textAlign: "left",
//                       // border: "1px solid black",
//                     }}
//                   >
//                     {item?.fit === "Best" ? "Good" : item?.fit} Fit
//                   </p>
//                   <Rating value={item?.match_score} sx={{ fontSize: "1.2rem" }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </NewPage>

//       {/* 20 career continue  */}

//       <NewPage pageNumber={9}>
//         <div
//           style={{
//             position: "relative",
//             zIndex: 1,
//             padding: "0px 45px",
//             textAlign: "left",
//           }}
//         >
//           <div
//             style={{
//               paddingTop: "20px",
//               display: "grid",
//               gridTemplateColumns: "repeat(2, 1fr)",
//               gap: "20px",
//             }}
//           >
//             {interestProfileData?.careers?.career.slice(8).map((item, index) => (
//               <div
//                 key={index}
//                 style={{
//                   marginBottom: "10px",
//                   backgroundColor: "#ffffff", // White background
//                   border: "1px solid #e0e0e0", // Light gray border
//                   padding: "0 10px", // Add padding
//                   borderRadius: "10px",
//                   boxShadow: "1px 1px 10px rgba(0, 0, 0, 0.1)", // Optional: Keep for UI
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     // border: "1px solid black",
//                     alignItems: "center",
//                     width: "100%",
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontWeight: "bold",
//                       color: "black",
//                       fontSize: "16px",
//                       // border: "1px solid black",
//                       width: "90%",
//                     }}
//                   >
//                     {item.title}
//                   </p>
//                   <div
//                     style={{
//                       backgroundColor: "#bf2f75",
//                       height: "1.5rem",
//                       width: "1.5rem",
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "center", // Ensure vertical centering
//                       color: "white",
//                       borderRadius: "50%", // Make it circular
//                       fontWeight: "bold",
//                       fontSize: "1rem",
//                       // border: "1px solid black",
//                     }}
//                   >
//                     P
//                   </div>

//                   {/* <p style={{ color: "gray", fontWeight: 500, width: "120px", textAlign: "right" }}>
//                     {item.fit} Fit
//                   </p> */}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     // border: "1px solid black",
//                     width: "100%",
//                     alignItems: "center",
//                     marginTop: "-20px",
//                   }}
//                 >
//                   {/* <Rating value={item?.match_score} sx={{ fontSize: "1.2rem" }} /> */}

//                   <p
//                     style={{
//                       color: "gray",
//                       fontWeight: 500,
//                       width: "120px",
//                       textAlign: "left",
//                       // border: "1px solid black",
//                     }}
//                   >
//                     {item?.fit === "Best" ? "Good" : item?.fit} Fit
//                   </p>
//                   <Rating value={item?.match_score} sx={{ fontSize: "1.2rem" }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </NewPage>
//       {/* best fit analysis  */}
//       <NewPage pageNumber={10}>
//         <div
//           style={{
//             position: "relative",
//             zIndex: 1,
//             padding: "0px 45px",
//             textAlign: "left",
//             // border: "1px solid black",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "32px",
//               fontWeight: "bold",
//               color: "#720361",
//               textAlign: "center",
//               padding: 0,
//               marginTop: "-20px",
//             }}
//           >
//             Best-fit Analysis
//           </span>
//           <div>
//             <span>
//               {getFirstName(fullName)} for each of the identified career pathways we have also analysed how
//               well these fit with your current interests, educational preferences and aspirations. There are 3
//               levels we have assigned to each career pathway:
//             </span>

//             <ul style={{ listStyleType: "disc", paddingLeft: "40px" }}>
//               <li>Perfect fit </li>
//               <li>Great fit </li>
//               <li>Best fit </li>
//             </ul>
//           </div>
//           <div>
//             <span
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 color: "#FF8A00",
//                 textAlign: "center",
//                 padding: 0,
//                 marginTop: "-20px",
//               }}
//             >
//               Detailed career pathways
//             </span>
//           </div>
//           <span>
//             For each career pathway that has been recommended for you there are 6 information sections that
//             you should read and make notes on what you like or don’t like:
//           </span>
//           <ul style={{ listStyleType: "disc", paddingLeft: "40px" }}>
//             <li>What people in these jobs do </li>
//             <li>Knowledge required </li>
//             <li>Skills required </li>
//             <li>Abilities </li>
//             <li>Personality type </li>
//             <li>Technology competence </li>
//           </ul>
//           <span>
//             Academic requirements for each Career pathway are also identified along with relevant Colleges and
//             Universities that offer the relevant programmes in the countries selected in the Educational
//             survey.
//           </span>
//           <br />
//           <span>
//             {getFirstName(fullName)}, please use this as the starting point on your career discovery and
//             planning process.
//           </span>
//         </div>
//         <div
//           style={{
//             position: "relative",
//             zIndex: 1,
//             padding: "0px 45px",
//             textAlign: "left",
//             // border: "1px solid black",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "20px",
//               fontWeight: "bold",
//               color: "#FF8A00",
//               textAlign: "center",
//               padding: 0,
//               marginTop: "-20px",
//             }}
//           >
//             Important
//           </span>
//           <div>
//             <span>
//               You should not consider this as a closed or restricted list of careers. This is your starting
//               point to use to investigate and dig down to find the right space for you. As you progress your
//               education, the experiences and opportunities that become available to you will influence your
//               career choices. Be open to change and seek help and assistance form your counsellors and friends
//               and family to make your best choices.
//             </span>
//           </div>
//           <br />
//           <span
//             style={{
//               fontSize: "20px",
//               fontWeight: "bold",
//               color: "#FF8A00",
//               textAlign: "center",
//               padding: 0,
//               marginTop: "-20px",
//             }}
//           >
//             What next?
//           </span>
//           <div>
//             <span>
//               Making the right career decisions needs careful analysis, investigation and reflection. As you
//               become more informed you will instinctively develop a sense of the direction that’s right for
//               you.
//               <br />
//             </span>
//           </div>
//         </div>
//       </NewPage>
//       {/* Important and what next  */}
//       <NewPage pageNumber={11}>
//         <div
//           style={{
//             position: "relative",
//             zIndex: 1,
//             padding: "0px 45px",
//             textAlign: "left",
//           }}
//         >
//           <span>We recommend a 3-step plan for you to work through:</span>

//           {/* Table */}
//           <div style={{ marginTop: "20px" }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 border: "1px solid #ddd",
//               }}
//             >
//               <tbody>
//                 {/* Row 1: Network */}
//                 <tr style={{ borderBottom: "1px solid #ddd" }}>
//                   <td
//                     style={{
//                       padding: "10px",
//                       fontWeight: "bold",
//                       width: "20%",
//                       verticalAlign: "top",
//                     }}
//                   >
//                     Network:
//                   </td>
//                   <td style={{ padding: "10px" }}>
//                     Speak to people you know in those fields. Ask them about their career journeys, what they
//                     studied and how they got to their current job. What their aspirations are going forward.
//                     What challenges they see on the horizon. Of course, ask for their guidance on
//                     opportunities they can recommend in the field.
//                   </td>
//                 </tr>

//                 {/* Row 2: Upskill */}
//                 <tr style={{ borderBottom: "1px solid #ddd" }}>
//                   <td
//                     style={{
//                       padding: "10px",
//                       fontWeight: "bold",
//                       width: "20%",
//                       verticalAlign: "top",
//                     }}
//                   >
//                     Upskill:
//                   </td>
//                   <td style={{ padding: "10px" }}>
//                     Register for and complete some micro-credential or certification programmes online in the
//                     fields that interest you most and are aligned to your selected career. CareerExplorer.me
//                     has created the ‘Opportunity’ section on its platform for you to see options to build
//                     knowledge and skills.
//                   </td>
//                 </tr>

//                 {/* Row 3: Build Experiences */}
//                 <tr>
//                   <td
//                     style={{
//                       padding: "10px",
//                       fontWeight: "bold",
//                       width: "20%",
//                       verticalAlign: "top",
//                     }}
//                   >
//                     Build Experiences:
//                   </td>
//                   <td style={{ padding: "10px" }}>
//                     Look into getting some work experience in your chosen fields. This can come in the form of
//                     holiday jobs, remote work projects, virtual internships, or apprenticeships.
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div style={{ marginTop: "20px" }}>
//             <span
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "bold",
//                 color: "#FF8A00",
//                 padding: 0,
//                 marginTop: "-20px",
//                 textAlign: "justify",
//               }}
//             >
//               And finally, you can take this Assessment upto 3 times
//             </span>
//             <div style={{ marginTop: "20px" }}>
//               <span
//                 style={{
//                   textAlign: "justify",
//                 }}
//               >
//                 As time goes by and you continue in your education and build new experiences and skills, your
//                 focus may change and you may want to look at alternative careers. This is very healthy and is
//                 a sign of maturity. You are now evaluating different options and engaging your mind towards
//                 new opportunities for you. You may now feel the need to re-assess yourself and check which
//                 career pathways now constitute your best-fit.
//                 <br /> <br /> We are committed to helping you to achieve the success you deserve and so we
//                 provide 3 Assessment takes that you can do for the one-time fee that you have paid. We advise
//                 you to spread your 3 attempts over one or two years to reflect the changes in your interests
//                 and attitudes.
//                 <br />
//                 <br /> Once you feel ready to take the assessment again, login to your account on
//                 CareerExplorer.me, go to ‘My Assessments’ in your personal workspace and hit the RE-ASSESS
//                 button to retake. All your Career Direction Reports will be logged for you under ‘My
//                 Assessments’ for you to see over a period of time, how your career thinking and planning has
//                 evolved. <br />
//                 <br />
//                 Good Luck !
//               </span>
//             </div>
//           </div>
//         </div>
//       </NewPage>
//     </>
//   );
// };

// export default PersonalityFactor;
