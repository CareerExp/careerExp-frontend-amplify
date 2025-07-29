import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText, Paper } from "@mui/material";
import Footer from "../components/Footer";
import Headers from "../components/Headers";
import { fonts } from "../utility/fonts.js";

const TermsAndConditons = () => {
  return (
    <div>
      <Headers />
      <Container maxWidth="lg" sx={{ mt: { xs: 12, sm: 20 }, mb: { xs: 3, sm: 5 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, backgroundColor: "#fff" }}>
          <Box sx={{ margin: "1rem", border: "1px solid #C5C6C7", p: "1rem", borderRadius: "12px" }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                textAlign: "center",
                fontWeight: "600",
                fontFamily: fonts.poppins,
                fontSize: { xs: "24px", sm: "36px" },
              }}
            >
              Terms of Use
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              Welcome to CareerExplorer.me
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We outline below important things you need to know when using CareerExplorer.me “Website” and
              “Platform” as defined in our Privacy Policy. Please read these Terms of Use and Privacy Policy
              carefully before accessing our services.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              1. Who we are
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              The CareerExplorer.me Website and Platform is brought to you by Liberty Insights FZC, a UAE
              registered company located in the Sharjah Technology Research and Innovation Park, Sharjah UAE,
              registration no. SC242014601
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              2. Acceptance of Terms
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              By accessing and using CareerExplorer.me (the &quot;Website&quot; and &quot;Platform&quot;), you
              agree to comply with and be bound by these Terms of Use. The CareerExplorer.me Privacy Policy is
              an integral part of these Terms of Use. By using our services, you acknowledge and accept our
              Privacy Policy and consent to the collection of personal information and data in accordance with
              our Privacy Policy.
              <br /> <br />
              If you do not agree with these Terms, please do not use our services.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              3. Services Description
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 0px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              CareerExplorer.me provides a platform for:
            </Typography>
            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Students"
                  secondary="Access to career exploration tools, video content, and paid assessments."
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Independent Career Counselors"
                  secondary="Ability to create individual personal profiles and upload career guidance content that they have created and can share."
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Educational Institutions and Organizations"
                  secondary="Options to promote a wide range of events on the Platform and purchase bulk access to Career Assessments."
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                />
              </ListItem>
            </List>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              4. User Responsibilities
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText
                  primary="Account Registration"
                  secondary="You must provide accurate and complete information during registration and keep your account details confidential."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Prohibited Conduct"
                  secondary="You agree not to use the Platform for unlawful purposes or upload content that directly promotes the services of educational or marketing consultancies remunerated by educational institutions for successful student admissions . Violation may result in account termination."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
            </List>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              5. Intellectual Property
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText
                  primary="User Content"
                  secondary="By uploading content, you grant Liberty Insights FZC a perpetual, royalty-free right to use, modify, and distribute your content."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Platform Content"
                  secondary="All materials on the Platform are owned by or licensed to Liberty Insights FZC and are protected by intellectual property laws."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
            </List>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              6. Payments and Refunds
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText
                  primary="Assessments"
                  secondary="Paid career assessments are available for purchase."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Storage"
                  secondary="Paid storage space options for Independent Career Counsellors for the upload of their content"
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Refund Policy"
                  secondary="No refunds are provided except in cases of technical failure rendering services unavailable."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
            </List>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              7. Data Sharing
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We may share data collected on the Platform with partners on commercial terms.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              8. Limitation of Liability
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              To the maximum extent permitted by law, Liberty Insights FZC and its affiliates, directors,
              officers, employees, agents, and licensors shall not be liable for any direct, indirect,
              incidental, special, consequential, or exemplary damages arising out of or in connection with
              your use of the Website.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              9. Indemnification
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              You agree to indemnify and hold Liberty Insights FZC and its affiliates, directors, officers,
              employees, agents, and licensors harmless from any claims, losses, damages, liabilities, costs,
              and expenses, including reasonable attorneys' fees, arising out of or related to your use of the
              Website or any violation of these Terms.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              10. Third-Party Websites
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              CareerExplorer.me may contain references to third-party websites. Any such websites or
              hyperlinks are provided for your convenience only. We have no control over third party websites
              and accept no legal responsibility for any content, material or information contained in them.
              The display of any reference or hyperlink to any third party website does not mean that we
              endorse that third party’s website, products or services. Your use of a third party website may
              be governed by the terms and conditions of that third party’s website.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              11. Dispute Resolution
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem>
                <ListItemText
                  primary="Alternative Dispute Resolution (ADR)"
                  secondary="Parties agree to attempt ADR before pursuing legal action."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Governing Law"
                  secondary="These terms are governed by the laws of the UAE, and disputes shall be resolved in UAE courts."
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                      fontWeight: "bold",
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: { xs: "12px", sm: "16px", md: "18px" },
                    },
                  }}
                />
              </ListItem>
            </List>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              12. Modifications to Terms
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We reserve the right to modify these Terms of Use at any time. Changes will be effective upon
              posting on the Website.
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: "600",
                mt: 2,
                fontSize: { xs: "16px", sm: "18px", md: "24px" },
              }}
            >
              13. Contact Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  textAlign: "justify",
                  fontFamily: fonts.poppins,
                  padding: "10px 10px",
                  fontSize: { xs: "12px", sm: "16px", md: "18px" },
                }}
              >
                For any questions regarding these Terms of Use, please contact us at:
              </Typography>
              <Typography component="address" sx={{ mt: 1, fontStyle: "italic", pl: 2 }}>
                Liberty Insights FZC, PO Box 473800, Dubai, UAE. <br />
                admin@careerexplorer.me
              </Typography>
            </Box>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              By using CareerExplorer.me, you acknowledge that you have read, understood, and agree to be
              bound by this Privacy Policy and Terms of Use.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default TermsAndConditons;
