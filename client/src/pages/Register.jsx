import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ORIGIN_URL } from '../config/config';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleImageUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${ORIGIN_URL}/api/v1/users/register`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('User created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setImage(null);
      setImagePreview('');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleCreateUser}
        className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">Create New User</h2>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full input input-bordered"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full input input-bordered"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full input input-bordered"
          required
        />

        <button
          type="button"
          onClick={handleImageUploadClick}
          className="w-full btn btn-secondary"
        >
          Upload Image
        </button>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="object-cover w-32 h-32 mx-auto rounded-full"
            />
          </div>
        )}

        <button type="submit" className="w-full btn btn-primary">
          Create User
        </button>
      </form>
    </div>
  );
};

export default Register;
