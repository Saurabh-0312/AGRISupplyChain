import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetRole() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const role = localStorage.getItem('selectedRole') || 'consumer';
      user.update({ publicMetadata: { role } }).then(() => {
        navigate('/');
      });
    }
  }, [user, navigate]);

  return <p className="text-center mt-10">Setting up your account...</p>;
}
