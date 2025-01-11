import { HStack } from '@chakra-ui/react';
import StoryItem from './StoryItem';
import { useRef } from 'react';
import ScrollButton from '../ScrollButton';

function StoryList({ stories }) {
    const scrollRef = useRef(null);

    const handleScroll = (direction) => {
        const scrollContainer = scrollRef.current;
        if (direction === 'left') {
            scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
        } else {
            scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
        }
    }

    return (
        <div className="relative max-w-2xl">
            {/* <ScrollButton direction="left" onClick={() => handleScroll('left')} /> */}
            <div
                ref={scrollRef}
                className="flex overflow-auto py-3"
                style={{ scrollBehavior: 'smooth'}}
            >
                <HStack spacing={4}>
                    {stories.map((story, index) => (
                        <StoryItem
                            key={index}
                            avatar={story.avatar}
                            // name={story.name}
                            status={story.status}
                        />
                    ))}
                </HStack>
            </div>
            {/* <ScrollButton direction="right" onClick={() => handleScroll('right')} /> */}
        </div>
    );
}

export default StoryList;
