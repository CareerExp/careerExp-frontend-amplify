import "react-quill/dist/quill.snow.css";

import { Box, Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { notify } from "../../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../../redux/slices/authSlice";
import { getResume, selectResume, updateResume } from "../../redux/slices/resumeSlice.js";
import { updatedResumeStatus } from "../../redux/slices/unifiedRecordSlice.js";
import dashboardStyles from "../../styles/ResumeDashboard.module.css";

// Components
import TopSubCard from "./TopSubCard.jsx";
import SectionNavigation from "./SectionNavigation.jsx";
import ContentSection from "./ContentSection.jsx";
import ViewResume from "./sections/ViewResume.jsx";

// Section Components
import PersonalInformation from "./sections/PersonalInformation.jsx";
import Summary from "./sections/Summary.jsx";
import Education from "./sections/Education.jsx";
import Experience from "./sections/Experience.jsx";
import Skills from "./sections/Skills.jsx";
import Projects from "./sections/Projects.jsx";
import Certifications from "./sections/Certifications.jsx";
import Languages from "./sections/Languages.jsx";
import Hobbies from "./sections/Hobbies.jsx";

const ResumeDashboard = () => {
  const isAuthenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const resume = useSelector(selectResume);
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Personal Information");
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      userName: "",
      gender: "",
      birthdate: "",
      nationality: "",
      email: "",
      mobile: "",
      telephone: "",
      linkedIn: "",
      website: "",
    },
    summary: "",
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        grade: "",
        website: "",
      },
    ],
    experience: [
      {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        responsibilities: [""],
        achievements: "",
      },
    ],
    skills: {
      technical: [""],
      soft: [""],
    },
    projects: [
      {
        title: "",
        description: "",
        technologies: [""],
        startDate: "",
        endDate: "",
        link: "",
      },
    ],
    certifications: [
      {
        name: "",
        institution: "",
        link: "",
        issueDate: "",
      },
    ],
    languages: [
      {
        name: "",
        proficiency: "",
      },
    ],
    hobbies: [""],
  });
  const [isGenerated, setIsGenerated] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (token && userId) {
      dispatchToRedux(getResume({ token, userId }));
    }
  }, [token, userId, dispatchToRedux]);

  useEffect(() => {
    if (resume) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        personalInfo: resume.personalInfo || prevFormData.personalInfo,
        summary: resume.summary || prevFormData.summary,
        education: resume.education?.length ? resume?.education : prevFormData.education,
        experience: resume.experience?.length ? resume?.experience : prevFormData.experience,
        skills: resume.skills || prevFormData.skills,
        projects: resume.projects || prevFormData.projects,
        certifications: resume.certifications || prevFormData.certifications,
        languages: resume.languages || prevFormData.languages,
        hobbies: resume.hobbies || prevFormData.hobbies,
      }));
    }
  }, [resume]);

  const handleInputChange = (section, field, event, index) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [section]:
        section === "skills"
          ? {
              ...prev.skills,
              [field]: prev.skills[field].map((skill, i) => (i === index ? value : skill)),
            }
          : section === "summary"
            ? value
            : section === "education"
              ? prev[section]?.map((item, i) => (i === index ? { ...item, [field]: value } : item))
              : section === "experience"
                ? prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item))
                : section === "certifications"
                  ? prev[section].map((cert, i) => (i === index ? { ...cert, [field]: value } : cert))
                  : section === "languages"
                    ? prev.languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang))
                    : section === "hobbies"
                      ? prev.hobbies?.map((hobby, i) => (i === index ? value : hobby))
                      : section === "projects"
                        ? prev.projects.map((project, i) =>
                            i === index ? { ...project, [field]: value } : project,
                          )
                        : { ...prev[section], [field]: value },
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", startDate: "", endDate: "", grade: "" }],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          responsibilities: [""],
          achievements: "",
        },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = (type) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], ""],
      },
    }));
  };

  const handleRemoveSkill = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
          technologies: [""],
          startDate: "",
          endDate: "",
          link: "",
        },
      ],
    }));
  };

  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", institution: "", issueDate: "", link: "" }],
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleAddLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          name: "",
          proficiency: "",
        },
      ],
    }));
  };

  const handleRemoveLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleAddHobby = () => {
    setFormData((prev) => ({
      ...prev,
      hobbies: [...prev.hobbies, ""],
    }));
  };

  const handleRemoveHobby = (index) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  const handleSaveSection = (section) => {
    const currentSectionIndex = sectionList.indexOf(section);
    const nextSection = sectionList[currentSectionIndex + 1];

    setActiveSection(nextSection);

    dispatchToRedux(updateResume({ token, userId, formData }));
  };

  const handleGenerateClick = () => {
    if (resume.summary === "" || resume.education.length === 0 || resume.experience.length === 0) {
      dispatchToRedux(
        notify({ type: "warning", message: "Please fill all the fields before generating the resume." }),
      );
      return;
    }
    try {
      dispatchToRedux(updatedResumeStatus({ userId, token }));
      navigate("/select-resume-template");
    } catch (error) {
      console.log(error);
    }
  };

  const sectionList = [
    "Personal Information",
    "Summary",
    "Education",
    "Experience",
    "Skills",
    "Projects",
    "Certifications",
    "Languages",
    "Hobbies & Interests",
  ];

  // Render the appropriate component based on the active section
  const renderSectionComponent = () => {
    switch (activeSection) {
      case "Personal Information":
        return <PersonalInformation formData={formData} handleInputChange={handleInputChange} />;
      case "Summary":
        return <Summary formData={formData} handleInputChange={handleInputChange} />;
      case "Education":
        return (
          <Education
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddEducation={handleAddEducation}
            handleRemoveEducation={handleRemoveEducation}
          />
        );
      case "Experience":
        return (
          <Experience
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddExperience={handleAddExperience}
            handleRemoveExperience={handleRemoveExperience}
          />
        );
      case "Skills":
        return (
          <Skills
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
        );
      case "Projects":
        return (
          <Projects
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddProject={handleAddProject}
            handleRemoveProject={handleRemoveProject}
          />
        );
      case "Certifications":
        return (
          <Certifications
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddCertification={handleAddCertification}
            handleRemoveCertification={handleRemoveCertification}
          />
        );
      case "Languages":
        return (
          <Languages
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddLanguage={handleAddLanguage}
            handleRemoveLanguage={handleRemoveLanguage}
          />
        );
      case "Hobbies & Interests":
        return (
          <Hobbies
            formData={formData}
            handleInputChange={handleInputChange}
            handleAddHobby={handleAddHobby}
            handleRemoveHobby={handleRemoveHobby}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={dashboardStyles["container"]}>
      {isGenerated ? (
        <Box
          sx={{
            mx: { sm: "2rem", md: "5rem" },
            mt: { sm: "0rem", md: "5rem" },
          }}
        >
          <TopSubCard currentSection={sectionList.indexOf(activeSection) + 1} />
          <Box>
            <Box
              sx={{
                mt: -2.5,
                backgroundColor: "#ffff",
                p: 3,
                borderRadius: "0 0 1.25rem 1.25rem",
              }}
            >
              <Container maxWidth="lg" sx={{ mt: 7 }}>
                <Grid container spacing={1}>
                  {/* Left Section - Navigation */}
                  <Grid item xs={12} sm={4}>
                    <SectionNavigation
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                      sectionList={sectionList}
                      handleGenerateClick={handleGenerateClick}
                    />
                  </Grid>

                  {/* Right Section - Content */}
                  <Grid item xs={12} sm={8}>
                    <ContentSection
                      activeSection={activeSection}
                      handleSaveSection={handleSaveSection}
                      sectionList={sectionList}
                      handleGenerateClick={handleGenerateClick}
                    >
                      {renderSectionComponent()}
                    </ContentSection>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        </Box>
      ) : (
        <ViewResume resume={resume} setIsGenerated={setIsGenerated} />
      )}
    </div>
  );
};

export default ResumeDashboard;
