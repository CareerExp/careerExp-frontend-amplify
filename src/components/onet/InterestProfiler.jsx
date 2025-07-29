import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { background, interestHero, interestLogo } from "../../assets/assest.js";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { getQuestions, getResultAndJob, selectOnet } from "../../redux/slices/onetSlice.js";
import globalStyle from "./Common.module.css";
import InterestQuestionCard from "./InterestQuestionCard.jsx";

const styles = {
  containerStyle: {
    backgroundColor: "white",
    height: "101vh",
    width: "101vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(100px)",
    color: "#fff",
    marginLeft: "-10px",
  },
};

export default function InterestProfiler() {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const onet = useSelector(selectOnet);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [overallAnswers, setOverallAnswers] = useState(new Array(30).fill("?"));
  const [selectedValue, setSelectedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const textReplacements = {
    1: "Do you enjoy working with your hands, like repairing things, building projects, or using tools?", // For "Build kitchen cabinets"
    2: "Would you like to undertake research to develop a new medicine?", // For "Develop a new medicine"
    3: "Do you enjoy expressing yourself creatively through writing, visual arts, or performing arts?", //Write books and plays
    4: "Are you passionate about making a difference in your community or society?", //Help people with personal or emotional problems
    5: "Do you enjoy leading teams, managing events, or taking initiative in group settings?", //Manage a department within a large company
    6: "Are you good at keeping track of details and making sure everything runs smoothly?", //Install software across computers on a large network
    7: "Would you like to work with machines, equipment, or technology to solve real-world problems?", //Repair household appliances
    8: "Are you curious about understanding systems, whether in nature, society, or technology?", //Study ways to reduce water pollution
    9: "Do you enjoy producing creative content, like composing music, video editing, or digital design?", //Compose or arrange music
    10: "Would you like to work in fields like counseling, education, or social work?", //Give career guidance to people
    11: "Would you like to start your own business, launch a project, or lead an organization?", //Start your own business
    12: "Would you like to work with numbers, charts, or spreadsheets?", //Operate a calculator
    13: "Do you like hands-on tasks, like baking, crafting, or doing science experiments?", //Assemble electronic parts
    14: "Would you like to work in fields like data science, artificial intelligence, or biomedical research?", //Conduct chemical experiments
    15: "Do you enjoy brainstorming new ideas or finding unique ways to solve problems?", //Create special effects for movies
    16: "Do you feel comfortable talking to new people or leading group activities?", //Perform rehabilitation therapy
    17: "Are you excited about presenting ideas or persuading others to take action?", //Negotiate business contracts
    18: "Do you enjoy organizing information, like sorting files, creating spreadsheets, or developing schedules?", //Keep shipping and receiving records
    19: "Do you enjoy outdoor activities, like gardening, hiking, or sports training?", //Drive a truck to deliver packages to offices and homes
    20: "Are you curious about how the human brain works?", //Examine blood samples using a microscope
    21: "Are you drawn to designing innovative solutions, like creating marketing campaigns or art installations?", //Paint sets for plays
    22: "Are you interested in advocating for causes, like environmental issues or social justice?", //Do volunteer work at a non-profit organization
    23: "Are you interested in leadership roles that involve risk-taking and strategic decision-making?", //Market a new line of clothing
    24: "Are you drawn to roles that involve maintaining systems, such as managing databases or planning operations?", //Inventory supplies using a hand-held computer
    25: "Are you interested in learning technical skills, like engineering, mechanics, or technology?", //Test the quality of parts before shipment
    26: "Do you enjoy analyzing data, interpreting research findings, or predicting trends?", //Develop a way to better predict the weather
    27: "Are you drawn to creating content, such as making videos, blogs, or podcasts?", //Write scripts for movies or television shows
    28: "Do you enjoy helping others, such as volunteering, menteoring, or tutoring?", //Teach a high-school class
    29: "Do you enjoy competitive environments, like debates or business challenges?", //Sell merchandise at a department store
    30: "Do you feel confident following step-by-step instructions to complete tasks?", //Stamp, sort, and distribute mail for an organization
  };

  const handleChooseOption = async () => {
    try {
      setLoading(true);
      await dispatchToRedux(getQuestions({ resource: "questions_30", start: 1, end: 60, token }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    handleChooseOption();
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < onet?.questions?.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }

    if (currentQuestionIndex === onet?.questions?.length - 1) {
      handleSubmitButton();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Replace the question text based on its index with custom text
  const getReplacedQuestionText = (index) => {
    return textReplacements[index] || onet?.questions[index]?.text; // Default to original text if no replacement found
  };

  const handleSubmitButton = async (answers = overallAnswers) => {
    const finalAnswer = answers[answers.length - 1];
    if (finalAnswer === "?") {
      console.log("Please select an answer for the last question.");
      return;
    }

    try {
      setIsButtonLoading(true);
      await dispatchToRedux(getResultAndJob({ answers: answers.join(""), token, userId }));
      navigate("/disc");
      setIsButtonLoading(false);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setIsButtonLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${background})`, zIndex: "-1" }}
      className={globalStyle["background"]}
    >
      <div className={globalStyle["container"]}>
        <div className={globalStyle["left"]}>
          <div
            style={{
              // border: "1px solid #cecece",
              padding: "20px",
              borderRadius: "10px",
            }}
            className={globalStyle["logoContainer"]}
          >
            <img
              src={interestHero}
              alt="heroImage"
              height={"76.67px"}
              width={"248px"}
              className={globalStyle["logo"]}
            />
          </div>
        </div>
        <div className={globalStyle["right"]}>
          <Link to="/">
            {" "}
            <div className={globalStyle["ce-logo-div"]}>
              <img src={interestLogo} alt="logo" width={250} />
            </div>
          </Link>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <CircularProgress color="inherit" />
            </div>
          ) : (
            onet?.questions?.length > 0 && (
              <InterestQuestionCard
                questionNumber={currentQuestionIndex + 1}
                // questionStatment={onet?.questions[currentQuestionIndex]["text"]}
                questionStatment={getReplacedQuestionText(currentQuestionIndex + 1)}
                totalQuestions={onet?.questions?.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLastQuestion={currentQuestionIndex === onet?.questions?.length - 1}
                isFirstQuestion={currentQuestionIndex === 0}
                overallAnswers={overallAnswers}
                setOverallAnswers={setOverallAnswers}
                handleSubmitButton={handleSubmitButton}
                isButtonLoading={isButtonLoading}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
