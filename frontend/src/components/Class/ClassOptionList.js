import React, { useEffect, useState } from "react";
import ClassOption from "./ClassOption";
import { fetchUserClass } from "@/api/getUserClass";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const ClassOptionList = ({ onChange, className = "", flashcardId, onInitialSelectionLoad }) => {
  const axiosPrivate = useAxiosPrivate();

  const [selectedIds, setSelectedIds] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserClasses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserClass(axiosPrivate);
        setClasses(data || []);
        
        // Chuyển flashcardId sang string để đảm bảo so sánh đúng
        const flashcardIdStr = String(flashcardId);
        console.log("Current flashcardId:", flashcardIdStr);
        
        const initialSelected = [];
        data.forEach(classItem => {
          console.log(`Class ${classItem.class_name} has flashcards:`, classItem.ListFlashCardClasses);
          if (classItem.ListFlashCardClasses && 
              classItem.ListFlashCardClasses.some(fc => String(fc.list_id) === flashcardIdStr)) {
            initialSelected.push(classItem.class_id);
            console.log(`Added class ${classItem.class_name} to selected`);
          }
        });
        
        console.log("Initial selected classes:", initialSelected);
        setSelectedIds(initialSelected);
        if (onChange) onChange(initialSelected);
        if (onInitialSelectionLoad) onInitialSelectionLoad(initialSelected);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserClasses();
  }, [flashcardId, axiosPrivate, onChange, onInitialSelectionLoad]);

  const handleSelect = (id) => {
    const newSelectIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectIds);
    if (onChange) onChange(newSelectIds);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {isLoading
        ? Array.from({ length: 3 }).map((_, idx) => (
            <ClassOption key={idx} isLoading={true} />
          ))
        : classes.map((option) => (
            <ClassOption
              key={option.class_id}
              id={option.class_id}
              label={option.class_name}
              selected={selectedIds.includes(option.class_id)}
              onSelect={handleSelect}
            />
          ))}
    </div>
  );
};

export default ClassOptionList;