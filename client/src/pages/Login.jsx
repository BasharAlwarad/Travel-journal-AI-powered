import { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Check if user is logged in based on JWT in cookies
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/session`,
          { withCredentials: true }
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

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/users/login`,
        { email, password },
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
      const response = await axios.post(
        `http://localhost:8080/api/v1/users/register`,
        { name, email, password, image },
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
        `http://localhost:8080/api/v1/users/logout`,
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
          <>
            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-6">
                <h2 className="text-2xl font-semibold text-center">Register</h2>

                {message && (
                  <div className="shadow-lg alert alert-error">
                    <span>{message}</span>
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full input input-bordered"
                    required
                  />
                </div>

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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Profile Image URL</span>
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL"
                    className="w-full input input-bordered"
                  />
                </div>

                <button type="submit" className="w-full btn btn-primary">
                  Register
                </button>
                <p
                  className="mt-2 text-center cursor-pointer text-blue-500"
                  onClick={() => setIsRegistering(false)}
                >
                  Already have an account? Login
                </p>
              </form>
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

                <p
                  className="mt-2 text-center cursor-pointer text-blue-500"
                  onClick={() => setIsRegistering(true)}
                >
                  Do not have an account? Register
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
