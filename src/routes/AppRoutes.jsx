// eslint-disable-next-line simple-import-sort/imports
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import InitialLoaders from "../loaders/InitialLoaders";
import { useSelector } from "react-redux";
import { selectAuthenticated } from "../redux/slices/authSlice.js";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Import components lazily
const Register = React.lazy(() => import("../pages/Register"));
const Login = React.lazy(() => import("../pages/Login"));
const ForgetPassword = React.lazy(() => import("../pages/ForgetPassword"));
const CreateNewPassword = React.lazy(() => import("../pages/CreateNewPassword"));
const VerifyEmail = React.lazy(() => import("../pages/EmailVerification.jsx"));

const Layout = React.lazy(() => import("../components/Layout"));
const Home = React.lazy(() => import("../pages/Home"));
const Explore = React.lazy(() => import("../pages/Explore"));
const AssessmentCenter = React.lazy(() => import("../pages/AssessmentCenter"));
const ResumeBuilderPage = React.lazy(() => import("../pages/ResumeBuilder.jsx"));
const HowItWorks = React.lazy(() => import("../pages/HowItWorks.jsx"));
const Pricing = React.lazy(() => import("../pages/Pricing.jsx"));
const Workspace = React.lazy(() => import("../pages/Workspace.jsx"));

const AboutUs = React.lazy(() => import("../pages/AboutUs.jsx"));
const TermsAndConditons = React.lazy(() => import("../pages/TermsAndConditons.jsx"));
const PrivacyAndPolicy = React.lazy(() => import("../pages/PrivacyAndPolicy.jsx"));

const ContactUs = React.lazy(() => import("../components/contactUs/ContactUs.jsx"));
const StudentSupport = React.lazy(() => import("../components/contactUs/StudentSupport.jsx"));
const TechSupport = React.lazy(() => import("../components/contactUs/TechSupport.jsx"));

const InvalidPages = React.lazy(() => import("../pages/InvalidPages"));

const ExploreVideoPlay = React.lazy(() => import("../pages/ExploreVideoPlay"));
const CreatorProfile = React.lazy(() => import("../pages/CreatorProfile.jsx"));

const InterestProfiler = React.lazy(() => import("../components/onet/InterestProfiler.jsx"));
const DiscAssessment = React.lazy(() => import("../pages/DiscAssessment.jsx"));
const SurveyPage = React.lazy(() => import("../pages/SurveyPage.jsx"));

const AssessmentResult = React.lazy(() => import("../pages/AssessmentResult.jsx"));
const AssessmentResult1 = React.lazy(() => import("../pages/AssessmentResult1.jsx"));
const GenerateAssessmentPDF = React.lazy(() => import("../pages/pdfGeneration/AssessmentPdfPage.jsx"));

const PaymentSuccess = React.lazy(() => import("../pages/PaymentSuccessPage.jsx"));
const PaymentCancel = React.lazy(() => import("../pages/PaymentCancelPage.jsx"));

const ResumeDashboardPage = React.lazy(() => import("../components/resumeBuilder/ResumeDashboard.jsx"));
const SelectResumeTemplate = React.lazy(() => import("../components/resumeBuilder/SelectTemplate.jsx"));

const AppRoutes = () => {
  const authenticated = useSelector(selectAuthenticated);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <Layout />
          </Suspense>
        }
      >
        <Route
          path="/"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/explore"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <Explore />
            </Suspense>
          }
        />
        <Route
          path="/assessment"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <AssessmentCenter />
            </Suspense>
          }
        />
        <Route
          path="resume-builder"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <ResumeBuilderPage />
            </Suspense>
          }
        />
        <Route
          path="/resume-dashboard"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <ResumeDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <HowItWorks />
            </Suspense>
          }
        />{" "}
        <Route
          path="/profile/:userId"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <CreatorProfile />
            </Suspense>
          }
        />
        <Route
          path="/pricing"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <Pricing />
            </Suspense>
          }
        />
      </Route>
      \
      <Route
        path="/register"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <Register />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/forget-password"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <ForgetPassword />
          </Suspense>
        }
      />
      <Route
        path="/create-new-password"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <CreateNewPassword />
          </Suspense>
        }
      />
      <Route
        path="/workspace/:id"
        element={
          <Suspense fallback={<InitialLoaders />}>{authenticated ? <Workspace /> : <Login />}</Suspense>
        }
      />
      <Route
        path="/video/:videoId"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <ExploreVideoPlay />
          </Suspense>
        }
      />
      <Route
        path="/interest-profiler"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <InterestProfiler />
          </Suspense>
        }
      />
      <Route
        path="/verify-email"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <VerifyEmail />
          </Suspense>
        }
      />
      {/* Resume Routes  */}
      <Route
        path="/disc"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <DiscAssessment />
          </Suspense>
        }
      />
      <Route
        path="/survey"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <SurveyPage />
          </Suspense>
        }
      />
      {/* About us page  */}
      <Route
        path="/about-us"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <AboutUs />
          </Suspense>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <TermsAndConditons />
          </Suspense>
        }
      />
      <Route
        path="/privacy-and-policy"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <PrivacyAndPolicy />
          </Suspense>
        }
      />
      <Route
        path="/assessment-result"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <AssessmentResult />
          </Suspense>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/assessment-result1"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <AssessmentResult1 />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/contact-us"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <ContactUs />
          </Suspense>
        }
      />
      <Route
        path="/student-support"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <StudentSupport />
          </Suspense>
        }
      />
      <Route
        path="/tech-support"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <TechSupport />
          </Suspense>
        }
      />
      <Route
        path="/payment-successful"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <PaymentSuccess />
          </Suspense>
        }
      />
      <Route
        path="/payment-cancelled"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <PaymentCancel />
          </Suspense>
        }
      />
      <Route
        path="/select-resume-template"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <SelectResumeTemplate />
          </Suspense>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/generate-assessmnet-pdf"
          element={
            <Suspense fallback={<InitialLoaders />}>
              <GenerateAssessmentPDF />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="*"
        element={
          <Suspense fallback={<InitialLoaders />}>
            <InvalidPages />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
