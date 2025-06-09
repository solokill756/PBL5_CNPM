import TestResultPage from "@/components/TestList/TestAnswer";
import Result from "@/components/TestList/TestResult";
import React, { useState, useEffect } from "react";
import ModeHeader from "@/components/ModeHeader";
import { useNavigate } from "react-router-dom";
import { useTestStore } from "@/store/useTestStore";
import useTopicStore from "@/store/useTopicStore";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

function TestResult() {
  const { topicId } = useParams(); 
  const navigate = useNavigate();
  const axios = useAxiosPrivate()
  const { questions, fetchQuestions, loading, error } = useTestStore();
  const { currentTopic, fetchTopicById } = useTopicStore();
  const [dataInitialized, setDataInitialized] = useState(false);
    useEffect(() => {
      const initializeTest = async () => {
        if (dataInitialized) return; 
        
        try {
  
          const currentTopicId = currentTopic?.topic_id || currentTopic?.topic_Id;
          await fetchQuestions(axios,topicId);
          setDataInitialized(true);
    
          
        } catch (error) {
          console.error("Error initializing test:", error);
          setDataInitialized(true); 
        }
      };
  
      if (topicId && !dataInitialized) {
        initializeTest();
      }
    }, [topicId]); 

  return (
    <div>
      {/* Main Content */}
      <div className="px-4">
        <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-md">
        <ModeHeader
          flashcardTitle={"Bài kiểm tra"}
          onClose={() => {
            const topicIdToUse = topicId || currentTopic?.topic_id || currentTopic?.topic_Id;
            if (topicIdToUse) {
              navigate(`/vocabulary/topic/${topicIdToUse}`);
            } else {
              navigate('/vocabulary');
            }
          }}
        />
      </div>
        <Result className= "mt-4"/>
        <TestResultPage/>
      </div>
    </div>
  );
}

export default TestResult;