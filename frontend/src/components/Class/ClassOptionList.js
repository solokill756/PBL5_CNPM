import React, { useState } from "react";
import ClassOption from "./ClassOption";

const classOptions = [
    { id: 1, label: "Lớp 1" },
    { id: 2, label: "Lớp 2" },
    { id: 3, label: "Lớp 3" },
    { id: 4, label: "Lớp 4" },
    { id: 5, label: "Lớp 5" },
  ];

const ClassOptionList = ({ onChange, className = "" }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    const newSelectIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectIds);
    if (onChange) onChange(newSelectIds);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {classOptions.map((option) => (
        <ClassOption
          key={option.id}
          id={option.id}
          label={option.label}
          selected={selectedIds.includes(option.id)}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default ClassOptionList;
