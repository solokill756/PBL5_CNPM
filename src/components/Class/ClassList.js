import React from "react";
import ClassItem from "./ClassItem";

const ClassList = ({ classes }) => {
  return (
    <div className="flex flex-wrap w-full justify-center gap-4">
      {classes.map((classData, index) => (
        <ClassItem
          key={index}
          name={classData.name}
          author={classData.author}
          member={classData.member}
        />
      ))}
    </div>
  );
};

export default ClassList;
