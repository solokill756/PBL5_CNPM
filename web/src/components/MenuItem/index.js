import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuItem = ({ icon, title, path }) => {
    const location = useLocation(); 
    const isActive = location.pathname === path; 

    return (
        <Link
            className={
                'flex items-center text-base gap-4 my-2 p-3 rounded-md cursor-pointer hover:bg-slate-200'
            }
            to={path || '#'}
        >
            <div className={`text ${isActive ? 'fill-black' : 'text-gray-700'}`}>
                {icon}
            </div>
            <span className={`${isActive ? 'font-bold' : 'text-gray-700'}`}>
                {title}
            </span>
        </Link>
    );
};

export default MenuItem;
