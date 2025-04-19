import RecentActivity from '@/components/RecentActivity'
import Streak from '@/components/Streak'
import DefaultHeader from '@/layouts/DefaultHeader'
import React from 'react'

const Achievement = () => {
  return (
    <main className='flex flex-1 flex-grow-1 flex-col items-center'>
        <DefaultHeader />
         <div className='flex flex-col items-center w-full mt-4'>            
            <div className='w-full max-w-6xl px-4'>
              <h2 className='text-4xl font-bold mb-8 '>Thành tựu</h2> 
            </div>
            <div className='w-full max-w-6xl px-4'>
              <span className='text-lg font-bold text-gray-800 dark:text-white mb-4'>Hoạt động gần đây</span>
                <RecentActivity/>
            </div>

            <div className='w-full max-w-6xl px-4'>
              <span className='text-lg font-bold text-gray-800 dark:text-white mb-4'>Chuỗi</span>
               <Streak/>
            </div>
           
        </div>


    </main>
   
  )
}

export default Achievement