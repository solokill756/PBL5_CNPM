    import { Icon } from '@chakra-ui/react';
    import react from 'react';
    import { IoMdAdd } from "react-icons/io";


    function ProfileImge() {
        const avatars = [
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
            "	https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
        ];
        return ( 
            <div className='flex-col overflow-hidden mt-2'>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 text-left">Ảnh hồ sơ</h3>
                <div className="flex items-center gap-3 ">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden shrink-0">
                    <img src="https://i.pinimg.com/736x/82/f8/3c/82f83c07282e788a9f5c939da5d35938.jpg" alt="selected avatar" className="w-full h-full object-cover" />
                    </div>
                    {avatars.map((src, index) => (
                    <div key={index} className="w-14 h-14 rounded-full overflow-hidden shrink-0 border hover:border-blue-400 cursor-pointer">
                        <img src={src} alt={`avatar-${index}`} className="w-full h-full object-cover" />
                    </div>
                    ))}

                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-xl font-medium shrink-0 hover:bg-gray-100">
                        <IoMdAdd className='w-10 h-10 text-gray-600 font-medium'/> 
                    </button>
                </div>
            </div>
        );
    }

    export default ProfileImge;