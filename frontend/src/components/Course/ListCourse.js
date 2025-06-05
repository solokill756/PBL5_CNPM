import React, { useState, useEffect } from 'react';
import Course from './Course';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { fetchRecentFlashcards } from '@/api/recentFlashcard';

const CourseSkeleton = () => {
    return (
        <div className="animate-pulse mb-4 p-4 border rounded-lg bg-white">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="flex space-x-4">
                        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const groupCoursesByMonthYear = (courses) => {
    const grouped = {};
    
    courses.forEach(course => {
        const date = new Date(course.created_at);
        const monthNames = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];
        
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const key = `${month} năm ${year}`;
        
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(course);
    });
    
    const sortedGroups = Object.keys(grouped)
        .sort((a, b) => {
            const extractDate = (str) => {
                const yearMatch = str.match(/năm (\d+)/);
                const monthMatch = str.match(/Tháng (\d+)/);
                return {
                    year: parseInt(yearMatch[1]),
                    month: parseInt(monthMatch[1])
                };
            };
            
            const dateA = extractDate(a);
            const dateB = extractDate(b);
            
            if (dateA.year !== dateB.year) {
                return dateB.year - dateA.year; 
            }
            return dateB.month - dateA.month; 
        })
        .reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
        }, {});
    
    return sortedGroups;
};

const CourseGroup = ({ header, courses }) => {
    if (!courses || courses.length === 0) {
        return null;
    }

    return (
        <div className="mb-16">
            <div className="mb-3">
                <div className="flex items-center">
                    <h3 className="min-w-20 text-base font-semibold text-gray-800">
                        {header}
                    </h3>
                    <div className="flex-1 border-t border-gray-200 mx-2"></div>
                </div>
            </div>
            
            {courses.map((course) => (
                <Course
                    key={course.list_id} 
                    vocabulary={course.vocabulary}
                    author={course.author}
                    avatar={course.avatar}
                    lesson={course.lesson}
                    listId={course.list_id}
                />
            ))}
        </div>
    );
};

const ListCourse = () => {
    const axiosPrivate = useAxiosPrivate();
    const [groupedCourses, setGroupedCourses] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetchRecentFlashcards(axiosPrivate);              
                if (response && response.data) {                   
                    if (Array.isArray(response.data)) {
                        const formattedCourses = response.data.map(item => {
                            return {
                                list_id: item.list_id || item.id, 
                                vocabulary: item.FlashcardCount || item.flashcard_count || 0,
                                author: item.User?.username || item.author || 'Unknown',
                                avatar: item.User?.profile_picture || item.avatar || null, 
                                lesson: item.title || item.lesson || 'Untitled',
                                created_at: item.created_at || item.creationDate || new Date().toISOString(),
                            };
                        });
                        
                        const grouped = groupCoursesByMonthYear(formattedCourses);
                        setGroupedCourses(grouped);
                    } else {
                        setGroupedCourses({});
                    }
                } else {
                    setGroupedCourses({});
                }
            } catch (error) {
                console.error("Error details:", error);
                console.error("Error response:", error.response?.data);
                setError(error.message || "Không thể tải dữ liệu");
                setGroupedCourses({});
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [axiosPrivate]);

    if (isLoading) {
        return (
            <div className="mb-16">
                <div className="mb-3">
                    <div className="flex items-center">
                        <h3 className="min-w-20 text-base font-semibold text-gray-800">
                            Đang tải...
                        </h3>
                        <div className="flex-1 border-t border-gray-200 mx-2"></div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <CourseSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-16">
                <div className="text-center py-4 text-red-500">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (Object.keys(groupedCourses).length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p>Không có khóa học nào</p>
            </div>
        );
    }

    return (
        <div>
            {Object.entries(groupedCourses).map(([header, courses]) => (
                <CourseGroup
                    key={header}
                    header={header}
                    courses={courses}
                />
            ))}
        </div>
    );
};

export default ListCourse;