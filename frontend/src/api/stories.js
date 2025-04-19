// src/api/stories.js
export const fetchStories = async () => {
    try {
        const response = await fetch('http://localhost:3001/stories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
    }
};
