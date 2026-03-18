import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React, { useState } from "react";

import {
  A,
  assessmentHeaderImg,
  B,
  C,
  D,
  E,
  mohamedPhoto,
  JClaytonKennedy,
  MatthiasFeist,
} from "../assets/assest.js";
import Footer from "../components/Footer";
import Headers from "../components/Headers";
import aboutStyles from "../styles/About.module.css";

const AboutUs = () => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const handleClickOpen = (card) => {
    setSelectedCard(card);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={open ? aboutStyles["blur-background"] : ""}>
      <Headers />
      <section
        className={aboutStyles["header"]}
        style={{ backgroundImage: `url(${assessmentHeaderImg})` }}
      >
        <h2>About Us</h2>
      </section>
      <div className={aboutStyles["container"]}>
        <section className={aboutStyles["hero"]}>
          <img src={mohamedPhoto} alt="Founder" />
          <div className={aboutStyles["founder-details-small-device"]}>
            <p className={aboutStyles["hero-text-content-founder-name"]}>
              Mohamed Maladwala
            </p>
            <p className={aboutStyles["hero-text-content-founder-position"]}>
              Founder, CareerExplorer.me
            </p>
          </div>
          <div className={aboutStyles["hero-text"]}>
            <p className={aboutStyles["hero-text-about-us"]}>About Us</p>
            <h3>Get to Know Us</h3>
            <div className={aboutStyles["hero-text-content"]}>
              <p>
                At CareerExplorer.me we are a small group of dedicated
                professionals from various fields bringing our expertise to
                serve those interested in planning and developing their career
                paths and the advisers, guides or counsellors who seek to assist
                them in reaching their career aspirations.
              </p>
              <p>
                Our ambition is to make students consider a wide range of
                possibilities and then using our career guidance model and
                tools, explore to gain clarity and make decisions that create a
                positive impact on the direction of early stage careers.{" "}
              </p>
              <p>
                We use AI and rich individual datasets to provide relevant and
                hyper-personalized information that stays current with the
                changing demands of the job market and the educational and
                training opportunities that will allow students to make well
                thought through choices, that progress them along their career
                journeys.
              </p>
              <p>
                “We will always look at ways to provide the best experience and
                greatest value to our community of students, counsellors and
                educational partners”
              </p>
            </div>
            <div className={aboutStyles["founder-details-large-device"]}>
              <p className={aboutStyles["hero-text-content-founder-name"]}>
                Mohamed Maladwala
              </p>
              <p className={aboutStyles["hero-text-content-founder-position"]}>
                Founder, CareerExplorer.me
              </p>
            </div>
          </div>
        </section>

        <section className={aboutStyles["bottom-container"]}>
          <h3>Advisory Board</h3>
          <p>
            To set the direction of our corporate compass we have our Advisory
            Board whose members  bring their expert knowledge to shape the
            current and future offering of CareerExplorer.me.
          </p>
          <div className={`${aboutStyles["cards-container"]}`}>
            <div>
              <div
                onClick={() =>
                  handleClickOpen({
                    image: JClaytonKennedy,
                    name: "J Clayton Kennedy",
                    designation: "",
                    about:
                      "J. Clayton Kennedy is a dynamic executive leader and international business professional with a proven record of building rapport, inspiring trust, and driving successful outcomes in global markets. His rich experience includes  five years as the Vice President of International Client Relations at Kuder, a leading career guidance solutions company",
                  })
                }
              >
                <Card
                  image={JClaytonKennedy}
                  name="J Clayton Kennedy"
                  designation=""
                />
              </div>
              <div
                onClick={() =>
                  handleClickOpen({
                    image: MatthiasFeist,
                    name: "Matthias Feist",
                    designation: "",
                    about:
                      "Matthias Feist works across EdTech and Higher Education. He collaborates globally on education and technology, startups, and the future of work. He currently supports early stage startups at Queen’s University Belfast and beyond. Educated in Germany, the UK and Japan, Matthias holds a master’s degree in Japanese studies, intercultural communication and psychology.",
                  })
                }
              >
                <Card
                  image={MatthiasFeist}
                  name="Matthias Feist"
                  designation=""
                />
              </div>
              <div
                onClick={() =>
                  handleClickOpen({
                    image: C,
                    name: "To Be Announced",
                    designation: "",
                    about: "Details about To Be Announced.",
                  })
                }
              >
                <Card image={C} name="To Be Announced" designation="" />
              </div>
            </div>
            <div>
              <div
                onClick={() =>
                  handleClickOpen({
                    image: D,
                    name: "To Be Announced",
                    designation: "",
                    about: "Details about To Be Announced.",
                  })
                }
              >
                <Card image={D} name="To Be Announced" designation="" />
              </div>
              <div
                onClick={() =>
                  handleClickOpen({
                    image: E,
                    name: "To Be Announced",
                    designation: "",
                    about: "Details about To Be Announced.",
                  })
                }
              >
                <Card image={E} name="To Be Announced" designation="" />
              </div>
              <div
                onClick={() =>
                  handleClickOpen({
                    image: E,
                    name: "To Be Announced",
                    designation: "",
                    about: "Details about To Be Announced.",
                  })
                }
              >
                <Card image={E} name="To Be Announced" designation="" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: "1.8125rem" }}>Advisory Board Member</h3>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          style={{ display: "flex", gap: "1rem" }}
          className={aboutStyles["dialogContent"]}
        >
          <div>
            <img
              src={selectedCard.image}
              alt={selectedCard.name}
              width="200px"
              height="200px"
              style={{ borderRadius: "18px" }}
            />
            <h3>{selectedCard.name}</h3>
            <p>{selectedCard.designation}</p>
          </div>
          <div
            style={{
              backgroundColor: "#F2F2F2",
              padding: "1rem",
              borderRadius: ".6rem",
              width: "100%",
            }}
          >
            <p
              style={{
                fontWeight: "700",
                fontSize: "15px",
                textWrap: "nowrap",
              }}
            >
              About me
            </p>
            <p style={{ color: "#777777", fontSize: "14px" }}>
              {selectedCard.about}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutUs;

const Card = ({ image, name, designation }) => {
  return (
    <div style={{ cursor: "pointer" }} className={aboutStyles["card"]}>
      <img src={image} alt={name} />
      <div>
        <p style={{ marginBottom: ".8rem", textAlign: "center" }}>{name}</p>
        <p style={{ color: "#7e7e7e", textAlign: "center" }}>{designation}</p>
      </div>
    </div>
  );
};
