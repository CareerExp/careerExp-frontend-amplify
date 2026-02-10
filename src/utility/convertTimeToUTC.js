const convertToUTC = (dateTime) => {
  const dateUTC = new Date(dateTime).toUTCString();
  return dateUTC;
};

// yyyy-mm-dd
function convertUTCDateToLocalDate(utcDate) {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero indexed
  const year = date.getUTCFullYear();

  // Format the date as yyyy-mm-dd
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;

  return formattedDate;
}

function convertUTCtoMonthAndYear(utcDate) {
  // const dateString = "2024-04-22T09:03:42.875Z";
  const dateObj = new Date(utcDate);
  const formattedDate = dateObj.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return formattedDate;
}

/** Format as dd/mm/yyyy for articles table (Figma) */
function formatDateDDMMYYYY(utcDate) {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
}

/** Format as "Jan 18, 2026" for article detail page */
function formatArticleDetailDate(utcDate) {
  if (!utcDate) return "";
  return new Date(utcDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export {
  convertToUTC,
  convertUTCDateToLocalDate,
  convertUTCtoMonthAndYear,
  formatDateDDMMYYYY,
  formatArticleDetailDate,
};
