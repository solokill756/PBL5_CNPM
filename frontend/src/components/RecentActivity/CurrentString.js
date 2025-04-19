import React from 'react'

const CurrentString = ({ title, string }) => {
  const flames = [0, 1, 2, 3, 4];

  return (
    <div className='flex flex-col items-center'>
      <h5 className='text-base font-semibold text-gray-900 dark:text-white mb-3 text-left'>{title}</h5>
      <span className='text-xs font-semibold text-gray-700 mb-6'>{string}</span>
      <div className='flex flex-col items-center space-y-2'>
        {flames.map((_, index) => {
          const opacityClass =
            index === 0 || index === flames.length - 1
              ? 'opacity-30'
              : 'opacity-100';
          return (
            <img
              key={index}
              src="https://assets.quizlet.com/_next/static/media/streak-flame.8f6423ac.svg"
              alt="study streak"
              className={`w-full h-full ${opacityClass}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CurrentString;
