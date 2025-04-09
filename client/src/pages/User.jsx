import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ORIGIN_URL } from '../config';

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ORIGIN_URL}/api/v1/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${ORIGIN_URL}/api/v1/users/${id}`, formData, {
        withCredentials: true,
      });
      alert('User updated!');
      setShowForm(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${ORIGIN_URL}/api/v1/users/${id}`, {
          withCredentials: true,
        });
        alert('User deleted!');
        navigate('/users');
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  if (!user) return <div className="mt-10 text-center">Loading user...</div>;

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-base-100 shadow-lg rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-center">User Profile</h2>
      <div className="flex flex-col items-center space-y-2">
        <img
          src={user.image}
          alt={user.name}
          className="w-24 h-24 rounded-full"
        />
        <p className="text-xl font-semibold">{user.name}</p>
        <p>{user.email}</p>
        <p className="text-sm text-gray-500">{user.role}</p>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-info">
          {showForm ? 'Cancel' : 'Update User'}
        </button>
        <button onClick={handleDelete} className="btn btn-error">
          Delete User
        </button>
      </div>

      {showForm && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-medium">Update Form</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Role"
              className="input input-bordered"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default User;
