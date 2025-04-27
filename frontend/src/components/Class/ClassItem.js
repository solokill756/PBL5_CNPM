import React from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ClassItem = ({ name, author, member, loading = false }) => {
  return (
    <div className="flex w-full rounded-lg p-3 space-x-2 cursor-pointer hover:bg-slate-100">
      <div className="p-3 border rounded-lg bg-red-100">
        <HiMiniUserGroup className="size-6 text-red-500" />
      </div>

      <div className="flex-1 flex flex-col text-md justify-center overflow-hidden">
        <span className="max-w-full text-gray-800 font-medium block overflow-hidden text-ellipsis whitespace-nowrap">
          {loading ? <Skeleton width={160} /> : name}
        </span>
        <div className="text-gray-500 font-medium space-x-4">
          {loading ? (
            <>
              <Skeleton width={80} inline />
              <Skeleton width={60} inline />
            </>
          ) : (
            <>
              <span>{author}</span>
              <span>{member} thành viên</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassItem;
