import React from 'react';
import CategoryCard from './CategoryCard';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CategoryGrid = ({ categories, loading = false, error = null, userLevel = 1 }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>
    );
  }

  // Sắp xếp chủ đề theo cấp độ yêu cầu
  const sortedCategories = [...categories].sort((a, b) => a.required_level - b.required_level);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {sortedCategories.map((category, index) => (
        <motion.div key={category.topic_id} variants={item}>
          <CategoryCard 
            {...category} 
            loading={loading} 
            index={index} 
            user_level={userLevel}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryGrid;