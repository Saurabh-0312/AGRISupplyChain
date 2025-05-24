import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

const roles = ['farmer', 'inspector', 'owner', 'consumer'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { signIn } = useSignIn();

  const handleRoleClick = async (role) => {
    localStorage.setItem('selectedRole', role); // Temporary save before sign-in
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 text-center p-6">
      <img src="/farm-logo.png" alt="Logo" className="w-24 h-24 mb-6 rounded-full border" />
      <h1 className="text-4xl font-bold mb-2 text-gray-800">Welcome to Farm Direct</h1>
      <p className="mb-8 text-gray-600">Choose your role to continue</p>
      <div className="grid grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleClick(role)}
            className="px-6 py-3 bg-white rounded-xl shadow-md hover:bg-green-200 transition"
          >
            Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
