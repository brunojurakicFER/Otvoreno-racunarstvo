import React from 'react';
import '../Styles/Header.css';

const Header = () => {
  return (
    <header className="header border-b border-white mb-3">
      <div className="header-title cursor-pointer" onClick={() => window.location.href = '/index'}>Otvoreno računarstvo</div>
      <button className="header-login-btn bg-transparent">Log In</button>
    </header>
  );
};

export default Header;