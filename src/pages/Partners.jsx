import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tabs,
  Tab,
  TextField,
  Autocomplete,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { countryList } from "../utility/countryList";
import { languages as languageList } from "../utility/category";
import { espSpecializationOptions } from "../utility/espSpecializations";
import { getHeiProgramOptions } from "../api/partnersExploreApi";
import { fonts } from "../utility/fonts";
import partnersStyles from "../styles/Partners.module.css";
import EducationalInstitutions from "../components/partners/EducationalInstitutions";
import EducationServiceProviders from "../components/partners/EducationServiceProviders";
import GovernmentOrganizations from "../components/partners/GovernmentOrganizations";
import CorporateRegistrationModal from "../models/CorporateRegistrationModal";
import { partners } from "../assets/assest";
import { MdArrowOutward } from "react-icons/md";
import pricingStyles from "../styles/Pricing.module.css";
import ServiceProviderRegistrationModal from "../models/ServiceProviderRegistrationModal";
import EducationalInstitutionModal from "../models/EducationalInstitutionModal";

const Partners = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programOptions, setProgramOptions] = useState([]);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCountry, setAppliedCountry] = useState("");
  const [appliedLanguage, setAppliedLanguage] = useState("");
  const [appliedSpecialization, setAppliedSpecialization] = useState("");
  const [appliedProgram, setAppliedProgram] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch HEI program options (default + dynamic) from API
  useEffect(() => {
    let cancelled = false;
    getHeiProgramOptions()
      .then((options) => {
        if (!cancelled && Array.isArray(options)) setProgramOptions(options);
      })
      .catch(() => {
        if (!cancelled) setProgramOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [isServiceProviderOpen, setServiceProviderOpen] = useState(false);
  const [isEducationalInstitutionOpen, setEducationalInstitutionOpen] =
    useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = () => {
    setAppliedSearch(searchValue.trim());
    setAppliedCountry(activeTab === 2 ? "" : selectedCountry?.name || "");
    setAppliedLanguage(activeTab === 2 ? "" : selectedLanguage?.name || "");
    setAppliedSpecialization(
      activeTab === 1 ? selectedSpecialization || "" : "",
    );
    setAppliedProgram(activeTab === 0 ? selectedProgram || "" : "");
  };

  const autocompleteStyle = {
    flex: 1,
    width: "100%",
    minWidth: "150px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "90px",
      backgroundColor: "#F6F6F6",
      "& fieldset": {
        border: "1px solid #dddddd",
      },
      "&:hover fieldset": {
        borderColor: "#dddddd",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#dddddd",
      },
    },
    "& .MuiInputBase-input": {
      fontFamily: fonts.poppins,
      fontSize: "14px",
    },
  };

  return (
    <Box sx={{ mt: "8.5rem" }}>
      <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "2px 2px 10px #a7a7a764",
            width: "82rem",
            maxWidth: "100%",
            margin: "auto",
            marginBottom: "2rem",
            borderRadius: "19px",
            paddingY: "15px",
            paddingX: "30px",
          }}
        >
          {/* Tabs Section - scrollable on mobile so all tabs are accessible */}
          <Box className={partnersStyles["tabs-box"]}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="partners categories"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#bf2f75",
                  height: "3px",
                },
              }}
              sx={{
                "& .MuiTabs-scroller": {
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                },
                "& .MuiTabs-flexContainer": {
                  flexWrap: "nowrap",
                  justifyContent: { xs: "flex-start", md: "center" },
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontFamily: fonts.poppins,
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#999999",
                  minWidth: "auto",
                  px: 4,
                  whiteSpace: "nowrap",
                  "&.Mui-selected": {
                    color: "#bf2f75",
                  },
                },
              }}
            >
              <Tab label="Education Institutions" />
              <Tab label="Education Service Providers" />
              <Tab label="Government & Community Organizations" />
            </Tabs>
          </Box>

          {/* Filters Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            {/* Search Input */}
            <TextField
              placeholder="Search"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                flex: 2,
                width: "100%",
                maxWidth: "379px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "90px",
                  backgroundColor: "#F6F6F6",
                  "& fieldset": {
                    border: "1px solid #dddddd",
                  },
                  "&:hover fieldset": {
                    borderColor: "#dddddd",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#dddddd",
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: fonts.poppins,
                  fontSize: "14px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchValue && (
                      <IconButton
                        size="small"
                        onClick={() => setSearchValue("")}
                        sx={{
                          mr: 0.5,
                          color: "#720361",
                          "&:hover": {
                            backgroundColor: "rgba(114, 3, 97, 0.08)",
                          },
                        }}
                        aria-label="Clear search"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    <SearchIcon sx={{ color: "#720361" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Country Dropdown - only for Education Institutions and Education Service Providers */}
              {activeTab !== 2 && (
                <Autocomplete
                  options={countryList}
                  getOptionLabel={(option) => option.name}
                  value={selectedCountry}
                  onChange={(event, newValue) => setSelectedCountry(newValue)}
                  className={partnersStyles["autocomplete-country"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Country"
                      variant="outlined"
                    />
                  )}
                  sx={autocompleteStyle}
                />
              )}

              {/* Language Dropdown - only for Education Institutions and Education Service Providers */}
              {activeTab !== 2 && (
                <Autocomplete
                  options={languageList}
                  getOptionLabel={(option) => option.name}
                  value={selectedLanguage}
                  onChange={(event, newValue) => setSelectedLanguage(newValue)}
                  className={partnersStyles["autocomplete-country"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Language"
                      variant="outlined"
                    />
                  )}
                  sx={autocompleteStyle}
                />
              )}

              {/* Specialization Dropdown - only for Education Service Providers */}
              {activeTab === 1 && (
                <Autocomplete
                  options={espSpecializationOptions}
                  getOptionLabel={(option) => option}
                  value={selectedSpecialization}
                  onChange={(event, newValue) =>
                    setSelectedSpecialization(newValue)
                  }
                  className={partnersStyles["autocomplete-specialization"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Specialization"
                      variant="outlined"
                    />
                  )}
                  sx={autocompleteStyle}
                />
              )}

              {/* Programs Dropdown - only for Education Institutions (HEI) */}
              {activeTab === 0 && (
                <Autocomplete
                  options={programOptions}
                  getOptionLabel={(option) => option}
                  value={selectedProgram}
                  onChange={(event, newValue) => setSelectedProgram(newValue)}
                  className={partnersStyles["autocomplete-specialization"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Program"
                      variant="outlined"
                    />
                  )}
                  sx={autocompleteStyle}
                />
              )}

              {/* Search Button */}
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  background: "linear-gradient(to top left, #720361, #bf2f75)",
                  borderRadius: "90px",
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontFamily: fonts.poppins,
                  fontWeight: "bold",
                  fontSize: "16px",
                  "&:hover": {
                    background:
                      "linear-gradient(to top left, #720361, #bf2f75)",
                    opacity: 0.9,
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Tab Content Section */}
        <Box className={partnersStyles["tabs-content"]}>
          {activeTab === 0 && (
            <EducationalInstitutions
              search={appliedSearch}
              country={appliedCountry}
              language={appliedLanguage}
              program={appliedProgram}
            />
          )}
          {activeTab === 1 && (
            <EducationServiceProviders
              search={appliedSearch}
              country={appliedCountry}
              language={appliedLanguage}
              specialization={appliedSpecialization}
            />
          )}
          {activeTab === 2 && (
            <GovernmentOrganizations search={appliedSearch} />
          )}
        </Box>

        {/* Partner Section */}
        <Box
          sx={{
            mt: { xs: 4, md: 6 },
            mb: { xs: 4, md: 10 },
            mx: { xs: "0", md: 7 },
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
                  width: "36px",
                  height: "36px",
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
      </Container>

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
    </Box>
  );
};

export default Partners;
