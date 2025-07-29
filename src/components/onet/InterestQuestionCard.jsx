import { Box, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { IoMdArrowRoundBack } from "react-icons/io";

import { mayConsider, NotInterested, okay, veryInterested, worthTrying } from "../../assets/assest.js";
import { buttonStyle } from "../../utility/commonStyle.js";
import styles from "./QuestionCard.module.css";
import globalStyle from "./Questions.module.css";

const InterestQuestionCard = ({
  questionNumber,
  questionStatment,
  totalQuestions,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  overallAnswers,
  setOverallAnswers,
  handleSubmitButton,
  isButtonLoading,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [circleValues, setCircleValues] = useState([]);

  const handleNext = () => {
    const updatedOverallAnswer = [...overallAnswers];
    updatedOverallAnswer[questionNumber - 1] = selectedValue; // Update the current question's answer

    setOverallAnswers(updatedOverallAnswer); // Update the state
    setSelectedValue(null); // Reset selected value for the next question

    if (isLastQuestion) {
      handleSubmitButton(updatedOverallAnswer); // Pass the updated answers to submit
    } else {
      onNext(); // Go to the next question
    }
  };

  const handlePrevious = () => {
    onPrevious();
  };

  // useEffect(() => {
  //   if (questionNumber <= 12) {
  //     setCircleValues(() => {
  //       const values = [];
  //       for (let i = 1; i <= 13; i++) {
  //         values.push(i);
  //       }
  //       values.push("...", 30);
  //       return values;
  //     });
  //   } else if (questionNumber <= 24) {
  //     setCircleValues(() => {
  //       const values = [];
  //       for (let i = 13; i <= 24; i++) {
  //         values.push(i);
  //       }
  //       values.push("...", 30);
  //       return values;
  //     });
  //   } else {
  //     setCircleValues(() => {
  //       const values = new Array("...");
  //       for (let i = 17; i <= 30; i++) {
  //         values.push(i);
  //       }
  //       return values;
  //     });
  //   }
  // }, [questionNumber]);

  useEffect(() => {
    const updateCircleValues = () => {
      const isSmallScreen = window.innerWidth <= 480;

      if (isSmallScreen) {
        // if (questionNumber <= 5) {
        //   setCircleValues([1, 2, 3, 4, 5, 6, 7, 8, "...", 30]);
        // } else if (questionNumber <= 10) {
        //   setCircleValues([6, 7, 8, 9, 10, "...", 30]);
        // } else if (questionNumber <= 15) {
        //   setCircleValues([11, 12, 13, 14, 15, "...", 30]);
        // } else if (questionNumber <= 20) {
        //   setCircleValues([16, 17, 18, 19, 20, "...", 30]);
        // } else if (questionNumber <= 25) {
        //   setCircleValues([21, 22, 23, 24, 25, "...", 30]);
        // } else {
        //   setCircleValues(["...", 26, 27, 28, 29, 30]);
        // }
        if (questionNumber <= 8) {
          setCircleValues([1, 2, 3, 4, 5, 6, 7, 8, "...", 30]);
        } else if (questionNumber <= 15) {
          setCircleValues([9, 10, 11, 12, 13, 14, 15, "...", 30]);
        } else if (questionNumber <= 22) {
          setCircleValues([16, 17, 18, 19, 20, 21, 22, "...", 30]);
        } else {
          setCircleValues(["...", 23, 24, 25, 26, 27, 28, 29, 30]);
        }
      } else {
        // Original logic for big screens
        if (questionNumber <= 12) {
          setCircleValues(() => {
            const values = [];
            for (let i = 1; i <= 13; i++) {
              values.push(i);
            }
            values.push("...", 30);
            return values;
          });
        } else if (questionNumber <= 24) {
          setCircleValues(() => {
            const values = [];
            for (let i = 13; i <= 24; i++) {
              values.push(i);
            }
            values.push("...", 30);
            return values;
          });
        } else {
          setCircleValues(() => {
            const values = ["..."];
            for (let i = 17; i <= 30; i++) {
              values.push(i);
            }
            return values;
          });
        }
      }
    };

    updateCircleValues(); // Initial call

    window.addEventListener("resize", updateCircleValues);
    return () => window.removeEventListener("resize", updateCircleValues);
  }, [questionNumber]);

  useEffect(() => {
    const currentSelectedOption = overallAnswers[questionNumber - 1];
    if (currentSelectedOption != "?") {
      setSelectedValue(currentSelectedOption);
    }
  }, [questionNumber]);

  return (
    <>
      <div className={globalStyle["questions-container"]} style={{ backgroundColor: "white" }}>
        <div className={styles["top-subCard"]}>
          <div className={styles.title}>Part A</div>
          <div className={styles.subtitle}>Please select one response to show your level of interest</div>
          <div className={styles.questionBox}>
            <p className={styles.questionText}>
              {`Q${questionNumber}. `}
              {questionStatment}
            </p>
          </div>
          <ul className={styles.status}>
            {circleValues.map((value, index) => (
              <li
                key={index}
                className={`${styles.circle} ${questionNumber >= value ? styles.circleActive : styles.circleInactive}`}
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.optionContainer}>
          <div
            className={`${styles.option} ${selectedValue === "1" ? styles.optionActive : styles.optionInactive}`}
            onClick={() => setSelectedValue("1")}
          >
            <img src={NotInterested} className="w-[48px] h-[48px]" alt="Not Interested" />
            <p
              className={`${styles.optionText} ${selectedValue === "1" ? styles.optionActive : styles.optionInactive}`}
            >
              Not Interested
            </p>
          </div>
          <div
            className={`${styles.option} ${selectedValue === "2" ? styles.optionActive : styles.optionInactive}`}
            onClick={() => setSelectedValue("2")}
          >
            <img src={mayConsider} className="w-[48px] h-[48px]" alt="May Consider" />
            <p
              className={`${styles.optionText} ${selectedValue === "2" ? styles.optionActive : styles.optionInactive}`}
            >
              Uncertain
            </p>
          </div>
          <div
            className={`${styles.option} ${selectedValue === "3" ? styles.optionActive : styles.optionInactive}`}
            onClick={() => setSelectedValue("3")}
          >
            <img src={okay} className="w-[48px] h-[48px]" alt="Okay" />
            <p
              className={`${styles.optionText} ${selectedValue === "3" ? styles.optionActive : styles.optionInactive}`}
            >
              Okay
            </p>
          </div>
          <div
            className={`${styles.option} ${selectedValue === "4" ? styles.optionActive : styles.optionInactive}`}
            onClick={() => setSelectedValue("4")}
          >
            <img src={worthTrying} className="w-[48px] h-[48px]" alt="Worth Trying Out" id="worthTrying" />
            <p
              className={`${styles.optionText} ${selectedValue === "4" ? styles.optionActive : styles.optionInactive}`}
            >
              Worth Trying Out
            </p>
          </div>
          <div
            className={`${styles.option} ${selectedValue === "5" ? styles.optionActive : styles.optionInactive}`}
            onClick={() => setSelectedValue("5")}
          >
            <img src={veryInterested} className="w-[48px] h-[48px]" alt="Very Interested" />
            <p
              className={`${styles.optionText} ${selectedValue === "5" ? styles.optionActive : styles.optionInactive}`}
            >
              Very Interested
            </p>
          </div>
        </div>
      </div>
      <div className={globalStyle["navButtonContainer"]}>
        <button className={globalStyle["navButton"]} onClick={handlePrevious} disabled={isFirstQuestion}>
          <span>
            <IoMdArrowRoundBack />
          </span>
          Previous
        </button>
        {isButtonLoading ? (
          <Box sx={{}}>
            <Button variant="contained" sx={{ ...buttonStyle, width: "120px" }}>
              <CircularProgress color="inherit" size={30} />
            </Button>
          </Box>
        ) : (
          <button className={globalStyle["navButton"]} onClick={handleNext} disabled={!selectedValue}>
            {isLastQuestion ? "Save and move on to Part B" : "Next"}
            <span>
              <GrLinkNext />
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default InterestQuestionCard;
