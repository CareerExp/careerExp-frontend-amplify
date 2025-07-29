import "../styles/Question.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { background, discHero, discLogo } from "../assets/assest.js";
import QuestionCard from "../components/disc/QuestionCard.jsx";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { getDiscQuestions, selectQuestions } from "../redux/slices/discSlice.js";

const DiscAssessment = () => {
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const dispatchToRedux = useDispatch();
  const discQuestions = useSelector(selectQuestions);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [overallAnswers, setOverallAnswers] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsPageLoading(true);
        const actionResult = await dispatchToRedux(getDiscQuestions({ userId, token })).unwrap();
        setQuestions(actionResult.questions || []);
        setIsPageLoading(false);
      } catch (error) {
        setIsPageLoading(false);
        console.error("Failed to fetch questions: ", error);
      }
    };

    fetchQuestions();
  }, [dispatchToRedux, userId, token]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <>
      {isPageLoading ? (
        <div>
          <InitialLoaders />
        </div>
      ) : (
        <div style={{ backgroundImage: `url(${background})`, zIndex: -1 }}>
          <div id="mainContainer">
            <div id="left">
              <img src={discHero} alt="heroImage" id="heroImage" />
            </div>
            <div id="right">
              <Link to="/">
                <div id="logoContainer">
                  <img src={discLogo} alt="logo" width={"200px"} />{" "}
                </div>
              </Link>
              {questions.length > 0 && (
                <QuestionCard
                  questionNumber={questions[currentQuestionIndex].questionNumber}
                  questionStatements={questions[currentQuestionIndex].statements}
                  totalQuestions={questions.length}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLastQuestion={currentQuestionIndex === questions.length - 1}
                  isFirstQuestion={currentQuestionIndex === 0}
                  overallAnswers={overallAnswers}
                  setOverallAnswers={setOverallAnswers}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscAssessment;
