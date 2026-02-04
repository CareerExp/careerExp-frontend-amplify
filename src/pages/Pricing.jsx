import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { Box, Typography, Button } from "@mui/material";

import { assessmentHeaderImg, commingSoon, Councellers, HighSchools, student, partners } from "../assets/assest";
import pricingStyles from "../styles/Pricing.module.css";
import ServiceProviderRegistrationModal from "../models/ServiceProviderRegistrationModal";
import EducationalInstitutionModal from "../models/EducationalInstitutionModal";
import CorporateRegistrationModal from "../models/CorporateRegistrationModal";

const Pricing = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const [isServiceProviderOpen, setServiceProviderOpen] = useState(false);
  const [isEducationalInstitutionOpen, setEducationalInstitutionOpen] = useState(false);
  return (
    <div>
      <section className={pricingStyles["header"]} style={{ backgroundImage: `url(${assessmentHeaderImg})` }}>
        <h2>Pricing</h2>
      </section>
      <div className={pricingStyles["container"]}>
        <section>
          <p className={pricingStyles["hero-content"]}>
            Our goal is to bring knowledge, opportunities and systems to individuals interested in
            investigating and planning their career pathways and high schools looking to provide cost
            effective Career Services Management.  We strive to keep a lot of our services available for free
            but need to charge for some services in order to continue with our mission of allowing our
            community of students to reach their personal career goals and ambitions.
          </p>
        </section>
        {/* student */}
        <Card
          className={`${pricingStyles["card"]} ${pricingStyles["student"]}`}
          image={student}
          cardName={"Student"}
          heading={"Free Forever for Registered Students:"}
        >
          <CardContent>Library of Global Career content</CardContent>
          <CardContent>Personal Career Planning Workspace</CardContent>
          <CardContent>Resume builder</CardContent>
          <CardContent>Assessment Centre – Top 3 Occupations</CardContent>
          <button className={pricingStyles["button"]}>
            <div>
              <p style={{ textAlign: "start", marginRight: "3px" }}>Full Career Directions Report</p>
              <p>
                <big>
                  <b>$49</b>
                </big>
              </p>
            </div>
          </button>
        </Card>
        {/* Counsellors */}
        <Card
          className={`${pricingStyles["card"]} ${pricingStyles["Counsellors"]}`}
          image={Councellers}
          cardName={"Counsellors"}
          heading={"Free forever for Career Counsellors:"}
        >
          <CardContent>Upload of Career content through shared link</CardContent>
          <CardContent>Personal Profile page</CardContent>
          <CardContent>Highlighted specialization and expertise</CardContent>
          <CardContent>2Gb of cloud storage for file uploads</CardContent>
          <div className={pricingStyles["Counsellors-button-container"]}>
            <button className={pricingStyles["button"]}>
              <p>15Gb of cloud storage for file uploads</p>
              <p>
                <big>
                  <b>$10</b>
                </big>
                /mo
              </p>
            </button>
            <button className={pricingStyles["button"]}>
              <p>Calendar integration for appointments</p>
              <p>
                <big>
                  <b>$10</b>
                </big>
                /mo
              </p>
            </button>
          </div>
        </Card>
        {/* High Schools */}
        <Card
          className={`${pricingStyles["card"]} ${pricingStyles["high-school"]}`}
          image={HighSchools}
          cardName={"High Schools"}
          heading={"Full High School Career Management System"}
        >
          <div className={pricingStyles["high-school-comming-soon-image-container"]}>
            <img src={commingSoon} alt="comming soon image" />
          </div>
        </Card>

        {/* Partner Section */}
        <Box
          sx={{
            mt: { xs: 4, md: 8 },
            background: "linear-gradient(153.09deg, #BF2F75 3.87%, #720361 63.8%)",
            borderRadius: "20px",
            p: { xs: 4, md: "52px 42px" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: "73px" },
          }}
        >
          {/* Illustration side */}
          <Box
            sx={{
              width: { xs: "100%", md: "436px" },
              height: { xs: "auto", md: "290px" },
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={partners}
              alt="Partners"
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Content side */}
          <Box sx={{ flex: 1, color: "white", textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "28px", md: "40px" },
                fontWeight: 800,
                fontFamily: "'Poppins', sans-serif",
                mb: "20px",
                lineHeight: { xs: "40px", md: "55px" },
              }}
            >
              Partner with us
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontFamily: "'Poppins', sans-serif",
                mb: "20px",
                lineHeight: "23px",
              }}
            >
              Join our growing network of trusted education partners and connect directly with students
              and counsellors actively exploring career opportunities.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "20px" },
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                color: "#FAFAFA",
                mb: { xs: 4, md: "52px" },
                lineHeight: "27px",
              }}
            >
              Whether you are an Education Service Provider or an Educational Institution, becoming a
              partner gives you a branded presence, direct enquiries, and visibility across the Career
              Explorer ecosystem.
            </Typography>

            <Button
              variant="contained"
              onClick={() => setIsModalOpen(true)}
              sx={{
                bgcolor: "white",
                borderRadius: "90px",
                px: "30px",
                py: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: { xs: "auto", md: "0" },
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#FAFAFA",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  backgroundImage: "linear-gradient(166.74deg, #BF2F75 3.87%, #720361 63.8%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mr: "12px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Become a Partner
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(166.74deg, #BF2F75 3.87%, #720361 63.8%)",
                  color: "white",
                }}
              >
                <MdArrowOutward size={22} />
              </Box>
            </Button>
          </Box>
        </Box>
      </div>
       <CorporateRegistrationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
          onContinueAsServiceProvider={() => {
    setIsModalOpen(false);
    setServiceProviderOpen(true);
  }}
  onContinueAsEducationalInstitution={() => {
    setIsModalOpen(false);
    setEducationalInstitutionOpen(true);
  }}
      />

      <ServiceProviderRegistrationModal
      open={isServiceProviderOpen}
      onClose={() => setServiceProviderOpen(false)}
/>

      <EducationalInstitutionModal
      open={isEducationalInstitutionOpen}
      onClose={() => setEducationalInstitutionOpen(false)}
  />
    </div>
  );
};

export default Pricing;

const Card = ({ cardName, heading, image, children, className = "" }) => {
  return (
    <section className={className}>
      {/* left */}
      <div className={pricingStyles["left"]}>
        <div>
          <p>{cardName}</p>
          <div></div>
        </div>
      </div>
      {/* right */}
      <div className={pricingStyles["right"]}>
        {/* subleft */}
        <div className={pricingStyles["subleft"]}>
          <img src={image} alt={`${cardName}'s image`} />
        </div>
        {/* subright */}
        <div className={pricingStyles["subright"]}>
          <h3>{heading}</h3>
          {children}
        </div>
      </div>
    </section>
  );
};

const CardContent = ({ children }) => {
  return (
    <div className={pricingStyles["card-content"]}>
      <span>
        <IoMdCheckmark />
      </span>
      {children}
    </div>
  );
};
