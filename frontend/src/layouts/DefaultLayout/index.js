import { Outlet } from 'react-router-dom';
import LeftSideBar from '../LeftSideBar';
import { useState } from 'react';

function DefaultLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-auto scrollbar-hide">
            {/* Left Sidebar */}
            <div className={`${isCollapsed ? "w-20" : "w-64"} h-full sticky top-0 transition-all duration-300`}>
                <LeftSideBar onToggle={setIsCollapsed} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col transition-all duration-300">
                <Outlet />
            </div>
        </div>
    );
}

export default DefaultLayout;
