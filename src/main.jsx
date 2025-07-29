import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import CssBaseline from "@mui/material/CssBaseline";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CssBaseline />
    <BrowserRouter>
      <ThemeProvider theme={createTheme()}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
);

// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App.jsx";
// import { store } from "./redux/store.js";
// import CssBaseline from "@mui/material/CssBaseline";
// import "./index.css"; // Add global CSS import if you have one

// // Create a custom theme with proper style injection priority
// const theme = createTheme({
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: `
//         /* Global styles here that should persist across page reloads */
//         body {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//         }
//       `,
//     },
//   },
// });

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//     <CssBaseline />
//     <BrowserRouter>
//       <ThemeProvider theme={theme}>
//         <App />
//       </ThemeProvider>
//     </BrowserRouter>
//   </Provider>,
// );
