import React from "react";
import ClassItem from "./ClassItem";

const ClassList = ({ classes = [], loading }) => {
  const skeletons = new Array(4).fill(null); // 2 hàng 2 cột

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {(loading ? skeletons : classes).map((classData, index) => (
        <ClassItem
          key={index}
          name={loading ? "" : classData.class_name}
          author={loading ? "" : classData.User.username}
          member={loading ? 0 : classData.studentCount}
          classId={loading ? "" : classData.class_id}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default ClassList;
