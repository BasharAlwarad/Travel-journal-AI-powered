import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../contexts/userContext';
import Themes from './Themes';

const Nav = () => {
  const { user } = useAuthContext();

  const activeLink = ({ isActive }) =>
    isActive ? 'btn btn-ghost text-primary font-bold' : 'btn btn-ghost';
  return (
    <nav className="px-4 navbar bg-base-100">
      <div className="navbar-start">
        <NavLink to="/" className={activeLink}>
          Travel Journal
        </NavLink>
      </div>
      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal">
          <li>
            <NavLink to="/posts" className={activeLink}>
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={activeLink}>
              Users
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <NavLink to="/login" className={activeLink}>
          {user ? 'Logout' : 'Login'}
        </NavLink>
        <Themes />
      </div>
    </nav>
  );
};

export default Nav;
