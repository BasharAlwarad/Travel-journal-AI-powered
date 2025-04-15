import { useEffect, useContext, createContext, useState } from 'react';
import { ORIGIN_URL } from '../config';
import axios from 'axios';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          `${ORIGIN_URL}/api/v1/users/check-session`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
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

  return (
    <UserContext.Provider
      value={{ user, setUser, users, setUsers, loading, setLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(UserContext);
};
