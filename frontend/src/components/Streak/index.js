import React from 'react'
import StreakItem from './StreakItem';

const Streak = () => {
  const streaks = [
    { streak: "3", date: "26/12/2022" },
    { streak: "5", date: "26/12/2022" },
    { streak: "7", date: "26/12/2022" },  
    { streak: "10", date: "26/12/2022" },
    { streak: "20", date: "" },
    { streak: "30", date: "" },
    { streak: "45", date: "" },
    { streak: "60", date: "" },
    { streak: "70", date: "" },
    { streak: "80", date: "" },

  ];
 

  return (
    
         <div className='flex justify-between flex-wrap gap-8 border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3 p-16'>
            {streaks.map((value, index) => (
              <StreakItem key={index} streak={value.streak} date={value.date} />
            ))}
          </div>

  )
}

export default Streak