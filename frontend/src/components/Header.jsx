import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../Styles/Header.css';

const Header = () => {
  const { loginWithRedirect, user, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();

  const fetchUserData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <header className="header border-b border-white mb-3">
      <div className="header-title cursor-pointer" onClick={() => window.location.href = '/index'}>Otvoreno računarstvo</div>
      {isAuthenticated ? (
        <>
          <button className="header-login-btn bg-transparent" onClick={fetchUserData}>Fetch User Data</button>
          <button className="header-login-btn bg-transparent" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
        </>
      ) : (
        <button className="header-login-btn bg-transparent" onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </header>
  );
};

export default Header;