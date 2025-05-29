import React from 'react';
import { motion } from 'framer-motion';
import { BsChevronDown } from 'react-icons/bs';

const topics = [
  { id: 'network', name: 'Mạng máy tính' },
  { id: 'database', name: 'Cơ sở dữ liệu' },
  { id: 'programming', name: 'Lập trình' },
  { id: 'cloud', name: 'Điện toán đám mây' },
  { id: 'ai', name: 'AI và Big Data' }
];

const TopicSelect = ({ selectedTopic, onSelectTopic }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const selectedTopicName = topics.find(t => t.id === selectedTopic)?.name || 'Chọn chủ đề';
  
  return (
    <div className="mb-6 relative">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Chọn chủ đề:</h3>
      
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border-2 border-gray-200 rounded-lg flex justify-between items-center cursor-pointer bg-white hover:border-indigo-300"
      >
        <span className="font-medium text-gray-800">{selectedTopicName}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <BsChevronDown />
        </motion.div>
      </motion.div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10 overflow-hidden"
        >
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => {
                onSelectTopic(topic.id);
                setIsOpen(false);
              }}
              className={`
                p-3 cursor-pointer hover:bg-indigo-50 transition-colors
                ${selectedTopic === topic.id ? 'bg-indigo-100 font-medium text-indigo-800' : 'text-gray-700'}
              `}
            >
              {topic.name}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TopicSelect;