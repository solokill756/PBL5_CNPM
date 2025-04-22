import React from "react";
import ClassItem from "./ClassItem";

const ClassList = ({ classes }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {classes.map((classData, index) => (
        <ClassItem
          key={index}
          name={classData.class_name}
          author={classData.User.username}
          member={classData.studentCount}
        />
      ))}
    </div>
  );
};


export default ClassList;
