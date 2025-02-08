import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import UserProfile from '../components/UserProfile';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    image: '',
  });

  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const URL = import.meta.env.VITE_ORIGINAL_URL;

  // Check if user is logged in based on JWT in cookies
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${URL}/api/v1/users/check-session`, {
          withCredentials: true,
        });
        setUser(response.data.authenticated ? response.data.user : null);
      } catch (error) {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${URL}/api/v1/users/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${URL}/api/v1/users/register`,
        { ...formData },
        { withCredentials: true }
      );
      setMessage('User registered successfully! Please log in.');
      setIsRegistering(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      setMessage('Logout successful!');
    } catch (error) {
      setMessage('Logout failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {user ? (
          <UserProfile user={user} onLogout={handleLogout} message={message} />
        ) : (
          <AuthForm
            isRegistering={isRegistering}
            formData={formData}
            setFormData={setFormData}
            onSubmit={isRegistering ? handleRegister : handleLogin}
            toggleForm={() => setIsRegistering(!isRegistering)}
            message={message}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
