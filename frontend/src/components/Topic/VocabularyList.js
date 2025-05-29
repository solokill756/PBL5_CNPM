import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { IoSchool } from 'react-icons/io5';
import VocabularyItem from './VocabularyItem';

const VocabularyList = ({ 
  vocabularies, 
  selectedVocabulary, 
  onSelectVocabulary, 
  onToggleBookmark,
  onMarkLearned
}) => {
  return (
    <div className="bg-white rounded-lg h-full shadow-sm border border-gray-200 p-4 sticky top-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-800">
        <IoSchool className="w-5 h-5" />
        Danh sách từ vựng ({vocabularies.length})
      </h2>
      <div className="space-y-3 overflow-y-auto overflow-x-hidden h-full max-h-[calc(100vh-170px)] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {vocabularies.map((vocab, index) => (
            <VocabularyItem
              key={vocab.vocab_id}
              vocabulary={vocab}
              isSelected={selectedVocabulary?.vocab_id === vocab.vocab_id}
              onClick={() => onSelectVocabulary(vocab, index)}
              onToggleBookmark={onToggleBookmark}
              onMarkLearned={onMarkLearned}
              index={index}
              total={vocabularies.length}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VocabularyList;