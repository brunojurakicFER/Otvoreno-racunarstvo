'use client'

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from '@/components/Header';
import Profile from "@/components/Profile";

export default function Page() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div>
      <Header />
      <Profile/>
    </div>
  );
}