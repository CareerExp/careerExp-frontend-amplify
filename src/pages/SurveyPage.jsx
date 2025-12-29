import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { background, interestLogo, surevyHero } from "../assets/assest.js";
import SurveyQuestionCards from "../components/SurveyQuestionCards.jsx";
import SurveyQuestion7Card from "../components/SurveyQuestion7Card.jsx";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  getPaymentStatus,
  selectIsPaid,
  selectRemainingAttempts,
} from "../redux/slices/paymentSlice.js";
import {
  getCareerClusterOptions,
  getSurveyQuestions,
  saveSurveyData,
  selectClusterData,
  selectSurveyQuestions,
} from "../redux/slices/surveySlice.js";
import globalStyle from "../styles/Questions.module.css";
import { surveyQuesAns } from "../utility/surveyQuesAns.js";

const IS_LOCAL = import.meta.env.VITE_REACT_APP_IS_LOCAL === "true";
const partCAnswers = [
  {
    educationLevel: "Further or Higher Education, Year 4",
  },
  {
    gradePoints: "(A- to A) GPA of 3.5 or above",
  },
  {
    nextCareerStep: "Corporate job",
  },
  {
    preferredLocation: ["India"],
  },
  {
    top3thingsForFuture: [
      "Academic ranking and reputation",
      "Flexibility of delivery (online, classroom, hybrid learning)",
      "Career preparation",
    ],
  },
  {
    nationality: "India",
  },
  {
    mostAppealingField: [
      {
        name: "AI, Data Science & Machine Learning",
        code: 1,
      },
      {
        name: "Cybersecurity & Digital Forensics",
        code: 2,
      },
      {
        name: "Cloud Computing & Infrastructure",
        code: 3,
      },
    ],
    mostAppealingFieldSubclusters: {
      "AI, Data Science & Machine Learning": [
        {
          name: "Data Analysis & Analytics",
          code: 1.1,
        },
        {
          name: "Machine Learning & AI",
          code: 1.2,
        },
      ],
      "Cybersecurity & Digital Forensics": [
        {
          name: "Security Operations & Support",
          code: 2.1,
        },
        {
          name: "Information Security & Threat Analysis",
          code: 2.2,
        },
      ],
      "Cloud Computing & Infrastructure": [
        {
          name: "Cloud Support & Help Desk",
          code: 3.1,
        },
        {
          name: "Systems & Infrastructure Administration",
          code: 3.2,
        },
      ],
    },
  },
];

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

  const handleSubmit = async (updatedOverallAnswer) => {
    if (IS_LOCAL) {
      updatedOverallAnswer = partCAnswers;
    }

    if (updatedOverallAnswer[6]) {
      if (updatedOverallAnswer[6].mostAppealingField.length === 0) {
        dispatchToRedux(
          notify({
            type: "error",
            message: "Please select at least 1 career cluster",
          })
        );
        return;
      } else if (
        Object.keys(updatedOverallAnswer[6].mostAppealingFieldSubclusters)
          .length !== updatedOverallAnswer[6].mostAppealingField.length
      ) {
        dispatchToRedux(
          notify({
            type: "error",
            message:
              "Please select at least 1 career's pathway for each career cluster",
          })
        );
        return;
      }
    }
    try {
      const answers = updatedOverallAnswer.reduce((acc, answer) => {
        return { ...acc, ...answer };
      }, {});
      answers.selectedPathways = Object.values(
        answers.mostAppealingFieldSubclusters
      ).reduce((acc, subcluster) => {
        return [...acc, ...subcluster];
      }, []);
      delete answers.mostAppealingFieldSubclusters;

      setIsButtonLoading(true);
      const resultAction = await dispatchToRedux(
        saveSurveyData({ token, formData: answers, userId })
      );

      if (saveSurveyData.fulfilled.match(resultAction)) {
        const result = resultAction.payload;

        // Show success notification
        dispatchToRedux(
          notify({
            type: "success",
            message: result.message || "Survey submitted successfully!",
          })
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
            message:
              error.message || "Failed to submit survey. Please try again.",
          })
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      dispatchToRedux(
        notify({
          type: "error",
          message: "An unexpected error occurred. Please try again.",
        })
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
        const optionSelected =
          updatedOverallAnswer[currentQuestionIndex].mostAppealingField;
        const lastQuestion = {
          // question: "Select Career Pathways",
          question: "Select up to 2 Career Pathways from each Career Cluster.",
          key: "selectedPathways",
          isMutiple: true,
          options: optionSelected?.map((option) => {
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
            <img
              src={interestLogo}
              alt="logo"
              width={"248px"}
              height={"76.67px"}
            />
          </Link>
          {/* {questions.length > 0 && (
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
          )} */}
          {questions.length > 0 && (
            <>
              {currentQuestionIndex === 6 ? (
                // Render custom Q7 component
                <SurveyQuestion7Card
                  questionNumber={currentQuestionIndex + 1}
                  questionStatment={questions[currentQuestionIndex]["question"]}
                  questionOptions={questions[currentQuestionIndex]["options"]}
                  isMultiple={questions[currentQuestionIndex]["isMutiple"]}
                  answerKey={questions[currentQuestionIndex]["key"]}
                  totalQuestions={questions.length}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLastQuestion={
                    IS_LOCAL
                      ? true
                      : currentQuestionIndex === questions.length - 1
                  }
                  isFirstQuestion={currentQuestionIndex === 0}
                  overallAnswers={overallAnswers}
                  setOverallAnswers={setOverallAnswers}
                  handleSubmit={handleSubmit}
                  isButtonLoading={isButtonLoading}
                  clusterData={clusterData}
                />
              ) : (
                // Default questions use existing card
                <SurveyQuestionCards
                  questionNumber={currentQuestionIndex + 1}
                  questionStatment={questions[currentQuestionIndex]["question"]}
                  questionOptions={questions[currentQuestionIndex]["options"]}
                  isMultiple={questions[currentQuestionIndex]["isMutiple"]}
                  answerKey={questions[currentQuestionIndex]["key"]}
                  totalQuestions={questions.length}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLastQuestion={
                    IS_LOCAL
                      ? true
                      : currentQuestionIndex === questions.length - 1
                  }
                  isFirstQuestion={currentQuestionIndex === 0}
                  overallAnswers={overallAnswers}
                  setOverallAnswers={setOverallAnswers}
                  handleSubmit={handleSubmit}
                  isButtonLoading={isButtonLoading}
                  clusterData={clusterData}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
