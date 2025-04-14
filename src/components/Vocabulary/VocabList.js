import React from "react";
import VocabItem from "./VocabItem";
import { FaDatabase, FaCloud, FaMobileAlt } from "react-icons/fa";

const vocabData = [
  {
    titleJP: "データベース",
    titleVN: "Cơ sở dữ liệu",
    description: "Lưu trữ và quản lý dữ liệu có cấu trúc.",
    icon: <FaDatabase className="text-green-600 size-9" />,
  },
  {
    titleJP: "クラウド",
    titleVN: "Điện toán đám mây",
    description: "Dịch vụ lưu trữ và tính toán từ xa.",
    icon: <FaCloud className="text-blue-600 size-9" />,
  },
  {
    titleJP: "モバイルアプリ",
    titleVN: "Ứng dụng di động",
    description: "Phát triển ứng dụng trên thiết bị di động.",
    icon: <FaMobileAlt className="text-purple-600 size-9" />,
  },
  {
    titleJP: "モバイルアプリ",
    titleVN: "Ứng dụng di động",
    description: "Phát triển ứng dụng trên thiết bị di động.",
    icon: <FaMobileAlt className="text-orange-600 size-9" />,
  },
];

const VocabList = () => {
  return (
    <div className="rounded-lg">
      <div className="flex flex-col gap-6">
        {vocabData.map((item, index) => (
          <VocabItem key={index} titleJP={item.titleJP} titleVN={item.titleVN} icon={item.icon} description={item.description}/>
        ))}
      </div>
    </div>
  );
};

export default VocabList;
