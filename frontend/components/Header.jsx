'use client'

import React from 'react';
import {useUser} from "@auth0/nextjs-auth0/client";
import '@/Styles/Header.css';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const {user, error, isLoading} = useUser();

  const handleRefresh = async () => {
    try {
      const res = await axios.get('http://localhost:10000/refresh-data', {
        headers: {
          'user': user
        }
      });
      toast.success('Data refreshed successfully!');
      console.log(res.data);
    } catch (e) {
      toast.error('Failed to refresh data.');
      console.error(e);
    }
  }

  return (
    <>
      <header className="header border-b border-white mb-3">
        <div className="header-title cursor-pointer" onClick={() => window.location.href = '/index'}>
          Otvoreno računarstvo
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : user ? (
          <div className={'gap-5 flex-row flex'}>
            <button
              className="header-logout-btn bg-transparent"
              onClick={() => window.location.href = '/profile'}
            >
              Korisnički profil
            </button>
            <button
              className="header-logout-btn bg-transparent"
              onClick={handleRefresh}
            >
              Osvježi preslike
            </button>
            <button
              className="header-logout-btn bg-transparent"
              onClick={() => window.location.href = '/api/auth/logout'}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            className="header-logout-btn bg-transparent"
            onClick={() => window.location.href = '/api/auth/login'}
          >
            Log In
          </button>
        )}
      </header>
      <ToastContainer position="bottom-right"/>
    </>
  );
};

export default Header;