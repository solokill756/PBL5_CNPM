import React from 'react'
import NewAchiev from './NewAchiev'
import Calendar from './Calendar'
import CurrentString from './CurrentString'

const RecentActivity = () => {
  return (
    <div className='flex justify-center justify-between border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3 p-16'>
        <div>
            <NewAchiev 
              title={"Mới đạt được"}
              string = {"Chuỗi 10 tuần"}
              streak={"10"}
            />
        </div>
        <div>
            <Calendar />

        </div>
        <div>
            <CurrentString 
            title={"Chuỗi hiện tại"}
            string= {"10 tuần"}            
            />
        </div>

    </div>
  )
}

export default RecentActivity