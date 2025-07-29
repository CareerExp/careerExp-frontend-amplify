import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { IoMdArrowRoundBack } from "react-icons/io";
import Select from "react-select";
import styles from "../styles/QuestionCard.module.css";
import globalStyle from "../styles/Questions.module.css";
import { useDispatch } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";

const SurveyQuestionCards = ({
  questionNumber,
  questionStatment,
  questionOptions,
  isMultiple,
  answerKey,
  // totalQuestions,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  overallAnswers,
  setOverallAnswers,
  handleSubmit,
  isButtonLoading,
  clusterData,
}) => {
  const [optionValue, setOptionValue] = useState(null);
  const circleValues = [1, 2, 3, 4, 5, 6, 7, 8];
  const dispatchToRedux = useDispatch();

  const handleNext = () => {
    // Validation checks
    if (questionNumber === 4 && optionValue && optionValue.length > 3) {
      dispatchToRedux(notify({ type: "warning", message: "Please select only 3 Geographical locations" }));
      return;
    }

    if (questionNumber === 5 && optionValue && optionValue.length > 3) {
      dispatchToRedux(notify({ type: "warning", message: "Please select only 3 things" }));
      return;
    }

    if (questionNumber === 7 && optionValue && optionValue.length > 3) {
      dispatchToRedux(notify({ type: "warning", message: "Please select only 3 Career Clusters" }));
      return;
    }

    if (questionNumber === 8 && optionValue) {
      // Get selected career clusters from question 7
      const careerClustersAnswer = overallAnswers.find((ans) => ans.hasOwnProperty("mostAppealingField"));
      const selectedClusters = careerClustersAnswer ? careerClustersAnswer.mostAppealingField : [];

      // Create a map of pathways to their parent clusters
      const pathwayToClusterMap = {};
      clusterData.forEach((cluster) => {
        cluster.CareerPathways.forEach((pathway) => {
          pathwayToClusterMap[pathway] = cluster.CareerClusters;
        });
      });

      // Count selected pathways per cluster
      const pathwaysPerCluster = {};
      optionValue.forEach((option) => {
        const cluster = pathwayToClusterMap[option.value];
        pathwaysPerCluster[cluster] = (pathwaysPerCluster[cluster] || 0) + 1;
      });

      // Check if any cluster has more than 2 pathways
      const invalidClusters = selectedClusters.filter((cluster) => pathwaysPerCluster[cluster] > 2);

      if (invalidClusters.length > 0) {
        dispatchToRedux(
          notify({
            type: "warning",
            message: `Please select only 2 Pathways per Career Cluster. You've selected more than 2 for: ${invalidClusters.join(", ")}`,
          }),
        );
        return;
      }
    }

    let processedOptionValue;
    if (isMultiple) {
      processedOptionValue = optionValue.map((value) => value.value);
    } else processedOptionValue = optionValue.value;
    const updatedOverallAnswer = overallAnswers.filter((ans) => !ans.hasOwnProperty(answerKey));
    updatedOverallAnswer.push({ [answerKey]: processedOptionValue });
    setOverallAnswers(updatedOverallAnswer);
    setOptionValue(null);
    isLastQuestion ? handleSubmit(updatedOverallAnswer) : onNext(updatedOverallAnswer);
  };

  const handlePrevious = () => {
    onPrevious();
  };

  return (
    <>
      <div className={globalStyle["questions-container"]}>
        <div className={styles["top-subcard"]}>
          <div className={styles.cardTitle}>Educational Survey</div>
          <div className={styles.questionContainer}>
            <p className={styles.questionText}>
              {`Q${questionNumber}. `}
              {questionStatment}
            </p>
          </div>
          <ul className={styles.status}>
            {circleValues.map((value, index) => (
              <li
                key={index}
                className={`${styles.statusCircle} ${questionNumber >= index + 1 ? styles.statusCircleActive : styles.statusCircleInactive}`}
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.selectContainer}>
          <Select
            options={questionOptions}
            value={optionValue}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "#f8f4f4",
                width: "100%",
              }),
              container: (provided) => ({
                ...provided,
                width: "90%",
              }),
            }}
            onChange={(selectedOption) => {
              setOptionValue(selectedOption);
            }}
            isMulti={isMultiple}
          />
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
          <div>
            <button className={globalStyle["navButton"]} style={{ width: "120px" }}>
              <CircularProgress size={30} sx={{ backgroundColor: "transparent" }} />{" "}
            </button>
          </div>
        ) : (
          <button className={globalStyle["navButton"]} onClick={handleNext} disabled={!optionValue}>
            {isLastQuestion ? "Submit" : "Next"}
            <span>
              <GrLinkNext />
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default SurveyQuestionCards;
