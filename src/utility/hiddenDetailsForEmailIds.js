const HIDDEN_DETAILS_EMAILS = [
  "mrbeast@gmail.com",
  "mohamed@uniserveducation.com",
  "maladwala@me.com",
  "careers.content@yahoo.com",
  "career.clusters@yahoo.com",
  "skills.abilities@yahoo.com",
  "admin@careerexplorer.me",
  "hello@careerexplorer.me",
];

const shouldHideDetails = (email) => {
  return HIDDEN_DETAILS_EMAILS.includes(email);
};

export { shouldHideDetails };
