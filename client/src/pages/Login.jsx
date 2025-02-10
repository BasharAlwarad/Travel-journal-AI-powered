import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ORIGIN_URL } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${ORIGIN_URL}/api/v1/users/check-session`,
          {
            withCredentials: true,
          }
        );

        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${ORIGIN_URL}/api/v1/users/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setMessage('Login successful!');
      navigate('/posts'); // Navigate to /posts on successful login
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${ORIGIN_URL}/api/v1/users/logout`,
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
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">
              Welcome, {user.name}!
            </h2>
            <button onClick={handleLogout} className="w-full btn btn-primary">
              Logout
            </button>
            {message && (
              <div className="mt-4 shadow-lg alert alert-success">
                <span>{message}</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Login</h2>

            {message && (
              <div className="shadow-lg alert alert-error">
                <span>{message}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full input input-bordered"
                required
              />
            </div>

            <button type="submit" className="w-full btn btn-primary">
              Login
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">
                Do not have an account?
              </span>
              <button
                onClick={() => navigate('/register')}
                className="ml-2 text-blue-500 hover:underline"
              >
                Register
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
