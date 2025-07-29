import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText, Paper } from "@mui/material";
import Footer from "../components/Footer";
import Headers from "../components/Headers";
import { fonts } from "../utility/fonts.js";

const PrivacyAndPolicy = () => {
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
              Privacy Policy
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              Liberty Insights FZC ("we," "our," "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you visit our
              website, CareerExplorer.me (the "Website"), and register on the Website to access tools and
              services on our career exploration platform (the "Platform"). We are committed to protecting
              your privacy and handling your personal data in compliance with the laws of the United Arab
              Emirates ("UAE").
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
              1. Introduction
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              By accessing or using our Website and Platform, you consent to the practices described in this
              Privacy Policy. If you do not agree, please refrain from using our services.
              <br /> <br />
              Changes to our policy will be updated on our Website only. You should check our policy from time
              to time to ensure that you are happy with any modifications. This policy was last updated on
              12th December 2024.
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
              2. Information We Collect
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We may collect the following types of information:
            </Typography>

            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Personal Identification Information"
                  secondary="Name, email address, phone number, date of birth, and other contact details."
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
                  primary="Demographic Information"
                  secondary="Age, gender, educational background, and career interests."
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
                  primary="Usage Data"
                  secondary="Information on how you interact with our Website and Platform, including access times, pages viewed, and the resources you access."
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
                  primary="Content"
                  secondary="Materials you upload or share on the Platform, such as notes, videos, and other user-generated content."
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
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              All data collected from the Website and Platform is stored in a one unified database
              environment.
              <br /> <br />
              Due to the communications standards on the internet, when you visit our Website or Platform we
              also automatically receive the URL of the site from which you came and the site to which you are
              going to when you leave our Website or Platform.
              <br /> <br />
              We receive the internet protocol (“IP”) address of your computer, your computer operating system
              and type of web browser you are using, email patterns, your mobile device and mobile operating
              system (if you are accessing our Website or Platform using a mobile device), as well as the name
              of your ISP or your mobile carrier.
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
              3. How We Use Your Information
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We use the collected information for various purposes, including:
            </Typography>

            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Providing and Improving Services"
                  secondary="To operate and enhance the functionality of our Website and Platform."
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
                  primary="Personalization"
                  secondary="To tailor content and resources to your interests and needs."
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
                  primary="Communication"
                  secondary="To send you updates, newsletters, and other information related to our services."
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
                  primary="Analytics"
                  secondary="To monitor and analyze usage patterns to improve user experience."
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
                  primary="Compliance"
                  secondary="To adhere to legal obligations and protect our rights."
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
              4. What We Do With The Information We Gather
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We require this information to understand your needs and provide you with a better service, and
              in particular for the following reasons:
            </Typography>

            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Account Creation"
                  secondary="By providing information on the Platform, for the purposes of becoming a Site User, creating your CareerExplorer User account or adding any additional details to your CareerExplorer User profile, you are expressly and voluntarily accepting the terms and conditions of this Privacy Policy and CareerExplorer’s Terms of Use that allow us to process information about you."
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
                  primary="Voluntary Information"
                  secondary="Supplying information to us, including any information deemed “sensitive” by applicable law, is entirely voluntary on your part. You have the right to withdraw your consent to CareerExplorer’s collection and processing of your information at any time, in accordance with the terms of this Privacy Policy and the Terms of Use, by changing your Settings, or by closing your account, but please note that your withdrawal of consent will not be retroactive."
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
                  primary="Minimal Information Required"
                  secondary="In order to become a User of our Platform, you must provide us the following information to create an account: first name, last name, gender, mobile number, Role, email address and password. Without this minimal amount of information, you cannot create an account. We may request other information from you during whilst you use the Platform (eg when Students use our Career Assessments and Resume Builder and other tools). We use this to provide better, more customized marketing services such as updates, better ads, and more valuable information. You acknowledge that this information is personal to you, and by creating an account on our Website and Platform, you allow us and selected third parties, to identify you and to allow us to use your information in accordance with our Terms of Use."
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
                  primary="Marketing"
                  secondary="This means we’ll: create a profile about you to help us understand you as a customer and tailor the communications we send you; tell you about other products and services you might be interested in; try to identify products and services you’re interested in; and send you information (about the products and services we or our partners, provide) by phone, post, email, text message and online banner advertising. We also use the information we have about you to personalise these messages wherever we can as we believe it is important to make them relevant to you. You can ask us to stop sending you marketing information or withdraw your permission at any time."
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
              5. Sharing Your Information
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We may share your information with:
            </Typography>

            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Partners and Affiliates"
                  secondary="Educational institutions, career counselors, and other partners for service delivery and promotional purposes."
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
                  primary="Service Providers"
                  secondary="Third-party vendors who assist in operating our services, subject to confidentiality agreements."
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
                  primary="Legal Authorities"
                  secondary="When required by law or to protect our rights and safety."
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
              6. Links to Other Websites
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              Our Website and Platform may contain links to other websites of interest. However, once you have
              used these links to leave our site, you should note that we do not have any control over those
              other website. Therefore, we cannot be responsible for the protection and privacy of any
              information which you provide whilst visiting such sites and such sites are not governed by this
              privacy statement. You should exercise caution and look at the privacy statement applicable to
              the website in question.
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
              7. What We Use Cookies For
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We use cookies to check whether or not you are logged in and to identify which of our high
              availability servers you are looking at. We also use cookies to help collect analytics data to
              constantly improve your on-site experience. It is your legal right to opt-out of this data
              collection if you so wish.
              <br /> <br />
              Like most websites, we use cookies and web log files to track site usage and trends, to improve
              the quality of our service, to customize your experience on our Websites and Services, as well
              as to deliver ours and third-party advertising to Website and Platform Users both on and off our
              Website and Services. A cookie is a tiny data file which asks permission to be placed on your
              computer’s hard drive. Once you agree, this small file resides on your computer, mobile phone,
              or other device, and allows us to recognize you as a Website or Platform User, when you return
              to our Websites or Services using the same computer and web browser. A cookie in no way gives us
              access to your computer or any information about you, other than the data you choose to share
              with us. You can remove or block cookies using the settings in your browser, but in some cases
              doing so may impact your ability to use our Websites or Services.
              <br /> <br />
              In the course of serving advertisements or optimizing the services to our Website or Platform
              Users, we may allow authorized third parties to place or recognize a unique cookie on your
              browser. Any information provided to third parties through cookies will not be personally
              identifiable but may provide general segment information (e.g. your industry or geography or
              information about your professional or educational background) for the enhancement of your user
              experience by providing more relevant advertising. Most browsers are initially set up to accept
              cookies, but you can reset your browser to refuse all cookies or to indicate when a cookie is
              being sent. Our Websites and Services do not store unencrypted personally identifiable
              information in the cookies.
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
              8. Removing a Cookie
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              Removing a cookie varies depending on which browser you are using.
            </Typography>

            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Firefox "
                  secondary="To remove a cookie, Right Click on the page you are looking at and select ‘View Page Info’. A dialogue window will then open. Choose the security tab from the top of the window and then choose ‘View Cookies’. You are then able to remove any cookies you wish from your machine. To prevent cookies from being set on your machine, chose ‘Menu->Options’. A dialogue window will open. Choose ‘Privacy’ from the tabs at the top and choose the checkbox that says ‘Do not allow sites to track’."
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
                  primary="Mircosoft Edge"
                  secondary="To prevent a current page from tracking choose ‘Tools -> Safety -> Tracking Protection’ from here you can set your preferences for analytics tracking. Choose ‘Tools -> Internet Options -> Privacy’ From here you can set your preferences for the types of cookies that you will accept and from where."
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
                  primary="Safari "
                  secondary="To prevent tracking if you are using Safari choose ‘Tools -> Preferences -> Security’ and then choose your preferences from the ‘Accept Cookies’ section."
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
                  primary="Chrome"
                  secondary="To manage your cookie options in Google Chrome choose ‘Tools -> Settings -> Advanced Options -> Privacy -> Content Settings’. Then choose the options that you would like for cookies on your machine and then select ‘Ok’ to save."
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
              9. Data Security
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We implement appropriate technical and organizational measures to protect your personal data
              against unauthorized access, alteration, disclosure, or destruction. However, since the internet
              is not a 100% secure environment, we cannot ensure or warrant the security of any information
              you transmit to us. There is no guarantee that information may not be accessed, disclosed,
              altered, or destroyed by breach of any of our physical, technical, or managerial safeguards.
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
              10. Data Retention
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We retain your personal data only as long as necessary to fulfill the purposes outlined in this
              Privacy Policy or as required by law.
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
              11. Your Rights
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              Depending on applicable laws, you may have the right to:
            </Typography>

            <List sx={{ pl: 2, fontFamily: fonts.poppins, fontSize: { xs: "12px", sm: "16px", md: "18px" } }}>
              <ListItem>
                <ListItemText
                  primary="Access"
                  secondary="Request a copy of the personal data we hold about you."
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
                  primary="Rectification"
                  secondary="Request correction of inaccurate or incomplete data."
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
                  primary="Deletion"
                  secondary="Request deletion of your personal data, subject to legal constraints."
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
                  primary="Objection"
                  secondary=" Object to the processing of your data under certain circumstances."
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
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              To exercise these rights, please contact us at admin@careerexplorer.me.
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
              12. Your obligations
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              As a Website or Platform User, you have certain obligations to other Website or Platform Users.
              Some of these obligations are imposed by applicable law and regulations, and others have become
              commonplace in user-friendly communities of like-minded members such as CareerExplorer.me:
              <br /> <br />
              a) You must, at all times, abide by the terms and conditions of the then-current Privacy Policy
              and Terms of Use. This includes respecting all intellectual property rights that may belong to
              third parties (such as trademarks or photographs). <br /> <br /> b) You must not download or
              otherwise disseminate any information that may be deemed to be injurious, violent, offensive,
              racist or xenophobic, or which may otherwise violate the purpose and spirit of CareerExplorer.me
              and its community.  Any violation of these guidelines may lead to the restriction, suspension or
              termination of your account at our sole discretion. <br /> <br /> c) You must not provide to
              Liberty Insights FZC and/or other Website and/or Platform Users information that you believe
              might be injurious or detrimental to your person or to your professional or social status.{" "}
              <br /> <br /> d) You must keep your password confidential and not share it with others.
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
              13. Children's Privacy
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              Our services are intended for users aged 16 and above. We do not knowingly collect personal data
              from children under 16 without verifiable parental consent.
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
              14. Changes to This Privacy Policy
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on our Website.
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
              15. Contact Us
            </Typography>

            <Typography
              sx={{
                textAlign: "justify",
                fontFamily: fonts.poppins,
                padding: "10px 10px",
                fontSize: { xs: "12px", sm: "16px", md: "18px" },
              }}
            >
              If you have any questions or concerns about this Privacy Policy, please contact us at: <br />{" "}
              <strong>Postal Address:</strong> Liberty Insights FZC, PO Box 473800, Dubai, UAE. <br />
              <strong> Email Address:</strong> admin@careerexpolorer.me
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default PrivacyAndPolicy;
