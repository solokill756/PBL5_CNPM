import React, { useState } from "react";
import QuizModal from "@/components/Modal/QuizModal";
import QuizPage from "@/components/Quiz";

function Quiz() {
  const [open, setOpen] = useState(true);

  const handleSubmitSettings = (settings) => {
    console.log("Dữ liệu gửi lên server:", settings);
    // TODO: Gửi dữ liệu này lên server tạo quiz AI
    // fetch('/api/quiz', { method: 'POST', body: JSON.stringify(settings) })
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <QuizModal
          isOpen={open}
          onClose={() => setOpen(false)}
          title={"Unit08-動詞B_N2語彙_耳から覚える"}
          maxQuestions={100}
          onSubmit={handleSubmitSettings}
        />
      </div>
      <div className="w-full">
        <QuizPage/>
      </div>
    </div>
  
  );
}

export default Quiz;
