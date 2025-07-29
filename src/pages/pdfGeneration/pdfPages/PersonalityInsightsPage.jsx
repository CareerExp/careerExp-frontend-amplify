import React from "react";

import NewPage from "./NewPage";

const PersonalityInsightsPage = ({ personalityInsight }) => {
  const content = [
    {
      title: "1. Basic Character",
      text: personalityInsight?.basic_character,
    },
    {
      title: "2. Building Blocks: Core elements of your personality",
      items: [
        { label: "Motivational Factors", text: personalityInsight?.motivational_factors },
        { label: "Learning Style", text: personalityInsight?.learning_style },
        { label: "Questioning Method", text: personalityInsight?.questioning_method },
        { label: "Decision Making", text: personalityInsight?.decision_making },
        { label: "Relating to People", text: personalityInsight?.how_relates_to_people },
        { label: "Understanding Timescales", text: personalityInsight?.time_scale },
        { label: "Potential Strengths", text: personalityInsight?.potential_strengths },
        { label: "Potential Weaknesses", text: personalityInsight?.potential_weaknesses },
      ],
    },
    {
      title: "3. Potential Behavior in a Work Setting",

      items: [
        { label: "Management Technique", text: personalityInsight?.management_technique },
        { label: "Potential as a Team Leader", text: personalityInsight?.potential_as_a_team_leader },
        { label: "Potential as a Team Member", text: personalityInsight?.potential_as_a_team_member },
        {
          label: "Acceptance of Management Responsibility",
          text: personalityInsight?.acceptance_of_management_responsibility,
        },
        {
          label: "Capability for Organization and Planning",
          text: personalityInsight?.capability_for_organization_and_planning,
        },
        { label: "Response to Authority", text: personalityInsight?.response_to_authority },
        {
          label: "Response to a Sales Environment",
          text: personalityInsight?.response_to_a_sales_environment,
        },
        {
          label: "Response to a Technical Environment",
          text: personalityInsight?.response_to_a_technical_environment,
        },
      ],
    },
    {
      title: "4. Good to Know",

      items: [
        { label: "Factors that may demotivate", text: personalityInsight?.factors_that_demotivate },
        {
          label: "Factors that affect self-esteem",
          text: personalityInsight?.factors_that_threaten_self_esteem,
        },
      ],
    },
  ];

  return (
    <>
      <NewPage pageNumber={12}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#FF8A00" }}>Section 4</span>
          </div>

          <span
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#720361",
              textAlign: "center",
              padding: 0,
            }}
          >
            Personality Insights
          </span>

          {/* Basic Character  */}

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "20px",
                color: "#8C001B",
              }}
            >
              1. Basic Character
            </span>
          </div>
          <div style={{ border: "1px solid #8C001B" }}></div>

          <div style={{ textAlign: "justify", marginTop: "20px" }}>
            <span>{personalityInsight?.basic_character}</span>
          </div>

          {/* Building Block  */}

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "20px",
                color: "#8C001B",
              }}
            >
              2. Building Blocks: Core elements of your personality
            </span>
          </div>
          <div style={{ border: "1px solid #8C001B" }}></div>

          <div style={{ textAlign: "left", paddingTop: "0px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Motivational Factors
                </li>
              </ul>
              <div style={{ border: "1px solid #720361" }}></div>
            </span>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              margintTop: "20px",
            }}
          >
            <span>{personalityInsight?.motivational_factors}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "0px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Learning Style
                </li>
              </ul>
            </span>
          </div>
          <div style={{ border: "1px solid #720361" }}></div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              margintTop: "20px",
            }}
          >
            <span>{personalityInsight?.learning_style}</span>
          </div>
        </div>
      </NewPage>

      <NewPage pageNumber={13}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Questioning method
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.questioning_method}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Decision making
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.decision_making}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Relating to people
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.how_relates_to_people}</span>
          </div>
        </div>
      </NewPage>

      <NewPage pageNumber={14}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Understanding timescales
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.time_scale}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Potential Strengths
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.potential_strengths}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Potential Weakness
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.potential_weaknesses}</span>
          </div>
        </div>
      </NewPage>

      {/* Potential Behaviour in work setting  */}

      <NewPage pageNumber={15}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "20px",
                color: "#8C001B",
              }}
            >
              3. Potential Behavior in a Work Setting
            </span>
          </div>
          <div style={{ border: "1px solid #8C001B" }}></div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Manangement technique
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.management_technique}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Potential as a team leader
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.potential_as_a_team_leader}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Potential as a team member
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.potential_as_a_team_member}</span>
          </div>
        </div>
      </NewPage>

      <NewPage pageNumber={16}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Acceptance of Management responsibility
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.acceptance_of_management_responsibility}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Capability for Organization and planning
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.capability_for_organization_and_planning}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Response to authority
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.response_to_authority}</span>
          </div>
        </div>
      </NewPage>

      <NewPage pageNumber={17}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Response to a sales environment
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.response_to_a_sales_environment}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Response to a technical environment
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.response_to_a_technical_environment}</span>
          </div>
        </div>
      </NewPage>

      {/* Good to know  */}

      <NewPage pageNumber={18}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px",
            textAlign: "left",
            // border: "1px solid black",
          }}
        >
          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "20px",
                color: "#8C001B",
              }}
            >
              4. Good to Know
            </span>
            <div style={{ border: "1px solid #8C001B" }}></div>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Factors that may demotivate
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.factors_that_demotivate}</span>
          </div>

          <div style={{ textAlign: "left", paddingTop: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#720361" }}>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ position: "relative", paddingLeft: "20px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#720361",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Factors that affect self esteem
                </li>
              </ul>
            </span>
            <div style={{ border: "1px solid #720361" }}></div>
          </div>

          <div
            style={{
              textAlign: "justify",
              padding: "0 0 0 30px",
              paddingTop: "20px",
            }}
          >
            <span>{personalityInsight?.factors_that_threaten_self_esteem}</span>
          </div>
        </div>
      </NewPage>
    </>
  );
};

export default PersonalityInsightsPage;
