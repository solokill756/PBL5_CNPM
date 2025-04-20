import React from 'react'
import Mention from '../CardItems/Mention'
import Class from '../CardItems/Class';

const NotificationCard = ({title, options}) => {
    const time = [
        { value: "0", label: "00:00" },
        { value: "1", label: "01:00" },
        { value: "2", label: "02:00"},

    ];

  return (
        <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
            <div className='pt-8 pb-8 pl-6 pr-6 border-b-2 border-gray-200'>
                <Mention
                    title={"Lời nhắc học"}
                    options={time}
                    infor={"Chọn thời điểm nhận lời nhắc học tập"}
                />
            </div>
            <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 text-left">Lớp học</h2>
                <p className="text-base font-normal text-gray-600 dark:text-gray-400">
                    Thông báo cho tôi khi học phần hoặc thư mục được thêm vào lớp học
                </p>

                <Class title="日本語" link="/lop/nihongo" />
                <Class title="Lớp N3" link="/lop/n3" />
            </div>   
    </div>
  )
}
export default NotificationCard