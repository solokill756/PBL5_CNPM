import { Outlet } from 'react-router-dom';
import LeftSideBar from '../LeftSideBar';

function DefaultLayout() {
    return (
        <div className="flex h-screen">
            {/* Left Sidebar */}
            <div className="w-64 h-full fixed">
                <LeftSideBar />
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 flex flex-col">
                <Outlet />
            </div>
        </div>
    );
}

export default DefaultLayout;
