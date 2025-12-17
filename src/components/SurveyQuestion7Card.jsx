import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrLinkNext, GrStatusWarningSmall } from "react-icons/gr";
import { useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "../styles/SurveyQuestion7Card.module.css";
// import styles from "../styles/QuestionCard.module.css";
import globalStyle from "../styles/Questions.module.css";
import { notify } from "../redux/slices/alertSlice.js";
import { rotateDegrees } from "pdf-lib";

const SurveyQuestion7Card = ({
  questionNumber,
  questionStatment,
  questionOptions, // unused here but kept for prop parity
  isMultiple,
  answerKey,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  overallAnswers,
  setOverallAnswers,
  handleSubmit,
  isButtonLoading,
  clusterData, // expected shape: [{ CareerClusters: "AI, Data...", CareerPathways: ["Pathway A", ...] }, ...]
}) => {
  const dispatchToRedux = useDispatch();
  const circleValues = [1, 2, 3, 4, 5, 6, 7, 8];

  console.log(clusterData);

  // state
  const [selectedClusters, setSelectedClusters] = useState([]); // array of cluster names (string)
  const [selectedSubclusters, setSelectedSubclusters] = useState({}); // { clusterName: [sub1, sub2] }
  const [expandedCluster, setExpandedCluster] = useState(null);

  // helpers
  const MAX_CLUSTERS = 3;
  const MAX_SUBCLUSTERS_PER_CLUSTER = 2;

  const toggleCluster = (clusterName) => {
    // toggle logic with validation
    const alreadySelected = selectedClusters.includes(clusterName);
    if (!alreadySelected && selectedClusters.length >= MAX_CLUSTERS) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: `Please select only ${MAX_CLUSTERS} Career Clusters.`,
        })
      );
      return;
    }

    let newClusters;
    let newSubclusters = { ...selectedSubclusters };

    if (alreadySelected) {
      newClusters = selectedClusters.filter((c) => c !== clusterName);
      // remove associated subclusters when cluster deselected
      delete newSubclusters[clusterName];
      // if we collapsed the expanded cluster, close it
      if (expandedCluster === clusterName) setExpandedCluster(null);
    } else {
      newClusters = [...selectedClusters, clusterName];
    }

    setSelectedClusters(newClusters);
    setSelectedSubclusters(newSubclusters);
  };

  const toggleSubcluster = (clusterName, subclusterName) => {
    // ensure cluster is selected first
    if (!selectedClusters.includes(clusterName)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please select the parent Career Cluster first.",
        })
      );
      return;
    }

    const current = selectedSubclusters[clusterName] || [];
    const already = current.includes(subclusterName);

    if (!already && current.length >= MAX_SUBCLUSTERS_PER_CLUSTER) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: `Please select only ${MAX_SUBCLUSTERS_PER_CLUSTER} Pathways for ${clusterName}.`,
        })
      );
      return;
    }

    const newForCluster = already
      ? current.filter((s) => s !== subclusterName)
      : [...current, subclusterName];
    setSelectedSubclusters({
      ...selectedSubclusters,
      [clusterName]: newForCluster,
    });
  };

  const handleNext = () => {
    // final validation: clusters length
    if (selectedClusters.length === 0) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please select at least one Career Cluster.",
        })
      );
      return;
    }
    if (selectedClusters.length > MAX_CLUSTERS) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: `Select up to ${MAX_CLUSTERS} Career Clusters only.`,
        })
      );
      return;
    }

    // ensure each cluster's subclusters <= MAX
    const invalid = selectedClusters.filter((cluster) => {
      const arr = selectedSubclusters[cluster] || [];
      return arr.length > MAX_SUBCLUSTERS_PER_CLUSTER;
    });
    if (invalid.length > 0) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: `Please select up to ${MAX_SUBCLUSTERS_PER_CLUSTER} pathways for: ${invalid.join(", ")}`,
        })
      );
      return;
    }

    // Build processed value and push into overallAnswers similarly to other cards
    const processedOptionValue = selectedClusters;
    const updatedOverallAnswer = overallAnswers.filter(
      (ans) => !ans.hasOwnProperty(answerKey)
    );
    // store both clusters and subclusters for future steps
    updatedOverallAnswer.push({
      [answerKey]: processedOptionValue,
      [`${answerKey}Subclusters`]: selectedSubclusters,
    });

    setOverallAnswers(updatedOverallAnswer);

    // reset local state
    setSelectedClusters([]);
    setSelectedSubclusters({});
    setExpandedCluster(null);

    isLastQuestion
      ? handleSubmit(updatedOverallAnswer)
      : onNext(updatedOverallAnswer);
  };

  const handlePrevious = () => {
    onPrevious();
  };

  // UI helpers: get cluster list from `clusterData`. It may come in different shapes;
  // we assume clusterData is an array of objects with `CareerClusters` and `CareerPathways`.
  // We'll coerce to a structure: [{ clusterName, pathways: [...] }, ...]
  const clusters = (clusterData || []).map((c) => ({
    // clusterName: c.CareerClusters || c.clusterName || "Unnamed Cluster",
    clusterName: c.CareerClusters || c.value || "Unnamed Cluster",
    pathways: Array.isArray(c.CareerPathways) ? c.CareerPathways : [],
  }));

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

        <div className={styles.cardBody}>
          <p className={styles.hint}>
            Select up to 3 Career Clusters. Then expand a cluster and pick up to
            2 pathways inside each.
          </p>

          {/* options container is scrollable */}
          <div className={styles.optionsContainer}>
            <div className={styles.clusterList}>
              {clusters.map(({ clusterName, pathways }) => {
                const isChecked = selectedClusters.includes(clusterName);
                const isExpanded = expandedCluster === clusterName;
                const chosenPaths = selectedSubclusters[clusterName] || [];
                // console.log("clusters", clusters);
                return (
                  <div key={clusterName} className={styles.clusterRow}>
                    <div className={styles.clusterRowMain}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            toggleCluster(clusterName);
                            // setExpandedCluster(isExpanded ? null : clusterName);
                          }}
                          className={styles.checkbox}
                        />
                        <span className={styles.clusterTitle}>
                          {clusterName}
                        </span>
                      </label>

                      <button
                        className={styles.expandButton}
                        onClick={() => {
                          // toggleCluster(clusterName);
                          setExpandedCluster(isExpanded ? null : clusterName);
                        }}
                        aria-expanded={isExpanded}
                      >
                        <GrStatusWarningSmall
                          size={14}
                          style={{
                            transform: `rotate(${isExpanded ? 0 : 180}deg)`,
                            transition: "transform 0.5s ease",
                          }}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className={styles.subclusterPanel}>
                        {!pathways || pathways.length === 0 ? (
                          <div className={styles.noPathways}>
                            No pathways available
                          </div>
                        ) : (
                          pathways.map((p) => {
                            const pathChecked = chosenPaths.includes(p);
                            return (
                              <label key={p} className={styles.subclusterRow}>
                                <input
                                  type="checkbox"
                                  checked={pathChecked}
                                  onChange={() =>
                                    toggleSubcluster(clusterName, p)
                                  }
                                  disabled={!isChecked}
                                  className={styles.checkbox}
                                />
                                <span className={styles.subclusterText}>
                                  {p}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={globalStyle["navButtonContainer"]}>
        <button
          className={globalStyle["navButton"]}
          onClick={handlePrevious}
          disabled={isFirstQuestion}
        >
          <span>
            <IoMdArrowRoundBack />
          </span>
          Previous
        </button>

        {isButtonLoading ? (
          <div>
            <button
              className={globalStyle["navButton"]}
              style={{ width: "120px" }}
            >
              <CircularProgress
                size={30}
                sx={{ backgroundColor: "transparent" }}
              />{" "}
            </button>
          </div>
        ) : (
          <button
            className={globalStyle["navButton"]}
            onClick={handleNext}
            disabled={selectedClusters.length === 0}
          >
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

export default SurveyQuestion7Card;
