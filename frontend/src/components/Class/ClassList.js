import React from "react";
import ClassItem from "./ClassItem";

const ClassList = ({ classes }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
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
