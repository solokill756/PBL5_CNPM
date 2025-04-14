import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function StoryModal() {
    const { username, id } = useParams();
    const navigate = useNavigate();
    const [currentStory, setCurrentStory] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch(`http://localhost:3001/stories`);
                const storyList = await response.json();

                const story = storyList.find((story) => story.id == id);
                
                if (story) {
                    setCurrentStory(story);
                    setCurrentImageIndex(0); 
                } else {
                    navigate('/'); // Điều hướng nếu không tìm thấy câu chuyện
                }
            } catch (error) {
                console.error('Error fetching story:', error);
                navigate('/'); // Điều hướng nếu có lỗi xảy ra
            }
        };

        fetchStory();
    }, [username, id, navigate]);

    const handleNextImage = () => {
        if (
            currentStory &&
            currentImageIndex < currentStory.images.length - 1
        ) {
            setCurrentImageIndex((prev) => prev + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentStory && currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
        }
    };

    const closeModal = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    if (!currentStory) {
        return null; // Không render nếu story không tồn tại
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="relative w-full max-w-3xl p-4 bg-black rounded-lg">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-white text-lg font-bold"
                >
                    ✕
                </button>
                <div className="relative flex justify-center items-center">
                    <button
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                        className={`absolute left-4 text-white p-2 rounded-full focus:outline-none ${
                            currentImageIndex === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-700'
                        }`}
                    >
                        ◀
                    </button>
                    <img
                        src={currentStory.images[currentImageIndex]}
                        alt={`Story ${currentStory.caption}`}
                        className="max-w-full max-h-[80vh] object-contain"
                    />
                    <button
                        onClick={handleNextImage}
                        disabled={
                            currentImageIndex === currentStory.images.length - 1
                        }
                        className={`absolute right-4 text-white p-2 rounded-full focus:outline-none ${
                            currentImageIndex === currentStory.images.length - 1
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-700'
                        }`}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StoryModal;
