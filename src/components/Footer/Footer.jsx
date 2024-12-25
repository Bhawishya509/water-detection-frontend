import React from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import './Footer.css';

const Footer = () => {
  return (
    <Box className="footer-container">
      <Typography variant="h6" gutterBottom>
        Water Body Detection using Remote Sensing
      </Typography>
      <Typography variant="body2" className="footer-copyright">
        © {new Date().getFullYear()} Remote Sensing Team. All rights reserved.
      </Typography>

      <Divider className="footer-divider" />

      <Box className="footer-links">
        <Link href="#about" underline="none" className="footer-link">
          About Us
        </Link>
        <Link href="#contact" underline="none" className="footer-link">
          Contact
        </Link>
        <Link href="#privacy" underline="none" className="footer-link">
          Privacy Policy
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
