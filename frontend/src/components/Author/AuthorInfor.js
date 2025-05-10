import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function AuthorInfo({
  authorName,
  authorAvatar,
  authorRole,
  authorCreatedAt,
  loading = false,
  className = ""
}) {
  return (
    <div className={`flex items-center w-full max-w-4xl gap-3 px-4 pb-4 ${className}`}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center">
        {loading ? (
          <Skeleton circle width={48} height={48} />
        ) : (
          <img
            src={authorAvatar}
            alt="author avatar"
            className="w-full object-cover rounded-full"
          />
        )}
      </div>
      <div>
        <div className="text-[10px] text-gray-400 leading-none">
          {loading ? <Skeleton width={40} height={10} /> : "Tạo bởi"}
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton width={100} height={16} />
          ) : (
            <>
              <span className="font-semibold text-base text-gray-800">{authorName}</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-lg">
                {authorRole || "Giáo viên"}
              </span>
            </>
          )}
        </div>
        <div className="text-xs text-gray-400 leading-none mt-0.5">
          {loading ? <Skeleton width={80} height={12} /> : `Đã tạo ${authorCreatedAt} trước`}
        </div>
      </div>
    </div>
  );
}
