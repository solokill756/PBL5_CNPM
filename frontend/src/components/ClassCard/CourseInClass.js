import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineDelete } from "react-icons/md";

const CourseInClass = ({vocabulary, author, avatar, lesson, listId, currentUserId, classCreatorId, onDelete}) => {
    const navigate = useNavigate();

    const canDelete = currentUserId && classCreatorId && currentUserId === classCreatorId;
    
    console.log('Delete permission check:', {
        currentUserId,
        classCreatorId,
        canDelete
    });
        
    const handleClick = () => {
        navigate(`/flashcard/${listId}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (canDelete && onDelete) {
            onDelete(listId);
        }
    };

    return (
        <div>
            <div 
                className='border border-gray-100 rounded-lg p-4 shadow-md mb-8 transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)] cursor-pointer '
                onClick={handleClick}
            >
                <div className='flex flex-row justify-between items-start mb-2'>
                    <div className='flex flex-row'>
                        <span className='text-sm font-semibold text-gray-800 mr-2'>{vocabulary} thuật ngữ </span>
                        <span className='text-sm font-semibold text-gray-300 mr-2'>|</span>
                        <div className='w-5 mr-2'>  
                            <img className='rounded-full ' src={avatar}></img>
                        </div>
                        <span className='text-sm font-semibold text-gray-800'>{author}</span>
                    </div>
                    {canDelete && (
                        <MdOutlineDelete 
                            size={24} 
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                            onClick={handleDelete}
                            title="Xóa học phần khỏi lớp"
                        />
                    )}
                </div>
                <div className='text-2xl font-bold text-gray-800'>
                    <span>{lesson}</span>
                </div>
            </div>
        </div>
    )
}

export default CourseInClass