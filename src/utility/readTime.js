/**
 * Average reading speed in words per minute (English, adult).
 * ~200–250 wpm is common; 200 is a conservative estimate.
 */
const WORDS_PER_MINUTE = 200;

/**
 * Strip HTML tags and decode common entities to get plain text.
 * @param {string} html - HTML string (e.g. from rich text editor)
 * @returns {string} Plain text
 */
function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Count words in a string (split on whitespace, filter empty).
 * @param {string} text
 * @returns {number}
 */
function wordCount(text) {
  if (!text || typeof text !== "string") return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate read time in minutes from HTML or plain text.
 * @param {string} content - HTML or plain text (e.g. article content)
 * @param {number} [wpm] - Words per minute (default 200)
 * @returns {number} Estimated minutes (minimum 1)
 */
export function getReadTimeMinutes(content, wpm = WORDS_PER_MINUTE) {
  const text = stripHtml(content);
  const words = wordCount(text);
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return minutes;
}

/**
 * Format read time for display (e.g. "5 min read", "1 min read").
 * @param {string} content - HTML or plain text
 * @param {number} [wpm] - Words per minute (default 200)
 * @returns {string}
 */
export function formatReadTime(content, wpm = WORDS_PER_MINUTE) {
  const minutes = getReadTimeMinutes(content, wpm);
  return `${minutes} min read`;
}
