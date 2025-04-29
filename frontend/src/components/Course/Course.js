import React from 'react'
import { useNavigate } from 'react-router-dom'

const Course = ({vocabulary, author, avatar, lesson}) => {
    const usenavigate = useNavigate();
  return (
    <div>
        <div className='border border-gray-100 rounded-lg p-4 shadow-md mb-4  transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)]'>
            <div className='flex flex-row mb-2'>
                <span className='text-sm font-semibold text-gray-800 mr-2'>{vocabulary}</span>
                <span className='text-sm font-semibold text-gray-300 mr-2'>|</span>
                <div className='w-5 mr-2'>
                    <img className='rounded-full ' src={avatar}></img>
                </div>
                <span className='text-sm font-semibold text-gray-800'>{author}</span>
            </div>
            <div className='text-lg font-semibold text-gray-800'>
                <span>{lesson}</span>
            </div>
        </div>
    </div>
  ) 
}

export default Course
