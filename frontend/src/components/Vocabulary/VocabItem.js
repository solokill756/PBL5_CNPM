import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const VocabItem = ({ imgUrl, name, description, onError, loading = false }) => {
  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 w-full hover:bg-slate-100 hover:shadow-lg transition-all cursor-pointer">
      <div className="p-1 border rounded-lg">
        {loading ? (
          <Skeleton height={48} width={48} borderRadius={8} />
        ) : (
          <img
            onError={onError}
            src={imgUrl}
            alt="Img"
            className="size-12 rounded-md"
          />
        )}
      </div>

      <div className="ml-4 flex-1">
        {loading ? (
          <>
            <Skeleton height={20} width="60%" />
            <Skeleton height={14} width="80%" style={{ marginTop: 6 }} />
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VocabItem;
