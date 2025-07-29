function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function checkPassStrength(pass) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(pass);
}

const isValidMobileNumber = (mobile) => {
  const mobileRegex = /^[0-9]{7,15}$/; // Mobile number should be 7 to 15 digits long
  return mobileRegex.test(mobile);
};

export { isValidEmail, checkPassStrength, isValidMobileNumber };
