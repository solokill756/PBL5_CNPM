import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import { ReactComponent as ReelsIcon } from '../../assets/icons/reels.svg';
import { ReactComponent as ExploreIcon } from '../../assets/icons/explore.svg';
import { ReactComponent as DirectIcon } from '../../assets/icons/direct.svg';
import { ReactComponent as NewIcon } from '../../assets/icons/new.svg';
import { ReactComponent as NoticeIcon } from '../../assets/icons/notice.svg';
import { ReactComponent as MoreIcon } from '../../assets/icons/more.svg';
import { ReactComponent as LogoText } from '../../assets/icons/logotext.svg';
import MenuItem from '../../components/MenuItem';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

function LeftSideBar() {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    const menuItems = [
        { id: 'home', title: 'Trang chủ', icon: <HomeIcon />, path: '/' },
        {
            id: 'search',
            title: 'Tìm kiếm',
            icon: <SearchIcon />,
            onClick: () => alert('Search clicked'),
        },
        {
            id: 'explore',
            title: 'Khám phá',
            icon: <ExploreIcon />,
            path: '/explore',
        },
        { id: 'reels', title: 'Reels', icon: <ReelsIcon />, path: '/reels' },
        {
            id: 'direct',
            title: 'Tin nhắn',
            icon: <DirectIcon />,
            path: '/direct',
        },
        {
            id: 'notice',
            title: 'Thông báo',
            icon: <NoticeIcon />,
            onClick: () => alert('Search clicked'),
        },
        {
            id: 'new',
            title: 'Tạo',
            icon: <NewIcon />,
            onClick: () => alert('Search clicked'),
        },
        {
            id: 'profile',
            title: 'Trang cá nhân',
            icon: <img alt="" />,
            path: '/profile',
        },
        { id: 'more', title: 'Xem thêm', icon: <MoreIcon /> },
    ];

    return (
        <div className="left-sidebar w-full p-4 border-r">
            <div className="my-8 px-2">
                <LogoText />
            </div>
            {menuItems.map((item) => (
                <MenuItem
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    status={activeMenu === item.id}
                    path={item.path}
                    onClick={() => setActiveMenu(item.id)}
                />
            ))}
        </div>
    );
}

export default LeftSideBar;
