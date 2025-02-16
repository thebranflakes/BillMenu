import React from 'react';
import '../css/Logo.css';
import logo from '../assets/bill_logo.png';
import instaIcon from '../assets/insta.png';
import facebookIcon from '../assets/facebook.png';
import urlIcon from '../assets/url.png';

const Logo = () => {
  return (
    <div className="home-container">
      {/* Logo Image */}
      <div className="logo-section">
        <img src={logo} alt="Bill's Bagels" className="logo" />
      </div>
      
      {/* Social Media Row */}
      <div className="social-media-row">
        <div className="social-item">
          <img src={instaIcon} alt="Instagram" className="social-icon" />
          <span>@billydoughboy</span>
        </div>
        <div className="social-item">
          <img src={facebookIcon} alt="Facebook" className="social-icon" />
          <span>billydoughboys</span>
        </div>
        <div className="social-item">
          <img src={urlIcon} alt="Website" className="social-icon" />
          <span>www.billsbagels.com</span>
        </div>
      </div>

      <br></br>

      <div className="additional-info">
        <span>Prices don't include Tax</span>
      </div>

    </div>
  );
};

export default Logo;
