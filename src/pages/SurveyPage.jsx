import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { background, interestLogo, surevyHero } from "../assets/assest.js";
import SurveyQuestionCards from "../components/SurveyQuestionCards.jsx";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { getPaymentStatus, selectIsPaid, selectRemainingAttempts } from "../redux/slices/paymentSlice.js";
import {
  getCareerClusterOptions,
  getSurveyQuestions,
  saveSurveyData,
  selectClusterData,
  selectSurveyQuestions,
} from "../redux/slices/surveySlice.js";
import globalStyle from "../styles/Questions.module.css";
import { surveyQuesAns } from "../utility/surveyQuesAns.js";

const SurveyPage = () => {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const clusterData = useSelector(selectClusterData);
  const isPaid = useSelector(selectIsPaid);
  const remainingAttempts = useSelector(selectRemainingAttempts);
  const surveyQuestions = useSelector(selectSurveyQuestions);
  const [questions, setQuestions] = useState(surveyQuesAns);
  const [answerKey, setAnswerKeys] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [overallAnswers, setOverallAnswers] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    dispatchToRedux(getSurveyQuestions({ token }));
    dispatchToRedux(getCareerClusterOptions({ token }));
    dispatchToRedux(getPaymentStatus({ userId, token }));
  }, [userId]);

  // const handleSubmit = async (updatedOverallAnswer) => {
  //   try {
  //     // Create a new object to hold the answers
  //     const answers = updatedOverallAnswer.reduce((acc, answer) => {
  //       return { ...acc, ...answer };
  //     }, {});

  //     // Dispatch the answers to Redux
  //     setIsButtonLoading(true);
  //     await dispatchToRedux(saveSurveyData({ token, formData: answers, userId }));
  //     console.log("Survey answers submitted:", answers);
  //     setIsButtonLoading(false);

  //     // Navigate to the assessment result page

  //     if (isPaid && remainingAttempts > 0) {
  //       navigate("/assessment-result1");
  //     } else {
  //       navigate("/assessment-result");
  //     }
  //     navigate("/assessment-result1");
  //   } catch (error) {
  //     console.error("Error submitting the survey:", error);
  //     setIsButtonLoading(false);
  //     // Handle any errors if needed
  //   }
  // };

  const handleSubmit = async (updatedOverallAnswer) => {
    try {
      const answers = updatedOverallAnswer.reduce((acc, answer) => {
        return { ...acc, ...answer };
      }, {});

      setIsButtonLoading(true);
      const resultAction = await dispatchToRedux(saveSurveyData({ token, formData: answers, userId }));

      if (saveSurveyData.fulfilled.match(resultAction)) {
        const result = resultAction.payload;

        // Show success notification
        dispatchToRedux(
          notify({
            type: "success",
            message: result.message || "Survey submitted successfully!",
          }),
        );

        // Navigate after showing notification
        if (isPaid && remainingAttempts > 0) {
          navigate("/assessment-result1");
        } else {
          navigate("/assessment-result");
        }
      } else {
        const error = resultAction.payload || resultAction.error;
        console.error("Survey submission failed:", error);
        dispatchToRedux(
          notify({
            type: "error",
            message: error.message || "Failed to submit survey. Please try again.",
          }),
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      dispatchToRedux(
        notify({
          type: "error",
          message: "An unexpected error occurred. Please try again.",
        }),
      );
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleNext = (updatedOverallAnswer) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      if (currentQuestionIndex + 1 === 7) {
        const optionSelected = updatedOverallAnswer[currentQuestionIndex].mostAppealingField;
        const lastQuestion = {
          // question: "Select Career Pathways",
          question: "Select up to 2 Career Pathways from each Career Cluster.",
          key: "selectedPathways",
          isMutiple: true,
          options: optionSelected?.map((option) => {
            console.log(clusterData.find((el) => el.CareerClusters === option));
            return {
              label: option,
              options:
                clusterData
                  .find((el) => el.CareerClusters === option)
                  ?.CareerPathways.map((pathway) => {
                    return {
                      value: pathway,
                      label: pathway,
                    };
                  }) || "Null",
            };
          }),
        };
        questions.pop();
        setQuestions([...questions, lastQuestion]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${background})`, zIndex: "-1" }}
      className={globalStyle["background"]}
    >
      <div className={globalStyle["container"]}>
        <div className={globalStyle["left"]}>
          <img src={surevyHero} alt="heroImage" />
        </div>
        <div className={globalStyle["right"]}>
          <Link to="/">
            <img src={interestLogo} alt="logo" width={"248px"} height={"76.67px"} />
          </Link>
          {questions.length > 0 && (
            <SurveyQuestionCards
              questionNumber={currentQuestionIndex + 1}
              questionStatment={questions[currentQuestionIndex]["question"]}
              questionOptions={questions[currentQuestionIndex]["options"]}
              isMultiple={questions[currentQuestionIndex]["isMutiple"]}
              answerKey={questions[currentQuestionIndex]["key"]}
              totalQuestions={questions.length}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              isFirstQuestion={currentQuestionIndex === 0}
              overallAnswers={overallAnswers}
              setOverallAnswers={setOverallAnswers}
              handleSubmit={handleSubmit}
              isButtonLoading={isButtonLoading}
              clusterData={clusterData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
