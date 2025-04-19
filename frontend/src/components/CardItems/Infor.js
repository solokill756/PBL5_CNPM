import React from 'react'

const Infor = ({title, infor, operation}) => {
  return (
    <div className='flex justify-between items-center'>
        <div className=''>
            <h4 className='text-base font-semibold text-gray-900 dark:text-white mb-3 text-left '>{title}</h4>
            <span className='text-base font-normal text-gray-600 dark:text-gray-400'>{infor}</span>
        </div>
        <div className='w-24 flex items-center justify-center'>
            <button className=' hover:bg-red-100 hover:rounded-3xl pl-6 pr-6 pt-3 pb-3'>
                <span className='text-red-800 font-semibold'>{operation}</span>
            </button>
        </div>
    
    </div>
  )
}

export default Infor