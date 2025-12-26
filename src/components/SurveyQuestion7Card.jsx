import React, { useMemo, useState } from "react";
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
  clusterData, // expected shape: [{cluster:{name: string, number: number}, sub_clusters:{name:string, number:number}}]
}) => {
  const dispatchToRedux = useDispatch();
  const circleValues = [1, 2, 3, 4, 5, 6, 7];

  // state
  const [selectedClusters, setSelectedClusters] = useState([]); // array of cluster names (string)
  const [selectedSubclusters, setSelectedSubclusters] = useState({}); // { clusterName: [sub1, sub2] }
  const [expandedCluster, setExpandedCluster] = useState(null);

  const selectedClustersName = useMemo(
    () => selectedClusters.map((cluster) => cluster.name),
    [selectedClusters]
  );
  const selectedSubClustersName = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selectedSubclusters).map(
          ([clusterName, subclusters]) => [
            clusterName,
            subclusters.map((subcluster) => subcluster.name),
          ]
        )
      ),
    [selectedSubclusters]
  );

  // helpers
  const MAX_CLUSTERS = 3;
  const MAX_SUBCLUSTERS_PER_CLUSTER = 2;

  const toggleCluster = (cluster) => {
    // toggle logic with validation
    const alreadySelected = selectedClustersName.includes(cluster.name);
    if (!alreadySelected && selectedClustersName.length >= MAX_CLUSTERS) {
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
      newClusters = selectedClusters.filter((c) => c.name !== cluster.name);
      // remove associated subclusters when cluster deselected
      delete newSubclusters[cluster.name];
      // if we collapsed the expanded cluster, close it
      if (expandedCluster === cluster.name) setExpandedCluster(null);
    } else {
      newClusters = [...selectedClusters, cluster];
    }

    setSelectedClusters(newClusters);
    setSelectedSubclusters(newSubclusters);
  };

  const toggleSubcluster = (clusterName, subcluster) => {
    // ensure cluster is selected first
    if (!selectedClustersName.includes(clusterName)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please select the parent Career Cluster first.",
        })
      );
      return;
    }

    const current = selectedSubClustersName[clusterName] || [];
    const already = current.includes(subcluster.name);

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
      ? selectedSubclusters[clusterName].filter((s) => s.name !== subcluster.name)
      : [...(selectedSubclusters[clusterName] ?? []), subcluster];
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
    cluster: c.cluster,
    pathways: Array.isArray(c.sub_clusters) ? c.sub_clusters : [],
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
              {clusters.map(({ cluster, pathways }) => {
                const isChecked = selectedClustersName.includes(cluster.name);
                const isExpanded = expandedCluster === cluster.name;
                const chosenPaths = selectedSubClustersName[cluster.name] || [];

                return (
                  <div key={cluster.name} className={styles.clusterRow}>
                    <div className={styles.clusterRowMain}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            toggleCluster(cluster);
                            // setExpandedCluster(isExpanded ? null : cluster.name);
                          }}
                          className={styles.checkbox}
                        />
                        <span className={styles.clusterTitle}>
                          {cluster.name}
                        </span>
                      </label>

                      <button
                        className={styles.expandButton}
                        onClick={() => {
                          // toggleCluster(cluster.name);
                          setExpandedCluster(isExpanded ? null : cluster.name);
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
                            const pathChecked = chosenPaths.includes(p.name);
                            return (
                              <label key={p.name} className={styles.subclusterRow}>
                                <input
                                  type="checkbox"
                                  checked={pathChecked}
                                  onChange={() =>
                                    toggleSubcluster(cluster.name, p)
                                  }
                                  disabled={!isChecked}
                                  className={styles.checkbox}
                                />
                                <span className={styles.subclusterText}>
                                  {p.name}
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
