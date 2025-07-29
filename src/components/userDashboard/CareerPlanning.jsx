import "react-quill/dist/quill.snow.css";

import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { editCareerPlanning } from "../../assets/assest.js";
import { selectAuthenticated, selectToken, selectUserId } from "../../redux/slices/authSlice";
import {
  createCareerPlanning,
  getCareerPlanningStatus,
  updateCareerPlanning,
} from "../../redux/slices/careerPlanningSlice.js";
import { fonts } from "../../utility/fonts.js";
import { notify } from "../../redux/slices/alertSlice.js";

const styles = {
  quillEditor: {
    backgroundColor: "#F2F2F2",
    borderRadius: "8px", // Adjust border radius here
    padding: "12px", // Optional: padding inside the editor
  },
};

const CareerPlanning = () => {
  const dispatchToRedux = useDispatch();
  const isAuthenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const [careerPlanning, setCareerPlanning] = useState({
    careerOfInterest: "",
    educationalOptions: "",
    researchToDo: "",
    skillsToBuild: "",
    topCareerGoals: "",
  });

  const handleEditorChange = (value, field) => {
    setCareerPlanning((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleBlur = async (field) => {
    const updatedField = careerPlanning[field];
    if (updatedField) {
      let result;
      if (careerPlanning._id) {
        // Update
        result = await dispatchToRedux(
          updateCareerPlanning({
            userId,
            token,
            [field]: updatedField,
          }),
        );
        if (result && !result.error) {
          dispatchToRedux(notify({ type: "success", message: "Career planning updated successfully!" }));
        }
      } else {
        // Create
        result = await dispatchToRedux(
          createCareerPlanning({
            userId,
            token,
            [field]: updatedField,
          }),
        );
        if (result && !result.error) {
          dispatchToRedux(notify({ type: "success", message: "Career planning created successfully!" }));
        }
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      const fetchData = async () => {
        const response = await dispatchToRedux(getCareerPlanningStatus({ token, userId }));
        if (response.payload) {
          setCareerPlanning(response.payload.data);
        }
      };
      fetchData();
    }
  }, [dispatchToRedux, isAuthenticated, token, userId]);

  return (
    <div>
      <Box>
        <Box sx={{ ml: 2, mt: 2, mb: 2 }}>
          <Typography variant="h5" sx={{ fontFamily: fonts.poppins, fontWeight: "bold", fontSize: "20px" }}>
            Career Planning
          </Typography>
        </Box>

        {/* Career Of Interest */}
        <Box sx={{ p: 2, backgroundColor: "white", mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: fonts.poppins, fontWeight: "bold", fontSize: "16px" }}>
              Career Of Interest
            </Typography>
            <IconButton>
              <img src={editCareerPlanning} alt="Edit Career Planning" width={"25px"} />
            </IconButton>
          </Box>
          <ReactQuill
            value={careerPlanning.careerOfInterest}
            onChange={(value) => handleEditorChange(value, "careerOfInterest")}
            onBlur={() => handleBlur("careerOfInterest")}
            style={styles.quillEditor}
            theme="snow"
          />
        </Box>

        {/* Educational Options */}
        <Box sx={{ p: 2, backgroundColor: "white", mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: fonts.poppins, fontWeight: "bold", fontSize: "16px" }}>
              Educational Options
            </Typography>
            <IconButton>
              <img src={editCareerPlanning} alt="Edit Career Planning" width={"25px"} />
            </IconButton>
          </Box>
          <ReactQuill
            value={careerPlanning.educationalOptions}
            onChange={(value) => handleEditorChange(value, "educationalOptions")}
            onBlur={() => handleBlur("educationalOptions")}
            style={styles.quillEditor}
            theme="snow"
          />
        </Box>

        {/* Research to Do */}
        <Box sx={{ p: 2, backgroundColor: "white", mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: fonts.poppins, fontWeight: "bold", fontSize: "16px" }}>
              Research To Do
            </Typography>
            <IconButton>
              <img src={editCareerPlanning} alt="Edit Career Planning" width={"25px"} />
            </IconButton>
          </Box>
          <ReactQuill
            value={careerPlanning.researchToDo}
            onChange={(value) => handleEditorChange(value, "researchToDo")}
            onBlur={() => handleBlur("researchToDo")}
            style={styles.quillEditor}
            theme="snow"
          />
        </Box>

        {/* Skills To Build */}
        <Box sx={{ p: 2, backgroundColor: "white", mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: fonts.poppins, fontWeight: "bold", fontSize: "16px" }}>
              Skills To Build
            </Typography>
            <IconButton>
              <img src={editCareerPlanning} alt="Edit Career Planning" width={"25px"} />
            </IconButton>
          </Box>
          <ReactQuill
            value={careerPlanning.skillsToBuild}
            onChange={(value) => handleEditorChange(value, "skillsToBuild")}
            onBlur={() => handleBlur("skillsToBuild")}
            style={styles.quillEditor}
            theme="snow"
          />
        </Box>

        {/* Top 3 Career Goals */}
        <Box sx={{ p: 2, backgroundColor: "white", mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: fonts.poppins, fontWeight: "bold", fontSize: "16px" }}>
              Top 3 Career Goals
            </Typography>
            <IconButton>
              <img src={editCareerPlanning} alt="Edit Career Planning" width={"25px"} />
            </IconButton>
          </Box>
          <ReactQuill
            value={careerPlanning.topCareerGoals}
            onChange={(value) => handleEditorChange(value, "topCareerGoals")}
            onBlur={() => handleBlur("topCareerGoals")}
            style={styles.quillEditor}
            theme="snow"
          />
        </Box>
      </Box>
    </div>
  );
};

export default CareerPlanning;
