import React from 'react';
import { NavLink } from 'react-router-dom';
import { TbHomeStats, TbListDetails, TbYoga } from "react-icons/tb";

const navItems = [
  { to: '/', icon: <TbHomeStats  size={20} />, label: 'Dashboard' },
  { to: '/exercises', icon: <TbYoga size={20} />, label: 'Exercises' },
  { to: '/workouts', icon: <TbListDetails size={20} />, label: 'Workouts' }
];

const Sidebar: React.FC = () => {
  return (
    <aside className="h-screen w-[64px] bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-700 ${
              isActive ? 'bg-blue-600' : ''
            }`
          }
          title={label}
        >
          {icon}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
