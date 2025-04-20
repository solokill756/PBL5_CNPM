import React, { useState } from 'react'
import Modal from './Modal'

const Delete = ({title, infor, operation}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className='flex justify-between items-center'>
        <div className=''>
            <h4 className='text-base font-semibold text-gray-900 dark:text-white mb-3 text-left '>{title}</h4>
            <span className='text-base font-normal text-gray-600 dark:text-gray-400'>{infor}</span>
        </div>
        <div className='flex items-center justify-center'>
            <button onClick={() => setIsModalOpen(true)} className='bg-red-800 rounded-3xl hover:bg-red-600 hover:rounded-3xl pl-6 pr-6 pt-3 pb-3'>
                <span className='text-white font-semibold'>{operation}</span>
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4 flex justify-center">Xoá tài khoản?</h2>
                <p className="mb-4">Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu liên quan đến tài khoản Quizlet của bạn. Bạn không thể hoàn tác.</p>
                <div className='flex flex-row gap-4 justify-center'>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-white text-gray-500 border border-gray-300 rounded-3xl px-3 py-1 hover:bg-gray-200"
                    >
                    Huỷ
                    </button>
                    <button
                        className="bg-red-800 text-white px-3 py-1 rounded-3xl hover:bg-red-700"
                    >
                    Xoá tài khoản
                    </button>
                   
                </div>             
            </Modal>
        </div>
    </div>
  )
}

export default Delete