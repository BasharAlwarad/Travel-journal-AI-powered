import { useEffect } from 'react';
import { FaMoon, FaSun, FaRobot } from 'react-icons/fa';
import { IoMdNuclear } from 'react-icons/io';
import { GiCircuitry } from 'react-icons/gi';

const Themes = () => {
  const themes = [
    { name: 'myDarkTheme', Icon: FaMoon, color: 'text-black' },
    { name: 'light', Icon: FaSun, color: 'text-pink-500' },
    { name: 'cyberpunk', Icon: FaRobot, color: 'text-yellow-500' },
    { name: 'luxury', Icon: IoMdNuclear, color: 'text-green-500' },
    { name: 'synthwave', Icon: GiCircuitry, color: 'text-blue-500' },
  ];

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const changeTheme = (name) => {
    localStorage.setItem('theme', name);
    document.documentElement.setAttribute('data-theme', name);
  };

  return (
    <details className="dropdown w-[5rem]">
      <summary className="btn">Themes</summary>
      <ul className="w-[5rem] mt-1 menu dropdown-content bg-base-100 rounded-box z-[1] shadow">
        {themes.map(({ name, Icon, color }) => (
          <li key={name} onClick={() => changeTheme(name)}>
            <Icon className={`pr-2 text-5xl ${color}`} />
          </li>
        ))}
      </ul>
    </details>
  );
};

export default Themes;
