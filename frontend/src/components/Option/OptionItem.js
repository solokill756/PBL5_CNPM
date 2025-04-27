import { NavLink, useParams } from "react-router-dom";

const tabs = [
  { label: "Học phần", to: "" }, 
  { label: "Thư mục", to: "folders" },
  { label: "Lớp học", to: "classes" },
];

function OptionItem() {
  const { username } = useParams();

  return (
    <div className="flex border-b-2 border-gray-200 space-x-10 ">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={`/user/${username}/${tab.to}`}
          end={tab.to === ""}
          className={({ isActive }) =>
            `text-sm font-semibold pb-2 border-2 -mb-[2px] ${
              isActive
                ? "border-b-2 border-red-700 text-gray-800 "
                : "text-gray-600 hover:text-red-700 hover:border-b-2 border-transparent hover:border-b-red-800 "
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default OptionItem;
