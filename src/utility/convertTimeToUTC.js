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

/** dd/mm/yyyy (local calendar) — explore, dashboards, lists */
function formatDateDDMMYYYY(utcDate) {
  if (!utcDate) return "";
  const d = new Date(utcDate);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Same as formatDateDDMMYYYY (detail pages, articles) */
function formatArticleDetailDate(utcDate) {
  return formatDateDDMMYYYY(utcDate);
}

/** Same as formatDateDDMMYYYY (cards; name kept for existing imports) */
function formatDateMMDDYYYY(utcDate) {
  return formatDateDDMMYYYY(utcDate);
}

export {
  convertToUTC,
  convertUTCDateToLocalDate,
  convertUTCtoMonthAndYear,
  formatDateDDMMYYYY,
  formatArticleDetailDate,
  formatDateMMDDYYYY,
};
