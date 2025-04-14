import React from 'react'
import Infor from '../CardItems/Infor'

const Privacy = () => {
  return (
    <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
        <div className='p-6 border-b-2 border-gray-200'>
            <Infor title="Tạo mật khẩu" operation ="Tạo" />
        </div>
        <div className='p-6'>
            <Infor title="Xóa tài khoản của bạn" infor="Thao tác này sẽ xóa tất cả dữ liệu của bạn và không thể hoàn tác." operation ="Xoá" />
        </div>

    </div>
  )
}

export default Privacy