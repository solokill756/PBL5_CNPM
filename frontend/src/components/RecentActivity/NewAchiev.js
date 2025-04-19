import React from 'react'

const NewAchiev = ({title, string,streak}) => {
  return (
    <div className='flex flex-col items-center'>   
        <h5 className='text-base font-semibold text-gray-900 dark:text-white mb-3 text-left'>{title}</h5>
        <span className='text-xs font-semibold text-gray-600 mb-6'>{string}</span>
        <div className='relative'>
            <img 
                  src='https://quizlet.com/static/achievements/badge-Week.svg' 
                  alt={`streak ${streak}`} 
                  className='w-full h-full object-cover' 
                />
                <span className='absolute inset-0 flex items-center justify-center text-black font-bold text-xl'>
                  {streak}
                </span>
        </div>

    </div>
  )
}

export default NewAchiev