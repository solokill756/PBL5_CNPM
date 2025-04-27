import React from 'react'
import { BiGroup } from 'react-icons/bi'
import { PiCards } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const AuthorItem = ({ name, avatar, numberClass, numberFlashcard, loading = false }) => {
  return (
    <Link className='scrollable-item flex-shrink-0 overflow-hidden snap-start basis-1/2 px-2'>
      <div className="active:border-solid active:border-2 active:border-red-300 relative p-6 space-y-4 bg-white border-2 cursor-pointer border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 
        transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)]">
        
        <div className="flex items-center">
          {loading ? <Skeleton circle height={64} width={64} /> : <img className="size-16 rounded-full" src={avatar} alt="" />}
        </div>

        <span className="truncate w-full text-xl font-bold text-gray-900 dark:text-white block overflow-hidden text-ellipsis whitespace-nowrap">
          {loading ? <Skeleton width={140} /> : name}
        </span>

        <div className='flex space-x-3'>
          {loading ? (
            <>
              <Skeleton width={90} height={28} />
              <Skeleton width={90} height={28} />
            </>
          ) : (
            <>
              <span className="flex px-2 py-1 items-center text-xs gap-1 font-semibold text-gray-800 bg-red-100 rounded-full">
                <PiCards className='size-5' />
                {numberFlashcard} học phần
              </span>
              <span className="flex px-2 py-1 items-center text-xs gap-1 font-semibold text-gray-800 bg-red-100 rounded-full">
                <BiGroup className='size-5'/>
                {numberClass} lớp học
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default AuthorItem
