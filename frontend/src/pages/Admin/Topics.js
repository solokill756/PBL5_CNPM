import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoAdd,
  IoSearch,
  IoTrash,
  IoEye,
  IoClose,
  IoSave,
  IoLibrary,
  IoBook,
  IoRefresh,
  IoPencil,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTime,
} from "react-icons/io5";
import useAdminStore from "@/store/useAdminStore";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import AdminLayout from "@/components/Admin/AdminLayout";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";
import { RiRobot2Line } from "react-icons/ri";

const TopicFormModal = ({ topic, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      require_level: 1,
      image_url: "",
      total_words: 0,
      points: 0,
      is_show: false,
    });
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (topic) {
        setFormData({
          name: topic.name || "",
          description: topic.description || "",
          require_level: topic.require_level || 1,
          image_url: topic.image_url || "",
          total_words: topic.total_words || 0,
          points: topic.points || 0,
          is_show: topic.is_show || false,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          require_level: 1,
          image_url: "",
          total_words: 0,
          points: 0,
          is_show: false,
        });
      }
    }, [topic]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error("Error saving topic:", error);
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
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {topic ? "Chỉnh sửa chủ đề" : "Thêm chủ đề mới"}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên chủ đề *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập tên chủ đề..."
                  />
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập mô tả chủ đề..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level yêu cầu *
                  </label>
                  <select
                    value={formData.require_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        require_level: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Điểm thưởng *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="5"
                    required
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="50"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số từ vựng
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total_words}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_words: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                  />
                </div>
  
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL hình ảnh
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
  
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Trạng thái hiển thị
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Cho phép hiển thị chủ đề này cho người dùng
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_show}
                        onChange={(e) =>
                          setFormData({ ...formData, is_show: e.target.checked })
                        }
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
                  <span>{loading ? "Đang lưu..." : "Lưu"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

const TopicCard = ({
  topic,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onReject,
}) => {
  const isApproved = topic.is_show;
  const isAISuggested = topic.ai_suggested;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-lg border-2 hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isApproved
          ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
          : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
      }`}
    >
      {/* Header với status badges */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          {isAISuggested && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
              <RiRobot2Line className="w-3 h-3 mr-1" />
              AI
            </span>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isApproved
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200"
                : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200"
            }`}
          >
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
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200">
            Level {topic.require_level}
          </span>
        </div>

        <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
          {topic.image_url ? (
            <img
              src={topic.image_url}
              alt={topic.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <IoLibrary className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {topic.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {topic.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <IoBook className="w-4 h-4" />
            <span className="text-sm font-medium">
              {topic.total_words || 0} từ vựng
            </span>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {new Date(topic.created_at).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Approve/Reject buttons cho chưa duyệt */}
          {!isApproved && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onApprove(topic)}
                className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-md"
              >
                <IoCheckmarkCircle className="w-4 h-4" />
                <span className="text-sm">Duyệt</span>
              </button>

              <button
                onClick={() => onReject(topic)}
                className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-md"
              >
                <IoCloseCircle className="w-4 h-4" />
                <span className="text-sm">Từ chối</span>
              </button>
            </div>
          )}

          {/* Regular action buttons */}
          <div className="flex items-center justify-between space-x-2">
            <button
              onClick={() => onView(topic)}
              className="flex-1 inline-flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200 font-medium"
            >
              <IoEye className="w-4 h-4" />
              <span className="text-sm">Xem</span>
            </button>

            <button
              onClick={() => onEdit(topic)}
              className="px-3 py-2 text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200"
            >
              <IoPencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(topic)}
              className="px-3 py-2 text-red-600 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-200"
            >
              <IoTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Topics = () => {
  const axios = useAxiosPrivate();
  const { addToast } = useToast();
  const {
    topics,
    loading,
    fetchTopics,
    addTopic,
    updateTopic,
    deleteTopic,
    getTopicById,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending
  const [sourceFilter, setSourceFilter] = useState("all"); // all, ai, manual
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      await fetchTopics(axios);
    } catch (error) {
      addToast("Lỗi khi tải danh sách chủ đề", TOAST_TYPES.ERROR);
    }
  };

  const handleAddTopic = () => {
    setSelectedTopic(null);
    setIsEditing(false);
    setShowTopicModal(true);
  };

  const handleEditTopic = async (topic) => {
    try {
      const topicDetail = await getTopicById(axios, topic.topic_id);
      setSelectedTopic(topicDetail);
      setIsEditing(true);
      setShowTopicModal(true);
    } catch (error) {
      addToast("Lỗi khi tải thông tin chủ đề", TOAST_TYPES.ERROR);
    }
  };

  const handleSaveTopic = async (formData) => {
    try {
      if (isEditing && selectedTopic) {
        await updateTopic(axios, selectedTopic.topic_id, formData);
        addToast("Cập nhật chủ đề thành công", TOAST_TYPES.SUCCESS);
      } else {
        await addTopic(axios, formData);
        addToast("Thêm chủ đề thành công", TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      addToast("Lỗi khi lưu chủ đề", TOAST_TYPES.ERROR);
      throw error;
    }
  };

  const handleApproveTopic = async (topic) => {
    try {
      await updateTopic(axios, topic.topic_id, { is_show: true });
      addToast(`Đã duyệt chủ đề "${topic.name}"`, TOAST_TYPES.SUCCESS);
    } catch (error) {
      addToast("Lỗi khi duyệt chủ đề", TOAST_TYPES.ERROR);
    }
  };

  const handleRejectTopic = async (topic) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn từ chối chủ đề "${topic.name}"?`)
    ) {
      try {
        await updateTopic(axios, topic.topic_id, { is_show: false });
        addToast(`Đã từ chối chủ đề "${topic.name}"`, TOAST_TYPES.WARNING);
      } catch (error) {
        addToast("Lỗi khi từ chối chủ đề", TOAST_TYPES.ERROR);
      }
    }
  };

  const handleDeleteTopic = async (topic) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${topic.name}"?`)) {
      try {
        await deleteTopic(axios, topic.topic_id);
        addToast("Xóa chủ đề thành công", TOAST_TYPES.SUCCESS);
      } catch (error) {
        addToast("Lỗi khi xóa chủ đề", TOAST_TYPES.ERROR);
      }
    }
  };

  const handleViewTopic = (topic) => {
    window.open(`/vocabulary/topic/${topic.topic_id}`, "_blank");
  };

  // Filter logic
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && topic.is_show) ||
      (statusFilter === "pending" && !topic.is_show);

    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "ai" && topic.ai_suggested) ||
      (sourceFilter === "manual" && !topic.ai_suggested);

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Statistics
  const stats = {
    total: topics.length,
    approved: topics.filter((t) => t.is_show).length,
    pending: topics.filter((t) => !t.is_show).length,
    ai: topics.filter((t) => t.ai_suggested).length,
  };

  if (loading.topics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={loadTopics}
            disabled={loading.topics}
            className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <IoRefresh
              className={`w-4 h-4 ${loading.topics ? "animate-spin" : ""}`}
            />
            <span className="font-medium">Làm mới</span>
          </button>

          <button
            onClick={handleAddTopic}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
          >
            <IoAdd className="w-4 h-4" />
            <span>Thêm chủ đề</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-3">
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="lg:col-span-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>

          <div className="lg:col-span-1.5">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả nguồn</option>
              <option value="ai">AI tạo</option>
              <option value="manual">Thủ công</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <IoLibrary className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700">Tổng chủ đề</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg border border-green-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <IoCheckmarkCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-800">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl shadow-lg border border-orange-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
              <IoTime className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-700">Chờ duyệt</p>
              <p className="text-2xl font-bold text-orange-800">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-lg border border-purple-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <RiRobot2Line className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-700">AI tạo</p>
              <p className="text-2xl font-bold text-purple-800">{stats.ai}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.topic_id}
            topic={topic}
            onEdit={handleEditTopic}
            onDelete={handleDeleteTopic}
            onView={handleViewTopic}
            onApprove={handleApproveTopic}
            onReject={handleRejectTopic}
          />
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <IoLibrary className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
              ? "Không tìm thấy chủ đề nào"
              : "Chưa có chủ đề nào"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Bắt đầu bằng cách tạo chủ đề đầu tiên"}
          </p>
          {!searchTerm && statusFilter === "all" && sourceFilter === "all" && (
            <button
              onClick={handleAddTopic}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
            >
              <IoAdd className="w-4 h-4" />
              <span>Thêm chủ đề đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* Topic Form Modal */}
      <TopicFormModal
        topic={selectedTopic}
        isOpen={showTopicModal}
        onClose={() => {
          setShowTopicModal(false);
          setSelectedTopic(null);
          setIsEditing(false);
        }}
        onSave={handleSaveTopic}
      />
    </div>
  );
};

export default Topics;
