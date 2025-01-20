import React from 'react';
import '../assets/Css/AnimatedLogoLoader.css'; 
import companyLogo from '../assets/Logo/black.png'; 

const AnimatedLogoLoader = () => {
  return (
    <div className="logo-loader-container">
      <img src={companyLogo} alt="Company Logo" className="logo-loader" />
    </div>
  );
};

export default AnimatedLogoLoader;
