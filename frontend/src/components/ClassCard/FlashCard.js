import React from 'react';

const FlashCard = ({ 
  vocabulary, 
  author, 
  avatar, 
  lesson, 
  listId, 
  onAddFlashcard, 
  showAddButton = false,
  addedFlashcards = new Set(),
  isAdding = false 
}) => {
  const isAdded = addedFlashcards.has(listId);

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddFlashcard && !isAdded) {
      onAddFlashcard(listId);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={author} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                {author?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg mb-1">
              {lesson}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{vocabulary} từ vựng</span>
              <span>•</span>
              <span>Tác giả: {author}</span>
            </div>
          </div>
        </div>

        {/* Add Button */}
        {showAddButton && (
          <button
            onClick={handleAddClick}
            disabled={isAdded || isAdding}
            className={`
              px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 flex-shrink-0
              ${isAdded 
                ? 'bg-green-100 text-green-800 cursor-default' 
                : 'bg-red-700 hover:bg-red-800 text-white hover:shadow-md'
              }
              ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isAdding ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang thêm...
              </div>
            ) : isAdded ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Đã thêm
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FlashCard;