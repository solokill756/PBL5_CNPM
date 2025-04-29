import React from 'react'
import Course from './Course';

const ListCourse = ({header}) => {
    const courses = [
        {
            vocabulary: "70 thuật ngữ",
            author: "Võ Lê Quyên",
            avatar: "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
            lesson: "まとめ2-同じ漢字を含む名詞_N2語彙_耳から覚える"
        },
        {
            vocabulary: "50 thuật ngữ",
            author: "Võ Trung Kiên",
            avatar: "https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg",
            lesson: "Unit07-名詞C_N2語彙_耳から覚える"
        },
    ];

  return (
    <div className='mb-16'>
          <div className='mb-3'>
            <div className='flex items-center'>
                <h3 className='min-w-20 text-base font-semibold text-gray-800'>
                    {header}
                </h3>
                <div className='flex-1 border-t border-gray-200 mx-2'></div>
            </div>
        </div>
            {courses.map((course, index) => (
                        <Course
                        key={index}
                        vocabulary={course.vocabulary}
                        author={course.author}
                        avatar={course.avatar}
                        lesson={course.lesson}
                    />  
                    ))}
    </div>
  )
}

export default ListCourse