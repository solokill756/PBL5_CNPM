import React from "react";
import { useTestStore } from "@/store/useTestStore";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestResultPage = () => {
  const { questions, answers, result } = useTestStore();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2 className="text-2xl font-bold mb-10 text-left text-gray-800">
        Đáp án của bạn
      </h2>

      <div className="space-y-16">
        {questions.map((q, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === q.answer;

          return (
            <div
              key={q.id}
              className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4 ">
                <span className="text-base text-gray-500 font-medium mb-2">Định nghĩa</span>
                <span>{index + 1}/{questions.length}</span>
              </div>
              <p className="text-2xl mb-6">{q.definition}</p>

              {/* {!isCorrect && (
                <p className="text-red-600 font-semibold mb-4">
                  Chưa đúng, hãy cố gắng nhé!
                </p>
              )} */}

              <div className="grid grid-cols-2 gap-6 text-lg">
                {q.options.map((opt) => {
                  const isSelected = userAnswer === opt;
                  const isAnswer = q.answer === opt;

                  let style = "relative border text-xl px-6 py-4 rounded-lg flex justify-between items-center";
                  if (isAnswer) {
                    style += " border-green-600 bg-green-50";
                  }
                  if (isSelected && !isCorrect) {
                    style += " border-red-600 bg-red-50";
                  }
                  if (!isSelected && !isAnswer) {
                    style += " border-gray-200";
                  }

                  return (
                    <div key={opt} className={style}>
                      <span>{opt}</span>
                      {isAnswer && (
                        <CheckCircle className="text-green-600" size={20} />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="text-red-600" size={20} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestResultPage;
