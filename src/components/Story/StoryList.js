import { HStack } from '@chakra-ui/react';
import StoryItem from './StoryItem';
import { useRef, useState, useEffect } from 'react';
import ScrollButton from '../ScrollButton';
import { useNavigate } from 'react-router-dom';
import { fetchStories } from '@/api/stories'; // Import API function

function StoryList() {
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const [stories, setStories] = useState([]);
    const [isLeftVisible, setIsLeftVisible] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(true);

    // Fetch stories from API
    useEffect(() => {
        const loadStories = async () => {
            try {
                const data = await fetchStories(); // Sử dụng hàm API đã tách
                setStories(data);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };
        loadStories();
    }, []);

    // Update button visibility based on scroll position
    const updateButtonVisibility = () => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

        // Handle edge cases with a small margin of error
        const isAtStart = scrollLeft <= 0;
        const isAtEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) <= 1;

        setIsLeftVisible(!isAtStart);
        setIsRightVisible(!isAtEnd);
    };

    // Scroll handling
    const handleScroll = (direction) => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollAmount = 315; // Adjust scroll step size
        const newScrollPosition =
            direction === 'left'
                ? scrollContainer.scrollLeft - scrollAmount
                : scrollContainer.scrollLeft + scrollAmount;

        scrollContainer.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;

        const handleVisibility = () => updateButtonVisibility();

        const timeout = setTimeout(handleVisibility, 100);

        scrollContainer.addEventListener('scroll', handleVisibility);
        return () => {
            clearTimeout(timeout);
            scrollContainer.removeEventListener('scroll', handleVisibility);
        };
    }, []);

    // Recheck visibility whenever stories are updated
    useEffect(() => {
        if (stories.length > 0) {
            updateButtonVisibility();
        }
    }, [stories]);

    return (
        <div className="relative w-[38.5rem]">
            {isLeftVisible && (
                <ScrollButton
                    direction="left"
                    onClick={() => handleScroll('left')}
                />
            )}
            <div
                ref={scrollRef}
                className="flex overflow-hidden py-3 scroll-smooth"
            >
                <HStack spacing={4}>
                    {stories.map((story) => (
                        <StoryItem
                            key={story.id}
                            onClick={() =>
                                navigate(
                                    `/stories/${story.username}/${story.id}`
                                )
                            }
                            {...story}
                        />
                    ))}
                </HStack>
            </div>
            {isRightVisible && (
                <ScrollButton
                    direction="right"
                    onClick={() => handleScroll('right')}
                />
            )}
        </div>
    );
}

export default StoryList;
