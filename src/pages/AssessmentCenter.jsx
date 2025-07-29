import React, { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { assessmentCardBg, assessmentHeaderImg, assessmentHeroImg } from "../assets/assest.js";
import { notify } from "../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { getUnifiedRecordData, selectUnifiedRecord } from "../redux/slices/unifiedRecordSlice.js";
import assessmentStyle from "../styles/AssessmentCenter.module.css";
import commonStyle from "../styles/Common.module.css";
import RechargeAssessmentModal from "../models/RechargeAssessmentModal.jsx";

const AssessmentCenter = () => {
  const navigate = useNavigate();
  const dispatchToRedux = useDispatch();
  const isAuthenticated = useSelector(selectAuthenticated);
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const unifiedRecord = useSelector(selectUnifiedRecord);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatchToRedux(getUnifiedRecordData({ userId, token }));
    }
  }, [isAuthenticated, userId, token, dispatchToRedux]);

  const cardItems = [
    {
      heading: "Think about what you like",
      content:
        "Try not think about how qualified you are to do the work or how much you would earn doing this work.",
    },
    {
      heading: "Don’t feel guilty",
      content:
        "Try not to guilt-trip yourself into choosing one activity over another based on perceived expectations or what’s socially acceptable.",
    },
    {
      heading: "Don’t worry about failing",
      content:
        "There are no right or wrong answers. Each person is different with unique strengths, interests and personality.",
    },
    {
      heading: "Keep an Open mind",
      content:
        "Be open to Career Directions you may never have previously considered. It’s likely that you may be nest suited to careers you have never thought about",
    },
    {
      heading: "No time limit",
      content:
        "Don’t feel rushed. It should not take you longer than 30 minutes but don’t worry if it takes a little longer.",
    },
  ];

  const handleCloseModal = () => {
    setOpenPaymentModal(false);
  };

  const handleAssessmentClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    if (isAuthenticated) {
      if (unifiedRecord?.combinedPayment.isPaid && unifiedRecord?.combinedPayment.remainingAttempts > 0) {
        navigate("/interest-profiler");
      } else if (
        !unifiedRecord?.combinedPayment.isPaid &&
        unifiedRecord?.combinedPayment.remainingAttempts === 3
      ) {
        navigate("/interest-profiler");
      } else {
        setOpenPaymentModal(true);
        // dispatchToRedux(
        //   notify({
        //     message: "You have reached your assessment limit, Please upgrade your plan to continue",
        //     type: "error",
        //   }),
        // );
      }
    }
  };

  return (
    <>
      <div className={assessmentStyle["container"]}>
        <section
          className={assessmentStyle["header"]}
          style={{ backgroundImage: `url(${assessmentHeaderImg})` }}
        >
          <h2>Our Assessments</h2>
        </section>
        <section className={assessmentStyle["main"]}>
          <div className={assessmentStyle["left"]}>
            <img src={assessmentHeroImg} alt="hero Image" />
          </div>
          <div className={assessmentStyle["right"]}>
            <h3>Assessment Center</h3>
            <p>
              <span>
                We have developed our Career Assessment to give you insights to your strengths, interests and
                personality. We combine the use of a broad range of tried and tested instruments with
                Artificial Intelligence to provide you with targeted information on career pathways that are
                most suited to your personality and which you are most likely to be successful in.
              </span>
              <span>
                Use the downloadable Career Directions Report to have meaningful discussions with your friends
                and family, then Explore further with selected Colleges and Universities to make the best
                Educational and Career pathway decisions.
              </span>
              <span>
                After completing all sections of the Assessment, you get a taster of your 3 Best-fit Career
                Pathway options for free.
              </span>
              <b>
                The full Career Directions Report with online links and references is for the introductory
                price of $49.
              </b>
            </p>
            <button
              className={commonStyle["navButton"]}
              style={{ height: "3rem", display: "flex", alignItems: "center" }}
              onClick={handleAssessmentClick}
            >
              Start Assessment
              <span style={{ marginLeft: "0.5rem" }}>
                <MdArrowOutward size={"1.5rem"} />
              </span>
            </button>
          </div>
        </section>
        <section className={assessmentStyle["assessment-format"]}>
          <h3>Assessment Format</h3>
          <p>
            The Assessment is in 2 parts – Part A and Part B. Part A has 30 questions and Part B 24 questions,
            After you complete Parts A and B there are a few more educational questions that allow us to fine
            tune your results.
          </p>
          <div className={assessmentStyle["good-to-know"]}>
            <div></div>
            <h4>Good to know</h4>
            <div></div>
          </div>
          <ul className={assessmentStyle["cardsList"]}>
            {cardItems.map(({ heading, content }, index) => (
              <li key={index} style={{ backgroundImage: `url(${assessmentCardBg})` }}>
                <h5>{heading}</h5>
                <p>{content}</p>
              </li>
            ))}
          </ul>
          <button className={commonStyle["navButton"]} onClick={handleAssessmentClick}>
            Let's Go
            <span>
              <MdArrowOutward />
            </span>
          </button>
        </section>
        <RechargeAssessmentModal open={openPaymentModal} onClose={handleCloseModal} />
      </div>
    </>
  );
};
export default AssessmentCenter;
