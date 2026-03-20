import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseDetailContent from "../components/CourseDetailContent.jsx";

/**
 * Public course detail page (Explore). Used when clicking a course card or "Enquire Now".
 */
const CourseDetail = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  return (
    <CourseDetailContent
      courseId={courseId}
      onBack={() => navigate("/explore?tab=courses")}
    />
  );
};

export default CourseDetail;
