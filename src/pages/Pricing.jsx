import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { Box, Typography, Button } from "@mui/material";

import {
  assessmentHeaderImg,
  Councellers,
  espServiceProviders,
  HighSchools,
  student,
  partners,
} from "../assets/assest";
import pricingStyles from "../styles/Pricing.module.css";
import ServiceProviderRegistrationModal from "../models/ServiceProviderRegistrationModal";
import EducationalInstitutionModal from "../models/EducationalInstitutionModal";
import CorporateRegistrationModal from "../models/CorporateRegistrationModal";

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServiceProviderOpen, setServiceProviderOpen] = useState(false);
  const [isEducationalInstitutionOpen, setEducationalInstitutionOpen] =
    useState(false);

  return (
    <div>
      <section
        className={pricingStyles["header"]}
        style={{ backgroundImage: `url(${assessmentHeaderImg})` }}
      >
        <h2>Pricing</h2>
      </section>
      <div className={pricingStyles["container"]}>
        <section>
          <p className={pricingStyles["hero-content"]}>
            Our goal is to bring knowledge, opportunities and systems to
            individuals interested in investigating and planning their career
            pathways and high schools looking to provide cost effective Career
            Services Management. We strive to keep a lot of our services
            available for free but need to charge for some services in order to
            continue with our mission of allowing our community of students to
            reach their personal career goals and ambitions.
          </p>
        </section>

        {/* Card 1: Student */}
        <PricingCard
          title="Student"
          image={student}
          heading="Free Forever for Registered Students:"
          listItems={[
            "Library of Global Career content",
            "Personal Career Planning Workspace",
            "Resume builder",
            "Assessment Centre – Top 3 Occupations",
          ]}
          buttons={[{ label: "Full Career Directions Report", price: "$49" }]}
        />

        {/* Card 2: Counsellors */}
        <PricingCard
          title="Counsellors"
          image={Councellers}
          heading="Free forever for Career Counsellors:"
          listItems={[
            "Upload of Career content through shared link",
            "Personal Profile page",
            "Highlighted specialization and expertise",
            "2Gb of cloud storage for file uploads",
          ]}
          buttons={[{ label: "Guide. Share. Inspire.", price: "" }]}
          // buttonsRow
        />

        {/* Card 3: Higher Education Institutions */}
        <PricingCard
          title="Higher Education Institutions"
          image={HighSchools}
          heading="For Higher Education Institutions:"
          listItems={[
            "Dedicated Institutional profile page",
            "Add counselors, advisors to represent your institution",
            "Promote events to reach prospective students",
            "Receive Premium Onboarding & Dedicated Support",
            "Publish videos, podcasts, and articles",
            "Share institutional news and announcements",
            "Access a built-in Content Management System",
            "View performance through the Administrator Analytics Dashboard",
          ]}
          buttons={[
            {
              label: "Activate Institution Plan",
              price: "$100/month",
              priceAccent: "(or $1000/year)",
            },
          ]}
          twoColumnList
          onCtaClick={() => setIsModalOpen(true)}
        />

        {/* Card 4: Education Service Providers */}
        <PricingCard
          title="Education Service Providers"
          image={espServiceProviders}
          heading="For Education Service Providers:"
          listItems={[
            "Dedicated company profile page",
            "Add counselors to represent your institution",
            "Promote events to reach prospective students",
            "Receive Premium Onboarding & Dedicated Support",
            "Publish videos, podcasts, and articles",
            "Share news and announcements",
            "Access a built-in Content Management System",
            "View performance through the Administrator Analytics Dashboard",
          ]}
          buttons={[
            {
              label: "Activate Company Plan",
              price: "$150/month",
              priceAccent: "(or $1500/year)",
            },
          ]}
          twoColumnList
          onCtaClick={() => setIsModalOpen(true)}
        />

        {/* Partner Section */}
        <Box
          sx={{
            mt: { xs: 4, md: 8 },
            mx: { xs: 2, md: 7 },
            background:
              "linear-gradient(153.09deg, #BF2F75 3.87%, #720361 63.8%)",
            borderRadius: "20px",
            p: { xs: 4, md: "52px 42px" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: "73px" },
          }}
        >
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
              sx={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              color: "white",
              textAlign: { xs: "center", md: "left" },
            }}
          >
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
              Join our growing network of trusted education partners and connect
              directly with students and counsellors actively exploring career
              opportunities.
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
              Whether you are an Education Service Provider or an Educational
              Institution, becoming a partner gives you a branded presence,
              direct enquiries, and visibility across the Career Explorer
              ecosystem.
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
                mx: { xs: "auto", md: 0 },
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
                  backgroundImage:
                    "linear-gradient(166.74deg, #BF2F75 3.87%, #720361 63.8%)",
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
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(166.74deg, #BF2F75 3.87%, #720361 63.8%)",
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

/** Figma-style pricing card: title + accent line, image left, content right (heading, list, CTA button(s)). */
function PricingCard({
  title,
  image,
  heading,
  listItems = [],
  buttons = [],
  buttonsRow = false,
  twoColumnList = false,
  onCtaClick,
}) {
  const buttonsClass = buttonsRow
    ? `${pricingStyles["pricingCardButtons"]} ${pricingStyles["pricingCardButtonsRow"]}`
    : pricingStyles["pricingCardButtons"];

  return (
    <section className={pricingStyles["pricingCard"]}>
      <div className={pricingStyles["pricingCardHeader"]}>
        <h2 className={pricingStyles["pricingCardTitle"]}>{title}</h2>
        <div
          className={pricingStyles["pricingCardAccentLine"]}
          aria-hidden="true"
        />
      </div>
      <div className={pricingStyles["pricingCardBody"]}>
        <div className={pricingStyles["pricingCardImageWrap"]}>
          <img src={image} alt="" />
        </div>
        <div className={pricingStyles["pricingCardContent"]}>
          <div>
            <h3 className={pricingStyles["pricingCardHeading"]}>{heading}</h3>
            {twoColumnList ? (
              <div className={pricingStyles["pricingCardListTwoCol"]}>
                <div className={pricingStyles["pricingCardList"]}>
                  {listItems.slice(0, 4).map((text, i) => (
                    <div
                      key={i}
                      className={pricingStyles["pricingCardListItem"]}
                    >
                      <span>
                        <IoMdCheckmark size={14} />
                      </span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className={pricingStyles["pricingCardList"]}>
                  {listItems.slice(4, 8).map((text, i) => (
                    <div
                      key={i}
                      className={pricingStyles["pricingCardListItem"]}
                    >
                      <span>
                        <IoMdCheckmark size={14} />
                      </span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={pricingStyles["pricingCardList"]}>
                {listItems.map((text, i) => (
                  <div key={i} className={pricingStyles["pricingCardListItem"]}>
                    <span>
                      <IoMdCheckmark size={14} />
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {buttons.length > 0 && (
            <div className={buttonsClass}>
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  className={pricingStyles["pricingCardButton"]}
                  onClick={onCtaClick || undefined}
                >
                  <span className={pricingStyles["pricingCardButtonLabel"]}>
                    {btn.label}
                  </span>
                  <span className={pricingStyles["pricingCardButtonPrice"]}>
                    {btn.price}
                    {btn.priceAccent ? (
                      <span
                        className={pricingStyles["pricingCardButtonPriceAccent"]}
                      >
                        {" "}
                        {btn.priceAccent}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
