import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as NewIcon } from "../../assets/icons/new.svg";
import { ReactComponent as MoreIcon } from "../../assets/icons/more.svg";
import LogoImg from "@/assets/images/ITKotoba.png";
import MenuItem from "../../components/MenuItem";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineForum, MdOutlineNotificationsActive } from "react-icons/md";
import { LuLibraryBig } from "react-icons/lu";
import { TbLanguageHiragana, TbSwords } from "react-icons/tb";
import { FaLanguage } from "react-icons/fa6";
import CreateModal from "@/components/Modal/CreateModal";

function LeftSideBar({ onToggle }) {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [delayTitle, setDelayTitle] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Delay hiển thị title khi mở sidebar
  useEffect(() => {
    let timer;
    if (!isCollapsed) {
      timer = setTimeout(() => setDelayTitle(true), 120);
    } else {
      setDelayTitle(false);
    }
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(!isCollapsed);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
    setActiveMenu("new");
  };

  const menuItems = [
    { id: "home", title: "Trang chủ", icon: <HomeIcon />, path: "/" },
    { 
      id: "new", 
      title: "Tạo", 
      icon: <NewIcon />, 
      onClick: handleCreateClick 
    },
    { id: "library", title: "Thư viện", icon: <LuLibraryBig className="size-6" />, path: "/library" },
    { id: "vocabulary", title: "Từ vựng", icon: <FaLanguage className="size-6" />, path: "/vocabulary" },
    { id: "battle", title: "Đối kháng", icon: <TbSwords className="size-6" />, path: "/battle" },
    { id: "notification", title: "Thông báo", icon: <MdOutlineNotificationsActive className="size-6" /> },
  ];

  return (
    <>
      <div data-sidebar className={`sticky sidebar h-screen p-4 border-r bg-zinc-50 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
        {/* Nút More */}
        <div className="flex max-h-12 items-center">
          <button onClick={handleToggle} className="p-3 active:bg-red-200 rounded-md hover:bg-red-50 transition">
            <MoreIcon />
          </button>
          {!isCollapsed && (
            <Link to={"#"}>
              <img className="w-32 transition-all duration-300" src={LogoImg} alt="Logo" />
            </Link>
          )}
        </div>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            title={!isCollapsed && delayTitle ? item.title : ""}
            status={activeMenu === item.id}
            path={item.path}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else {
                setActiveMenu(item.id);
              }
            }}
          />
        ))}
      </div>

      {/* Create Modal */}
      <CreateModal
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </>
  );
}

export default LeftSideBar;