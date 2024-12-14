import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
// Create a root element and render the app into it
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Measure performance in your app, if needed
reportWebVitals();
