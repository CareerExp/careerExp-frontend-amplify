import { config } from "./config/config.js";

// API handler for bakend
function fetchApi(url, options = {}) {
  if (new URL(url, window.origin).origin !== config.api) {
    // Please use regular fetch for outside api.
    throw new Error(`Use regular fetch to make request to '${url}'`);
  }
  if (options.body) {
    options.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }
  options.credentials = options.credentials || "include";
  options.headers = options.headers || {};
  options.headers.Accept = options.headers.Accept || "application/json";
  options.headers["Content-Type"] = options.headers["Content-Type"] || "application/json";
  return fetch(url, options).then(checkStatus).then(parseJSON).catch(logError);
}

function checkStatus(response) {
  if (response.status >= 400 && response.status < 500) {
    return response.json().then((res) => {
      if (response.status === 401) {
        // Create error with additional info
        const error = new Error(res.message || "Your login session has expired. Please login again.");
        error.code = "401";
        error.field = res.field || null;
        error.isSessionExpired = true; // Add this flag
        // Clear user data and redirect
        console.log("error", error);
        localStorage.removeItem("persist:user");
        window.location.href = "/login?sessionExpired=true";
        throw error;
      } else if (response.status === 403) {
        // Handle 403 Forbidden
        alert("You don't have permission to access this page.");
        window.location.href = "/";
        const error = new Error(res.message || "You don't have permission to access this page.");
        error.code = "403";
        error.field = res.field || null;
        error.isUnauthorized = true; // Add this flag
        throw error;
      }
      // Throw the error with additional info
      const error = new Error(res.message || "Request failed");
      error.code = response.status.toString();
      error.field = res.field || null;
      throw error;
    });
  } else if (response.ok) {
    return response;
  } else {
    return response.json().then((parsedResponse) => {
      const error = new Error(parsedResponse.message || response.statusText);
      error.code = response.status.toString();
      error.field = parsedResponse.field || null;
      throw error;
    });
  }
}

function parseJSON(response) {
  if (response && response.headers.get("content-type")?.includes("json")) {
    return response.json();
  }
  return response;
}
function logError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
  throw error;
}
const FetchApi = { fetch: fetchApi };
export default FetchApi;
