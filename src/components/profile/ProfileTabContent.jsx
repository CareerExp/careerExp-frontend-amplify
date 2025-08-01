import PersonalInfoForm from "./PersonalInfoForm";
import PasswordForm from "./PasswordForm";
import SocialAccountsForm from "./SocialAccountsForm";
import EducationForm from "./EducationForm";
import InterestsTab from "./InterestsTab";

const ProfileTabContent = ({
  tabValue,
  formData,
  handleInputChange,
  handleSubmit,
  isButtonLoading,
  isButtonLoading2,
  showPassword,
  togglePasswordVisibility,
  userData,
}) => {
  switch (tabValue) {
    case 0:
      return (
        <PersonalInfoForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isButtonLoading2={isButtonLoading2}
          userData={userData}
        />
      );
    case 1:
      return (
        <PasswordForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isButtonLoading={isButtonLoading}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      );
    // case 2:
    //   return (
    //     <InterestsTab isButtonLoading={isButtonLoading} userData={userData} />
    //   );
    case 2:
      return (
        <SocialAccountsForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isButtonLoading={isButtonLoading}
        />
      );
    case 3:
      return (
        <EducationForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isButtonLoading={isButtonLoading}
        />
      );
    default:
      return null;
  }
};

export default ProfileTabContent;
