import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// import { ThemeProvider } from "../src/pages/Context/ThemeContext.jsx"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ThemeProvider> */}
        <App />
    {/* </ThemeProvider>, */}
  </StrictMode>,
);
