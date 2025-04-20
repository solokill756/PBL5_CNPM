import React, { useState } from 'react'
import Infor from '../CardItems/Infor'
import Delete from '../CardItems/Delete'

const Privacy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
   const [password, setPassword] = useState('');
  
    const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
        <div className='p-6 border-b-2 border-gray-200'>
            <Infor title="Tạo mật khẩu" 
                  operation ="Tạo" 
                  confirm="Tạo mật khẩu"
                  note="Tạo mật khẩu cho tài khoản Quizlet của bạn"
                  type = "password"
                  value = {password}
                  onchange={handlePasswordChange}     
            
            />
        </div>
        <div className='p-6'>
            <Delete
              title={"Xóa tài khoản của bạn"}
              infor={"Thao tác này sẽ xóa tất cả dữ liệu của bạn và không thể hoàn tác."}
              operation={"Xoá tài khoản"}
              confirm={"Bạn muốn xoá tài khoản vĩnh viễn?"}
              agree={"Xoá"}
            />
        </div>

    </div>
  )
}

export default Privacy