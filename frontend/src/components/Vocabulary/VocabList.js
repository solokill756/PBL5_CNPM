import React from "react";
import VocabItem from "./VocabItem";

const VocabList = ({ vocabs = [], loading }) => {
  const skeletons = new Array(4).fill(null); // 5 items loading

  return (
    <div className="rounded-lg w-full">
      <div className="flex flex-col gap-6">
        {(loading ? skeletons : vocabs).map((item, index) => (
          <VocabItem
            key={index}
            path={loading ? "" : `/vocabulary/topic/${item.topic_id}`}
            name={loading ? "" : item.name}
            description={loading ? "" : item.description}
            imgUrl={loading ? "" : item.image_url}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default VocabList;
