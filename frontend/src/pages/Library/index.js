import React from 'react'
import DefaultHeader from '@/layouts/DefaultHeader'
import OptionItem from '@/components/Option/OptionItem'
import Option from '@/components/CardItems/Option'
import SearchInput from '@/components/SearchInput'
import Course from '@/components/Course/Course'
import ListCourse from '@/components/Course/ListCourse'

const Library = () => {
  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col'>
      <DefaultHeader />
      
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center mb-8">
           <h1 className='text-5xl font-bold text-center'>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thư viện của bạn
              </span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Filter Options and Search Combined */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          {/* Filter Options */}
          <div className="mb-6">
            <OptionItem />
          </div>
          
          {/* Search Section - Centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Tìm kiếm khóa học</h3>
              </div>
              <div className='flex items-center justify-center mb-4'>
                  <SearchInput />
              </div>
              
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-gray-800">Danh sách khóa học</h3>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-1">
            <ListCourse />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Library