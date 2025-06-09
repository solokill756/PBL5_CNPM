import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoAdd, 
  IoSearch, 
  IoTrash, 
  IoEye,
  IoClose,
  IoSave,
  IoBook,
  IoRefresh,
  IoFilter,
  IoCloudUpload,
  IoPencil,
  IoLibrary,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTime,
  IoChevronBack,
  IoChevronForward,
  IoEllipsisHorizontal
} from 'react-icons/io5';
import useAdminStore from '@/store/useAdminStore';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useToast, TOAST_TYPES } from '@/context/ToastContext';
import { RiRobot2Line } from 'react-icons/ri';

const VocabularyFormModal = ({ vocabulary, topics, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      word: '',
      pronunciation: '',
      meaning: '',
      example: '',
      level: 'N1',
      ai_suggested: false,
      topic_id: '',
      is_show: false,
    });
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (vocabulary) {
        setFormData({
          word: vocabulary.word || '',
          pronunciation: vocabulary.pronunciation || '',
          meaning: vocabulary.meaning || '',
          example: vocabulary.example || '',
          level: vocabulary.level || '1',
          ai_suggested: vocabulary.ai_suggested === "1" || vocabulary.ai_suggested === true,
          topic_id: vocabulary.topic_id || '',
          is_show: vocabulary.is_show || false,
        });
      } else {
        setFormData({
          word: '',
          pronunciation: '',
          meaning: '',
          example: '',
          level: 'N1',
          ai_suggested: false,
          topic_id: topics.length > 0 ? topics[0].topic_id : '',
          is_show: false,
        });
      }
    }, [vocabulary, topics]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error saving vocabulary:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {vocabulary ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/70 rounded-xl transition-all duration-200"
                >
                  <IoClose className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
  
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Từ vựng *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập từ vựng..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phát âm
                  </label>
                  <input
                    type="text"
                    value={formData.pronunciation}
                    onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="/prəˌnʌnsiˈeɪʃən/"
                  />
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nghĩa *
                  </label>
                  <textarea
                    required
                    value={formData.meaning}
                    onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập nghĩa của từ..."
                  />
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ví dụ
                  </label>
                  <textarea
                    value={formData.example}
                    onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập câu ví dụ..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chủ đề *
                  </label>
                  <select
                    required
                    value={formData.topic_id}
                    onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn chủ đề</option>
                    {topics.map(topic => (
                      <option key={topic.topic_id} value={topic.topic_id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    {['N1', 'N2', 'N3', 'N4', 'N5'].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Trạng thái hiển thị
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Cho phép hiển thị từ vựng này cho người dùng
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_show}
                        onChange={(e) => setFormData({ ...formData, is_show: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
  
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg"
                >
                  <IoSave className="w-4 h-4" />
                  <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
};

const BulkUploadModal = ({ isOpen, onClose, onUpload, topics }) => {
    const [csvData, setCsvData] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleUpload = async () => {
      if (!csvData.trim() || !selectedTopic) {
        return;
      }
  
      setLoading(true);
      try {
        const lines = csvData.trim().split('\n');
        const vocabularies = lines.map(line => {
          const [word, pronunciation, meaning, example, level, type] = line.split(',').map(item => item.trim());
          return {
            word,
            pronunciation: pronunciation || '',
            meaning,
            example: example || '',
            level: level || '1',
            topic_id: selectedTopic,
            is_show: false,
            ai_suggested: false,
            language: 'en',
            type: type || 'noun'
          };
        }).filter(vocab => vocab.word && vocab.meaning);
  
        await onUpload(vocabularies);
        onClose();
        setCsvData('');
        setSelectedTopic('');
      } catch (error) {
        console.error('Error uploading vocabularies:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
        <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Tải lên hàng loạt
                </h3>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-white/70 rounded-xl transition-all duration-200"
                >
                  <IoClose className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
  
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn chủ đề *
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Chọn chủ đề</option>
                  {topics.map(topic => (
                  <option key={topic.topic_id} value={topic.topic_id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dữ liệu CSV *
              </label>
              <div className="text-sm text-gray-500 mb-2">
                Định dạng: từ_vựng, phát_âm, nghĩa, ví_dụ, level, loại_từ (mỗi từ một dòng)
              </div>
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows={10}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono text-sm transition-all duration-200"
                placeholder="hello, /həˈloʊ/, xin chào, Hello world!, 1, noun
goodbye, /ɡʊdˈbaɪ/, tạm biệt, Goodbye my friend!, 1, interjection"
              />
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Hướng dẫn:</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Mỗi dòng là một từ vựng</li>
                <li>• Các trường cách nhau bằng dấu phẩy</li>
                <li>• Trường từ_vựng và nghĩa là bắt buộc</li>
                <li>• Level từ 1-5, mặc định là 1</li>
                <li>• Loại từ: noun, verb, adjective, adverb...</li>
                <li>• Từ vựng sẽ ở trạng thái chờ duyệt</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={loading || !csvData.trim() || !selectedTopic}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg"
              >
                <IoCloudUpload className="w-4 h-4" />
                <span>{loading ? 'Đang tải...' : 'Tải lên'}</span>
              </button>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </AnimatePresence>
    );
};

const VocabularyCard = ({ vocabulary, onEdit, onDelete, onView, onApprove, onReject }) => {
  const isApproved = vocabulary.is_show;
  const isAISuggested = vocabulary.ai_suggested === "1" || vocabulary.ai_suggested === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-md border-2 hover:shadow-lg transition-all duration-300 p-5 ${
        isApproved 
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50' 
          : 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50'
      }`}
    >
      {/* Header với status badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {isAISuggested && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200">
                <RiRobot2Line className="w-3 h-3 mr-1" />
                AI
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
              isApproved 
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200' 
                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200'
            }`}>
              {isApproved ? (
                <>
                  <IoCheckmarkCircle className="w-3 h-3 mr-1" />
                  Đã duyệt
                </>
              ) : (
                <>
                  <IoTime className="w-3 h-3 mr-1" />
                  Chờ duyệt
                </>
              )}
            </span>
            {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200">
              {vocabulary.type || 'noun'}
            </span> */}
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {vocabulary.word}
          </h3>
          {vocabulary.pronunciation && (
            <p className="text-sm text-indigo-600 mb-2 font-medium">
              {vocabulary.pronunciation}
            </p>
          )}
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {vocabulary.meaning}
          </p>
        </div>
        
        <div className="ml-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200">
            {vocabulary.level}
          </span>
        </div>
      </div>

      {/* {vocabulary.example && (
        <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
          <p className="text-sm text-gray-700 italic">"{vocabulary.example}"</p>
        </div>
      )} */}

      {/* Action buttons */}
      <div className="space-y-2.5">
        {/* Approve/Reject buttons cho chưa duyệt */}
        {!isApproved && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onApprove(vocabulary)}
              className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium shadow-sm"
            >
              <IoCheckmarkCircle className="w-4 h-4" />
              <span className="text-sm">Duyệt</span>
            </button>
            
            <button
              onClick={() => onReject(vocabulary)}
              className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-sm"
            >
              <IoCloseCircle className="w-4 h-4" />
              <span className="text-sm">Từ chối</span>
            </button>
          </div>
        )}

        {/* Regular action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(vocabulary)}
            className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-indigo-600 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 border border-indigo-200 font-medium"
          >
            <IoEye className="w-4 h-4" />
            <span className="text-sm">Xem</span>
          </button>
          
          <button
            onClick={() => onEdit(vocabulary)}
            className="px-3 py-2 text-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 border border-emerald-200"
          >
            <IoPencil className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(vocabulary)}
            className="px-3 py-2 text-rose-600 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all duration-200 border border-rose-200"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-4">
      <div className="text-sm text-gray-600 mb-4 sm:mb-0">
        Hiển thị <span className="font-semibold text-gray-800">{startItem}-{endItem}</span> trong tổng số{' '}
        <span className="font-semibold text-gray-800">{totalItems}</span> từ vựng
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <IoChevronBack className="w-4 h-4" />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-3 py-2">
              <IoEllipsisHorizontal className="w-4 h-4 text-gray-400" />
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                  : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <IoChevronForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Vocabularies = () => {
  const axios = useAxiosPrivate();
  const { addToast } = useToast();
  const {
    vocabularies,
    topics,
    loading,
    fetchVocabularies,
    fetchTopics,
    addVocabulary,
    updateVocabulary,
    deleteVocabulary,
    getVocabularyById
  } = useAdminStore();

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Modal state
  const [selectedVocabulary, setSelectedVocabulary] = useState(null);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTopic, selectedLevel, statusFilter, sourceFilter, typeFilter]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchVocabularies(axios),
        fetchTopics(axios)
      ]);
    } catch (error) {
      addToast('Lỗi khi tải dữ liệu', TOAST_TYPES.ERROR);
    }
  };

  // Filter logic
  const filteredVocabularies = vocabularies.filter(vocab => {
    const matchesSearch = vocab.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vocab.meaning?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTopic = selectedTopic === 'all' || vocab.topic_id === selectedTopic;
    const matchesLevel = selectedLevel === 'all' || vocab.level === selectedLevel;
    const matchesType = typeFilter === 'all' || vocab.type === typeFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && vocab.is_show) ||
                         (statusFilter === 'pending' && !vocab.is_show);
    
    const matchesSource = sourceFilter === 'all' ||
                         (sourceFilter === 'ai' && (vocab.ai_suggested === "1" || vocab.ai_suggested === true)) ||
                         (sourceFilter === 'manual' && !(vocab.ai_suggested === "1" || vocab.ai_suggested === true));

    return matchesSearch && matchesTopic && matchesLevel && matchesType && matchesStatus && matchesSource;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVocabularies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVocabularies = filteredVocabularies.slice(startIndex, endIndex);

  const handleAddVocabulary = () => {
    setSelectedVocabulary(null);
    setIsEditing(false);
    setShowVocabModal(true);
  };

  const handleEditVocabulary = async (vocabulary) => {
    try {
      const vocabDetail = await getVocabularyById(axios, vocabulary.vocab_id);
      setSelectedVocabulary(vocabDetail);
      setIsEditing(true);
      setShowVocabModal(true);
    } catch (error) {
      addToast('Lỗi khi tải thông tin từ vựng', TOAST_TYPES.ERROR);
    }
  };

  const handleSaveVocabulary = async (formData) => {
    try {
      if (isEditing && selectedVocabulary) {
        await updateVocabulary(axios, selectedVocabulary.vocab_id, formData);
        addToast('Cập nhật từ vựng thành công', TOAST_TYPES.SUCCESS);
      } else {
        await addVocabulary(axios, [formData]);
        addToast('Thêm từ vựng thành công', TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      addToast('Lỗi khi lưu từ vựng', TOAST_TYPES.ERROR);
      throw error;
    }
  };

  const handleBulkUpload = async (vocabularies) => {
    try {
      await addVocabulary(axios, vocabularies);
      addToast(`Đã thêm ${vocabularies.length} từ vựng thành công`, TOAST_TYPES.SUCCESS);
    } catch (error) {
      addToast('Lỗi khi tải lên hàng loạt', TOAST_TYPES.ERROR);
      throw error;
    }
  };

  const handleApproveVocabulary = async (vocabulary) => {
    try {
      await updateVocabulary(axios, vocabulary.vocab_id, { is_show: true });
      addToast(`Đã duyệt từ vựng "${vocabulary.word}"`, TOAST_TYPES.SUCCESS);
    } catch (error) {
      addToast('Lỗi khi duyệt từ vựng', TOAST_TYPES.ERROR);
    }
  };

  const handleRejectVocabulary = async (vocabulary) => {
    if (window.confirm(`Bạn có chắc chắn muốn từ chối từ vựng "${vocabulary.word}"?`)) {
      try {
        await updateVocabulary(axios, vocabulary.vocab_id, { is_show: false });
        addToast(`Đã từ chối từ vựng "${vocabulary.word}"`, TOAST_TYPES.WARNING);
      } catch (error) {
        addToast('Lỗi khi từ chối từ vựng', TOAST_TYPES.ERROR);
      }
    }
  };

  const handleDeleteVocabulary = async (vocabulary) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa từ "${vocabulary.word}"?`)) {
      try {
        await deleteVocabulary(axios, vocabulary.vocab_id);
        addToast('Xóa từ vựng thành công', TOAST_TYPES.SUCCESS);
      } catch (error) {
        addToast('Lỗi khi xóa từ vựng', TOAST_TYPES.ERROR);
      }
    }
  };

  const handleViewVocabulary = (vocabulary) => {
    console.log('View vocabulary:', vocabulary);
  };

  // Statistics
  const stats = {
    total: vocabularies.length,
    approved: vocabularies.filter(v => v.is_show).length,
    pending: vocabularies.filter(v => !v.is_show).length,
    ai: vocabularies.filter(v => v.ai_suggested === "1" || v.ai_suggested === true).length,
    topics: topics.length
  };

  if (loading.vocabularies || loading.topics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý từ vựng</h1>
          <p className="text-gray-600 mt-1">Quản lý và duyệt từ vựng trong hệ thống</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading.vocabularies}
            className="inline-flex items-center space-x-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <IoRefresh className={`w-4 h-4 ${loading.vocabularies ? 'animate-spin' : ''}`} />
            <span className="font-medium">Làm mới</span>
          </button>
          
          <button
            onClick={() => setShowBulkModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 text-violet-600 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl hover:from-violet-100 hover:to-purple-100 transition-all duration-200 border border-violet-200 font-medium"
          >
            <IoCloudUpload className="w-4 h-4" />
            <span>Tải lên hàng loạt</span>
          </button>
          
          <button
            onClick={handleAddVocabulary}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-medium"
          >
            <IoAdd className="w-4 h-4" />
            <span>Thêm từ vựng</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-md border border-indigo-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
              <IoBook className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-700">Tổng từ vựng</p>
              <p className="text-2xl font-bold text-indigo-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl shadow-md border border-emerald-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
              <IoCheckmarkCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700">Đã duyệt</p>
              <p className="text-2xl font-bold text-emerald-800">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl shadow-md border border-amber-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <IoTime className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-700">Chờ duyệt</p>
              <p className="text-2xl font-bold text-amber-800">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl shadow-md border border-violet-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg">
              <RiRobot2Line className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-violet-700">AI tạo</p>
              <p className="text-2xl font-bold text-violet-800">{stats.ai}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl shadow-md border border-rose-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-lg">
              <IoLibrary className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-700">Chủ đề</p>
              <p className="text-2xl font-bold text-rose-800">{stats.topics}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả chủ đề</option>
              {topics.map(topic => (
                <option key={topic.topic_id} value={topic.topic_id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả level</option>
              {['1', '2', '3', '4', '5'].map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>

          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả nguồn</option>
              <option value="ai">AI tạo</option>
              <option value="manual">Thủ công</option>
            </select>
          </div>

          <div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value={12}>12 / trang</option>
              <option value={24}>24 / trang</option>
              <option value={48}>48 / trang</option>
              <option value={96}>96 / trang</option>
            </select>
          </div>
        </div>

        {/* Filter summary */}
        {(searchTerm || selectedTopic !== 'all' || selectedLevel !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || sourceFilter !== 'all') && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-indigo-600">{filteredVocabularies.length}</span> từ vựng
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTopic('all');
                setSelectedLevel('all');
                setTypeFilter('all');
                setStatusFilter('all');
                setSourceFilter('all');
                setCurrentPage(1);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Vocabularies Grid */}
      {currentVocabularies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {currentVocabularies.map((vocabulary) => (
                <VocabularyCard
                  key={vocabulary.vocab_id}
                  vocabulary={vocabulary}
                  onEdit={handleEditVocabulary}
                  onDelete={handleDeleteVocabulary}
                  onView={handleViewVocabulary}
                  onApprove={handleApproveVocabulary}
                  onReject={handleRejectVocabulary}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredVocabularies.length}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-slate-200 rounded-full flex items-center justify-center">
            <IoBook className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {searchTerm || selectedTopic !== 'all' || selectedLevel !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || sourceFilter !== 'all'
              ? 'Không tìm thấy từ vựng nào' 
              : 'Chưa có từ vựng nào'
            }
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {searchTerm || selectedTopic !== 'all' || selectedLevel !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || sourceFilter !== 'all'
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm từ vựng phù hợp' 
              : 'Bắt đầu bằng cách thêm từ vựng đầu tiên hoặc tải lên hàng loạt'
            }
          </p>
          {!searchTerm && selectedTopic === 'all' && selectedLevel === 'all' && typeFilter === 'all' && statusFilter === 'all' && sourceFilter === 'all' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleAddVocabulary}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-medium"
              >
                <IoAdd className="w-4 h-4" />
                <span>Thêm từ vựng đầu tiên</span>
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 text-violet-600 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl hover:from-violet-100 hover:to-purple-100 transition-all duration-200 border border-violet-200 font-medium"
              >
                <IoCloudUpload className="w-4 h-4" />
                <span>Hoặc tải lên hàng loạt</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Form Modal */}
      <VocabularyFormModal
        vocabulary={selectedVocabulary}
        topics={topics}
        isOpen={showVocabModal}
        onClose={() => {
          setShowVocabModal(false);
          setSelectedVocabulary(null);
          setIsEditing(false);
        }}
        onSave={handleSaveVocabulary}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onUpload={handleBulkUpload}
        topics={topics}
      />
    </div>
  );
};

export default Vocabularies;