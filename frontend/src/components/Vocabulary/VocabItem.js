import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const VocabItem = ({ imgUrl, path, name, description, onError, loading = false }) => {
  return (
    <Link
      to={path}
      className={`flex items-center rounded-2xl p-4 w-full shadow-sm transition-all cursor-pointer
        hover:shadow-md hover:bg-red-50 hover:-translate-y-1`}
      style={{ minHeight: 80 }}
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        {loading ? (
          <Skeleton height={56} width={56} borderRadius={12} />
        ) : (
          <img
            onError={onError}
            src={imgUrl}
            alt="Img"
            className="object-cover w-14 h-14 rounded-xl"
          />
        )}
      </div>

      <div className="ml-5 flex-1 min-w-0">
        {loading ? (
          <>
            <Skeleton height={22} width="70%" />
            <Skeleton height={15} width="90%" style={{ marginTop: 8 }} />
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800 truncate max-w-[200px]">{name}</h3>
            <p className="text-base text-gray-600 truncate max-w-[200px] mt-1">{description}</p>
          </>
        )}
      </div>
    </Link>
  );
};

export default VocabItem;