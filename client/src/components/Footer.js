import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <span>© {new Date().getFullYear()} YelpCamp. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
