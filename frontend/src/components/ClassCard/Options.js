import { NavLink, useParams } from "react-router-dom";

const tabs = [
  { label: "Tài liệu học", to: "" }, 
  { label: "Thành viên", to: "/members" },
];

function Options() {
  const { classId } = useParams(); 

  return (
    <div className="flex border-gray-200 space-x-10">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to || "main"}
          to={`/classes/${classId}${tab.to}`}
          end={tab.to === ""}
          className={({ isActive }) =>
            `text-sm font-semibold pb-2 -mb-[2px] ${
              isActive
                ? "border-b-2 border-b-red-800 text-gray-800"
                : "text-gray-600 hover:text-red-700 border-transparent hover:border-b-red-800"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default Options;