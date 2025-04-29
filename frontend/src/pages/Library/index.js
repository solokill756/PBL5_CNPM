import React from 'react'
import DefaultHeader from '@/layouts/DefaultHeader'
import OptionItem from '@/components/Option/OptionItem'
import Option from '@/components/CardItems/Option'
import SearchInput from '@/components/SearchInput'
import Course from '@/components/Course/Course'
import ListCourse from '@/components/Course/ListCourse'

const Library = () => {
  const Options = [
    { value: "created", label: "Đã tạo" },
    { value: "recently", label: "Gần đây" },
    { value: "studied", label: "Đã học"}
  ];
  const time = [
    {header: "Tuần này"},
    {header: "Tuần trước"},
    {header: "Tháng 3 năm 2025"},
    {header: "Tháng 2 năm 2025"},
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
                  {time.map((item, index) => (
                  <ListCourse
                    key={index}
                    header={item.header}
                  />
                ))}

        </div>
        
    
    </div>
</main>
  )
}

export default Library