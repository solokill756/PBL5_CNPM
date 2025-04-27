import React, {useState} from 'react'
import Modal from './Modal'

const Infor = ({title, infor, operation, confirm, note, type, value, onchange ,placeholder}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  

  return (
    <div className='flex justify-between items-center'>
        <div className=''>
            <h4 className='text-base font-semibold text-gray-900 dark:text-white mb-3 text-left '>{title}</h4>
            <span className='text-base font-normal text-gray-600 dark:text-gray-400'>{infor}</span>
        </div>
        <div className='w-24 flex items-center justify-center'>
            <button onClick={() => setIsModalOpen(true)} className=' hover:bg-red-100 hover:rounded-3xl pl-6 pr-6 pt-3 pb-3'>
                <span className='text-red-800 font-semibold'>{operation}</span>
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4 flex justify-center">{confirm}</h2>
                <p className="mb-4">{note}</p>
                <div>
                <input
                    type={type}
                    value={value}
                    onChange={onchange}
                    placeholder={placeholder}
                    className="border border-gray-300 px-3 py-2 rounded w-full"
                  />
                </div>
                <div className='flex flex-row gap-4 justify-center mt-4'>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-white text-gray-500 border border-gray-300 rounded-3xl px-3 py-1 hover:bg-gray-200"
                    >
                    Huỷ
                    </button>
                    <button
                        className="bg-red-800 text-white px-3 py-1 rounded-3xl hover:bg-red-700"
                    >
                    Lưu
                    </button>
                   
                </div>             
            </Modal>
        </div>  
    </div>
  )
}

export default Infor