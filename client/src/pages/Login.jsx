import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Check if user is logged in based on JWT in cookies
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/check-session`,
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
        `http://localhost:8080/api/v1/users/login`,
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

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AuthForm from '../components/AuthForm';
// import UserProfile from '../components/UserProfile';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     image: '',
//   });

//   const [message, setMessage] = useState('');
//   const [user, setUser] = useState(null);
//   const [isRegistering, setIsRegistering] = useState(false);
//   const URL = import.meta.env.VITE_ORIGINAL_URL;

//   // Check if user is logged in based on JWT in cookies
//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const response = await axios.get(`${URL}/api/v1/users/check-session`, {
//           withCredentials: true,
//         });
//         setUser(response.data.authenticated ? response.data.user : null);
//       } catch (error) {
//         setUser(null);
//       }
//     };
//     checkSession();
//   }, []);

//   // Handle Login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `${URL}/api/v1/users/login`,
//         { email: formData.email, password: formData.password },
//         { withCredentials: true }
//       );
//       setUser(response.data.user);
//       setMessage('Login successful!');
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Login failed');
//     }
//   };

//   // Handle Registration
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `${URL}/api/v1/users/register`,
//         { ...formData },
//         { withCredentials: true }
//       );
//       setMessage('User registered successfully! Please log in.');
//       setIsRegistering(false);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   // Handle Logout
//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         `${URL}/api/v1/users/logout`,
//         {},
//         { withCredentials: true }
//       );
//       setUser(null);
//       setMessage('Logout successful!');
//     } catch (error) {
//       setMessage('Logout failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
//         {user ? (
//           <UserProfile user={user} onLogout={handleLogout} message={message} />
//         ) : (
//           <AuthForm
//             isRegistering={isRegistering}
//             formData={formData}
//             setFormData={setFormData}
//             onSubmit={isRegistering ? handleRegister : handleLogin}
//             toggleForm={() => setIsRegistering(!isRegistering)}
//             message={message}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;
