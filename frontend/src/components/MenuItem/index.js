import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuItem = ({ icon, title, path, textSize = 'text-base', height }) => {
    const location = useLocation(); 
    const isActive = location.pathname === path; 

    return (
        <Link
            className={
                `flex items-center ${textSize} ${height} gap-4 my-2 p-3 rounded-md cursor-pointer hover:bg-slate-200`
            }
            to={path || '#'}
        >
            <div className={`${isActive ? 'text-red-900' : 'text-gray-600'}`}>
                {icon}
            </div>
            <span className={`font-semibold transition-all duration-300 ${isActive ? ' text-red-900' : 'text-gray-600'}`}>
                {title}
            </span>
        </Link>
    );
};

export default MenuItem;
