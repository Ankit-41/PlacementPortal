// src/components/ToggleSwitch.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ToggleSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="flex items-center">
      {/* Sun Icon */}
      <Sun className={`h-5 w-5 text-yellow-400 ${theme === 'light' ? 'block' : 'hidden'}`} />
      
      {/* Toggle Switch */}
      <label htmlFor="toggle" className="inline-flex relative items-center cursor-pointer mx-2">
        <input
          type="checkbox"
          id="toggle"
          className="sr-only peer"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 relative transition-colors duration-300"></div>
        <div
          className={`absolute left-1 top-1 bg-white dark:bg-gray-900 w-4 h-4 rounded-full transition-transform duration-300 ${
            theme === 'dark' ? 'transform translate-x-full' : ''
          }`}
        ></div>
      </label>
      
      {/* Moon Icon */}
      <Moon className={`h-5 w-5 text-blue-400 ${theme === 'dark' ? 'block' : 'hidden'}`} />
    </div>
  );
};

export default ToggleSwitch;
