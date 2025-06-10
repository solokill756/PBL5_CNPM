import React from 'react'
import DefaultHeader from '@/layouts/DefaultHeader'
import OptionItem from '@/components/Option/OptionItem'
import ListCourse from '@/components/Course/ListCourse'

const Library = () => {
  return (
    <main className='min-h-screen flex flex-col'>
      <DefaultHeader />
      
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center mb-8">
           <h1 className='text-5xl font-bold text-center'>
              <span className="text-red-800">
                Thư viện của bạn
              </span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Filter Options and Search Combined */}
        <div className="bg-white mb-4">
          {/* Filter Options */}
          <div className="mb-6">
            <OptionItem />
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
               <div className="w-1 h-6 bg-red-800 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800">Danh sách khóa học</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-1">
            <ListCourse />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Library