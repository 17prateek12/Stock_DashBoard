import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../context/ThemeContext';
import Sun from '../asset/sunny.png';
import Moon from '../asset/night.png';

const ThemeChangeIcon: React.FC = () => {
  const { darkMode, switchDark, switchLight, switchSystem } = useContext(ThemeContext);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSelection = (mode: 'light' | 'dark' | 'system') => {
    if (mode === 'light') {
      switchLight();
    } else if (mode === 'dark') {
      switchDark();
    } else {
      switchSystem();
    }
    setDropdownOpen(false);
  };

  const getCurrentIcon = (): string => {
    if (darkMode === 'light') {
      return Sun;
    } else if (darkMode === 'dark') {
      return Moon;
    } else {
      // System mode: return Sun or Moon based on the system theme
      return systemTheme === 'dark' ? Moon : Sun;
    }
  };

  return (
    <div className="relative">
      <img
        src={getCurrentIcon()}
        alt="Theme Icon"
        className="w-8 h-8 cursor-pointer"
        onClick={handleIconClick}
      />
      {isDropdownOpen && (
        <div className="absolute right-0 sm:-left-24 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleSelection('light')}
          >
            Light
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleSelection('dark')}
          >
            Dark
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => handleSelection('system')}
          >
            System
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeChangeIcon;
