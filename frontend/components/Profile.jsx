import React from 'react'
import {useUser} from "@auth0/nextjs-auth0/client";

const Profile = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return <div>Please log in to view your profile.</div>;


  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-black border border-purple-600 rounded-lg overflow-hidden shadow-lg p-6">
        <div className="text-center">
          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-600 mb-4">{user.email}</p>
        </div>
        <div className="border-t pt-4 border-purple-600">
          <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
          <ul className="space-y-2">
            <li><strong>Nickname:</strong> {user.nickname}</li>
            <li><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</li>
            <li><strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleDateString()}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Profile