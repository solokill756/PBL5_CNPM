import { NavLink, useParams } from "react-router-dom";

const tabs = [
  { label: "Học phần", to: "library" }, 
  { label: "Lớp học", to: "classes" },
  { label: "Từ vựng", to: "savedVocabulary" },
];

function OptionItem() {
  const { username } = useParams();

  return (
    <div className="flex border-gray-200 space-x-10 ">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={`/${tab.to}`}
          end={tab.to === ""}
          className={({ isActive }) =>
            `text-sm font-semibold pb-2 -mb-[2px] ${
              isActive
                ? "border-b-2 border-b-red-800 text-gray-800 "
                :  "text-gray-600 hover:text-red-700 border-transparent hover:border-b-red-800"
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
