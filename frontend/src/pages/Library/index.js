import React from 'react'
import DefaultHeader from '@/layouts/DefaultHeader'
import OptionItem from '@/components/Option/OptionItem'
import Option from '@/components/CardItems/Option'
import SearchInput from '@/components/SearchInput'
import Course from '@/components/Course/Course'

const Library = () => {
  const Options = [
    { value: "created", label: "Đã tạo" },
    { value: "recently", label: "Gần đây" },
    { value: "studied", label: "Đã học"}
  ];
  return (
    <main className='flex flex-1 flex-grow-1 flex-col items-center'>
    <DefaultHeader />
    <div className="flex flex-col justify-center p-10 w-full">
        <h2 className='text-4xl font-bold mb-8'>Thư viện của bạn</h2>
        <div>
          <OptionItem/>
        </div>
        <div className='flex flex-row mt-10 justify-between'>
            <div className='w-1/3'>
              <Option options={Options}/>          
            </div>
            <div className='w-2/3 flex flex-col items-end'>
              <SearchInput/>
            </div>
        </div>
        <div className='mt-10'>
            <Course
              header = "tuan nay"
              vocabulary={"70 tu vung"}
              author={"le quyen"}
              avatar={'https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg'}
              lesson={"tu vung n2"}
            />
          </div>
        
    
    </div>
</main>
  )
}

export default Library