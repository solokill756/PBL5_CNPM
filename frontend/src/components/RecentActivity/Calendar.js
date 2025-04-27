import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendar-tailwind.css' // Custom bằng Tailwind ở đây

const studiedDates = [
  '2025-03-31',
  '2025-04-01',
  '2025-04-03',
  '2025-04-04',
  '2025-04-08',
  '2025-04-16',
  '2025-04-17',
  '2025-04-18',
]

const isSameDay = (date1, date2) =>
  date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0]

const StreakCalendar = () => {
  const [value, setValue] = useState(new Date())

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <Calendar
        onChange={setValue}
        value={value}
        locale="vi-VN"
        tileContent={({ date, view }) => {
          const formatted = date.toISOString().split('T')[0]
          return view === 'month' && studiedDates.includes(formatted) ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">
              <img src='https://assets.quizlet.com/_next/static/media/streak-flame.8f6423ac.svg'></img>
            </div>
          ) : null
        }}
        tileClassName={({ date, view }) => {
          const formatted = date.toISOString().split('T')[0]
          if (view === 'month' && studiedDates.includes(formatted)) {
            return 'relative text-black rounded-full font-semibold'
          }
          return 'relative'
        }}
        className="custom-calendar"
      />
    </div>
  )
}

export default StreakCalendar
