import React from "react";
import VocabItem from "./VocabItem";

const VocabList = ({ vocabs }) => {
  return (
    <div className="rounded-lg w-full">
      <div className="flex flex-col gap-6">
        {vocabs.map((item, index) => (
          <VocabItem
            key={index}
            name={item.name}
            description={item.description}
            imgUrl={item.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default VocabList;
