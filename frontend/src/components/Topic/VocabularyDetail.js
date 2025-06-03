import { motion } from "framer-motion";

const VocabularyDetail = ({ vocabulary, index, total }) => {
  if (!vocabulary) return null;

    const { word, pronunciation, meaning, usage, example, example_meaning } =
      vocabulary;
  
    // Xử lý ví dụ và nghĩa của ví dụ
    const examples = example ? example.split("||") : [];
    const meanings = example_meaning ? example_meaning.split("||") : [];
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{word}</h2>
          <span className="text-sm text-gray-500 font-medium">
            {index + 1}/{total}
          </span>
        </div>
        <p className="text-gray-500 mb-4">{pronunciation}</p>
  
        {/* Nghĩa */}
        <motion.div whileHover={{ scale: 1.01 }} className="mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800">Nghĩa</h3>
            <p className="text-gray-700">{meaning}</p>
          </div>
        </motion.div>
  
        {/* Cách dùng */}
        {usage && (
          <motion.div whileHover={{ scale: 1.01 }} className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                Cách dùng
              </h3>
              <p className="text-gray-700">{usage}</p>
            </div>
          </motion.div>
        )}
  
        {/* Ví dụ */}
        {examples.length > 0 && (
          <motion.div whileHover={{ scale: 1.01 }}>
            <div className="bg-red-50 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                Ví dụ
              </h3>
              {examples.map((ex, index) => (
                <div key={index} className="mb-4">
                  <div className="rounded-lg">
                    <ul className="list-disc list-inside space-y-1.5">
                      <li className="text-gray-700">{ex.trim()}</li>
                      <p className="text-gray-600 text-sm ml-6">
                        {meanings[index]?.trim()}
                      </p>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

export default VocabularyDetail;
