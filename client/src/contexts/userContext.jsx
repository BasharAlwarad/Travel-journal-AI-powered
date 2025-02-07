import { useContext, createContext, useState } from 'react';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    setLoading(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, users, setUsers, loading, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(UserContext);
};

// import { useContext, createContext, useReducer } from 'react';
// import { usersReducer } from '@/reducers';

// const UserContext = createContext();

// const usersReducer = (action, state) => {
//   switch (action.type) {
//     case 'LOADING':
//       return { ...state, loading: true };
//     case 'LOGIN':
//       return { ...state, loading: false, user: action.payload };
//     case 'SET_USERS':
//       return action.payload;
//     default:
//       return state;
//   }
// };

// export default usersReducer;

// export const AuthProvider = ({ children }) => {
//   const initialState = {
//     loading: false,
//     user: {},
//   };

//   const [{ loading, user }, dispatch] = useReducer(usersReducer, initialState);

//   return (
//     <UserContext.Provider value={{ user, loading, dispatch }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useAuthContext = () => {
//   return useContext(UserContext);
// };
