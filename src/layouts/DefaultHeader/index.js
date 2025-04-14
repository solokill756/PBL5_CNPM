import { ReactComponent as CreateIcon } from "../../assets/icons/new.svg";
import SearchInput from '@/components/SearchInput'
import React from 'react'
import { BsFire } from "react-icons/bs";

const DefaultHeader = () => {
  return (
    <div className='sticky top-0 z-50 w-full bg-white h-20 flex items-center justify-center'>
        <div className='flex w-3/4 justify-center'><SearchInput /></div>
        <div className='flex-1 flex justify-center'>
            {/* <div className="w-1/4"></div> */}
            <div className="w-2/4 flex flex-col items-start justify-center text-sm font-semibold text-gray-500">
                <span>Hồ Thanh Huy</span>
                <span className="flex items-center gap-2">8 <BsFire color="orange"/></span>
            </div>
            <div className="flex-1 ">
                <img className="size-12 rounded-full" src="https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg"/>
            </div>
        </div>
    </div>
  )
}

export default DefaultHeader