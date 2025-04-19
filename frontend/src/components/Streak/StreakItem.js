import React from 'react'

const StreakItem = ({ streak, date }) => {
  const isAchieved = date !== ""; 

  return (
    <div className='flex flex-col items-center'>
      <div className='relative mb-2'>
        {isAchieved ? (
          <>
            <img 
              src='https://quizlet.com/static/achievements/badge-Day.svg' 
              alt={`streak ${streak}`} 
              className='w-full h-full object-cover' 
            />
            <span className='absolute inset-0 flex items-center justify-center text-black font-bold text-xl'>
              {streak}
            </span>
          </>
        ) : (
          <>
           <img 
            src='https://quizlet.com/static/achievements/locked-badge-Day.svg' 
            alt='locked badge' 
            className='w-full h-full object-cover ' 
          />
          <span className='absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xl'>
              {streak}
            </span>
          </>
         
        )}
      </div>   
      <h4 className={`text-sm font-semibold ${isAchieved ? 'text-black' : 'text-gray-400'}`}>
        Chuỗi {streak} ngày
      </h4>
      {isAchieved && (
        <span className='text-xs text-gray-500'>{date}</span>
      )}
    </div>
  )
}

export default StreakItem
