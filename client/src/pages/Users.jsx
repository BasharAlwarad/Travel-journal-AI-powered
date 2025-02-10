import { useEffect, useState } from 'react';
import axios from 'axios';
import { ORIGIN_URL } from '../config';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${ORIGIN_URL}/api/v1/users`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="mt-10 text-center">Loading...</div>;
  if (error)
    return <div className="mt-10 text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center p-4 mt-10">
      <h1 className="mb-8 text-3xl font-bold">User List</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="transition duration-300 shadow-lg card w-80 bg-base-100 hover:shadow-2xl"
          >
            <figure className="px-10 pt-10">
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full"
              />
            </figure>
            <div className="items-center text-center card-body">
              <h2 className="text-lg font-semibold card-title">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
              <div className="mt-4 card-actions">
                <button className="btn btn-primary">View Profile</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
