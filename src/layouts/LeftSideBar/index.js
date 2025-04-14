import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as DirectIcon } from "../../assets/icons/direct.svg";
import { ReactComponent as NewIcon } from "../../assets/icons/new.svg";
import { ReactComponent as NoticeIcon } from "../../assets/icons/notice.svg";
import { ReactComponent as MoreIcon } from "../../assets/icons/more.svg";
import LogoImg from "@/assets/images/ITKotoba.png";
import MenuItem from "../../components/MenuItem";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PiCardsBold } from "react-icons/pi";
import { MdOutlineForum, MdOutlineNotificationsActive, MdOutlineQuiz } from "react-icons/md";
import { LuLibraryBig } from "react-icons/lu";

function LeftSideBar() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  const menuItems = [
    { id: "home", title: "Trang chủ", icon: <HomeIcon />, path: "/" },
    // {
    //     id: 'search',
    //     title: 'Tìm kiếm',
    //     icon: <SearchIcon />,
    // },
    {
      id: "new",
      title: "Tạo",
      icon: <NewIcon />,
    },
    {
        id: "explore",
        title: "Thư viện",
        icon: <LuLibraryBig className="size-6" />,
        path: "/library",
      },
    // {
    //   id: "explore",
    //   title: "Flashcard",
    //   icon: <PiCardsBold className="size-6" />,
    //   path: "/flashcard",
    // },
    {
      id: "quiz",
      title: "Quiz",
      icon: <MdOutlineQuiz className="size-6" />,
      path: "/quiz",
    },
    {
      id: "direct",
      title: "Diễn đàn",
      icon: <MdOutlineForum className="size-6"/>,
      path: "/forum",
    },
    {
      id: "notice",
      title: "Thông báo",
      icon: <MdOutlineNotificationsActive className="size-6"/>,
    },
    // { id: 'more', title: 'Xem thêm', icon: <MoreIcon /> },
  ];

  return (
    <div className="left-sidebar w-full h-screen p-4 border-r bg-zinc-50">
      <div className="flex items-center">
        <MenuItem icon={<MoreIcon />} />
        <Link to={"#"}>
          <img className="w-32" src={LogoImg} alt="" />
        </Link>
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
