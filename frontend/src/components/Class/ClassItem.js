import React from 'react'
import { HiMiniUserGroup } from 'react-icons/hi2'

const ClassItem = ({ name, author, member }) => {
  return (
    <div className='flex w-full rounded-lg p-3 space-x-2 cursor-pointer hover:bg-slate-100'>
        <div className='p-3 border rounded-lg bg-red-100'>
            <HiMiniUserGroup className='size-6 text-red-500'/>
        </div>
        {/* Đặt overflow-hidden ở div cha của span */}
        <div className='flex-1 flex flex-col text-md justify-center overflow-hidden'>
            <span className='max-w-full text-gray-800 font-medium block overflow-hidden text-ellipsis whitespace-nowrap'>
              {name}
            </span>
            <div className='text-gray-500 font-medium space-x-4'>
                <span>{author}</span>
                <span>{member} thành viên</span>
            </div>
        </div>
    </div>
  )
}

export default ClassItem
