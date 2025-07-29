export const splitTextIntoPages = (text, maxCharsPerPage) => {
  const words = text.split(" ");
  const pages = [];
  let currentPage = "";

  for (const word of words) {
    if ((currentPage + word).length <= maxCharsPerPage) {
      currentPage += `${word} `;
    } else {
      pages.push(currentPage.trim());
      currentPage = `${word} `;
    }
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages;
};
