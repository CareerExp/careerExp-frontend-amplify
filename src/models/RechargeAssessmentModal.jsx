import React, { useState } from "react";
import { Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import PayNowModal from "../models/PayNowModal.jsx";
import SchoolCodeModal from "../models/SchoolCodeModal.jsx";
import SchoolContactFormModal from "../models/SchoolContactFormModal.jsx";
import assessmentStyles from "../styles/AssessmentResult.module.css";
import { fonts } from "../utility/fonts.js";

const RechargeAssessmentModal = ({ open, onClose }) => {
  const [payNowModalOpen, setPayNowModalOpen] = useState(false);
  const [schoolContactFormModalOpen, setSchoolContactFormModalOpen] = useState(false);
  const [schoolCodeModalOpen, setSchoolCodeModalOpen] = useState(false);

  // Function to close the modal

  const handleButtonClick = async () => {
    setPayNowModalOpen(true);
  };

  const handleClosePayModal = () => {
    setPayNowModalOpen(false);
  };

  const handleSchoolContactForm = () => {
    setSchoolContactFormModalOpen(true);
  };

  const handleCloseSchoolContactFormModal = () => {
    setSchoolContactFormModalOpen(false);
  };

  const handleSchoolCode = () => {
    setSchoolCodeModalOpen(true);
  };

  const handleCloseSchoolCodeModal = () => {
    setSchoolCodeModalOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "500px", md: "600px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "16px",
            p: { xs: 3, sm: 4 },
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: "700",
              fontSize: "24px",
              textAlign: "center",
              mb: 3,
              lineHeight: 1.4,
            }}
          >
            You have reached your assessment limit, Please upgrade your plan to continue
          </Typography>

          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            <li className={assessmentStyles["pathItemCard"]} style={{ marginBottom: "24px" }}>
              <p style={{ marginBottom: "12px" }}>
                Pay $49 now to review and download the Full Career Directions Report
              </p>
              <button className={assessmentStyles["navButton"]} onClick={handleButtonClick}>
                Pay Now
              </button>
            </li>
            <li className={assessmentStyles["pathItemCard"]} style={{ marginBottom: "24px" }}>
              <p style={{ marginBottom: "12px" }}>
                If your School has paid on your behalf, please input your School Access Code here to get your
                Career Directions Report
              </p>
              <button className={assessmentStyles["navButton"]} onClick={handleSchoolCode}>
                School Code
              </button>
            </li>
            <li className={assessmentStyles["pathItemCard"]}>
              <p style={{ marginBottom: "12px" }}>
                If you want your School to pay on your behalf please provide School details here and our
                Schools team will contact your School
              </p>
              <button className={assessmentStyles["navButton"]} onClick={handleSchoolContactForm}>
                Contact School
              </button>
            </li>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <button className={assessmentStyles["navButton"]} onClick={onClose}>
              Close
            </button>
          </Box>

          {/* Modals */}
          <SchoolCodeModal open={schoolCodeModalOpen} onClose={handleCloseSchoolCodeModal} />
          <PayNowModal open={payNowModalOpen} onClose={handleClosePayModal} />
          <SchoolContactFormModal
            open={schoolContactFormModalOpen}
            onClose={handleCloseSchoolContactFormModal}
          />
        </Box>
      </Modal>
    </>
  );
};

export default RechargeAssessmentModal;
