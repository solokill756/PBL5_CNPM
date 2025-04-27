import React from 'react'
import { useNavigate } from 'react-router-dom'

const Course = ({header, vocabulary, author, avatar, lesson}) => {
    const usenavigate = useNavigate();
  return (
    <div>
        <div>
            <h3 className='text-base font-semibold text-gray-800'>
                {header}
            </h3>
            <span className=''></span>
            
        </div>
        <div>
            <div className='flex flex-row'>
                <span className='text-sm font-semibold text-gray-800'>{vocabulary}</span>
                <span className='text-sm font-semibold text-gray-300'>|</span>
                <div className='w-6'>
                    <img className='rounded-full' src={avatar}></img>
                </div>
                <span className='text-sm font-semibold text-gray-800'>{author}</span>
            </div>
            <div>
                <span>{lesson}</span>
            </div>
        </div>
    </div>
  )
}

export default Course