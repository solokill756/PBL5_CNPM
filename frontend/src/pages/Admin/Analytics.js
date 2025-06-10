import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IoTrendingUp,
  IoPeople,
  IoBook,
  IoLibrary,
  IoStatsChart,
  IoCalendar,
  IoDownload,
  IoEye,
  IoEyeOff,
  IoCheckmarkCircle,
  IoCloseCircle
} from "react-icons/io5";
import useAdminStore from "@/store/useAdminStore";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { RiRobot2Line } from "react-icons/ri";

const StatCard = ({ icon: Icon, title, value, change, changeType, color, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {change && (
          <div className="flex items-center mt-2 space-x-1">
            <IoTrendingUp
              className={`w-4 h-4 ${
                changeType === "increase" ? "text-green-500" : "text-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}%
            </span>
            <span className="text-sm text-gray-500">từ tháng trước</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </motion.div>
);

const Analytics = () => {
  const axios = useAxiosPrivate();
  const { loading, fetchDashboardData } = useAdminStore();

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalTopics: 0,
    publishedTopics: 0,
    hiddenTopics: 0,
    totalVocabularies: 0,
    publishedVocabularies: 0,
    hiddenVocabularies: 0,
    aiSuggestedVocabs: 0,
    averageWordsPerTopic: 0,
    averagePointsPerTopic: 0,
    topicsByLevel: {},
    vocabulariesByLevel: {},
    topTopics: [],
    topVocabTopics: [],
    levelDistribution: {},
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await fetchDashboardData(axios);

      // User Analytics
      const totalUsers = data.users.length;
      const activeUsers = data.users.filter(user => !user.is_blocked).length;
      const blockedUsers = data.users.filter(user => user.is_blocked).length;

      // Topic Analytics  
      const totalTopics = data.topics.length;
      const publishedTopics = data.topics.filter(topic => topic.is_show).length;
      const hiddenTopics = data.topics.filter(topic => !topic.is_show).length;

      // Vocabulary Analytics
      const totalVocabularies = data.vocabularies.length;
      const publishedVocabularies = data.vocabularies.filter(vocab => vocab.is_show).length;
      const hiddenVocabularies = data.vocabularies.filter(vocab => !vocab.is_show).length;
      const aiSuggestedVocabs = data.vocabularies.filter(vocab => vocab.ai_suggested).length;

      // Calculate averages
      const averageWordsPerTopic = totalTopics > 0 ? Math.round(totalVocabularies / totalTopics) : 0;
      const averagePointsPerTopic = totalTopics > 0 
        ? Math.round(data.topics.reduce((sum, topic) => sum + (topic.points || 0), 0) / totalTopics) 
        : 0;

      // Group topics by require_level
      const topicsByLevel = data.topics.reduce((acc, topic) => {
        const level = topic.require_level || 1;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      // Group vocabularies by level 
      const vocabulariesByLevel = data.vocabularies.reduce((acc, vocab) => {
        const level = vocab.level || 'N5';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      // Get top topics by total_words
      const topTopics = data.topics
        .filter(topic => topic.total_words > 0)
        .sort((a, b) => (b.total_words || 0) - (a.total_words || 0))
        .slice(0, 5);

      // Count vocabularies per topic for ranking
      const vocabCountPerTopic = data.vocabularies.reduce((acc, vocab) => {
        acc[vocab.topic_id] = (acc[vocab.topic_id] || 0) + 1;
        return acc;
      }, {});

      const topVocabTopics = data.topics
        .map(topic => ({
          ...topic,
          actual_vocab_count: vocabCountPerTopic[topic.topic_id] || 0
        }))
        .sort((a, b) => b.actual_vocab_count - a.actual_vocab_count)
        .slice(0, 5);

      // Level distribution in users (if available)
      const levelDistribution = data.users.reduce((acc, user) => {
        const level = user.current_level || 1;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      setAnalytics({
        totalUsers,
        activeUsers,
        blockedUsers,
        totalTopics,
        publishedTopics,
        hiddenTopics,
        totalVocabularies,
        publishedVocabularies,
        hiddenVocabularies,
        aiSuggestedVocabs,
        averageWordsPerTopic,
        averagePointsPerTopic,
        topicsByLevel,
        vocabulariesByLevel,
        topTopics,
        topVocabTopics,
        levelDistribution,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const exportData = () => {
    const csvData = [
      ["Metric", "Value"],
      ["Total Users", analytics.totalUsers],
      ["Active Users", analytics.activeUsers],
      ["Blocked Users", analytics.blockedUsers],
      ["Total Topics", analytics.totalTopics],
      ["Published Topics", analytics.publishedTopics],
      ["Hidden Topics", analytics.hiddenTopics],
      ["Total Vocabularies", analytics.totalVocabularies],
      ["Published Vocabularies", analytics.publishedVocabularies],
      ["Hidden Vocabularies", analytics.hiddenVocabularies],
      ["AI Suggested Vocabularies", analytics.aiSuggestedVocabs],
      ["Average Words per Topic", analytics.averageWordsPerTopic],
      ["Average Points per Topic", analytics.averagePointsPerTopic],
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const mainStats = [
    {
      icon: IoPeople,
      title: "Tổng người dùng",
      value: analytics.totalUsers,
      subtitle: `${analytics.activeUsers} hoạt động, ${analytics.blockedUsers} bị chặn`,
      change: 12,
      changeType: "increase",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      icon: IoLibrary,
      title: "Chủ đề",
      value: analytics.totalTopics,
      subtitle: `${analytics.publishedTopics} hiển thị, ${analytics.hiddenTopics} ẩn`,
      change: 8,
      changeType: "increase",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      icon: IoBook,
      title: "Từ vựng",
      value: analytics.totalVocabularies,
      subtitle: `${analytics.publishedVocabularies} hiển thị, ${analytics.hiddenVocabularies} ẩn`,
      change: 15,
      changeType: "increase",
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      icon: RiRobot2Line,
      title: "AI tạo",
      value: analytics.aiSuggestedVocabs,
      subtitle: `${Math.round((analytics.aiSuggestedVocabs / analytics.totalVocabularies) * 100) || 0}% tổng từ vựng`,
      change: 25,
      changeType: "increase",
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    },
  ];

  if (loading.users || loading.topics || loading.vocabularies) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thống kê & Phân tích</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hiệu suất hệ thống và người dùng</p>
        </div>
        <button
          onClick={exportData}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm"
        >
          <IoDownload className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topics by Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IoLibrary className="w-5 h-5 text-purple-600" />
            Phân bố chủ đề theo Level
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.topicsByLevel)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Level {level}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${(count / analytics.totalTopics) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vocabularies by Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IoBook className="w-5 h-5 text-orange-600" />
            Phân bố từ vựng theo Level
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.vocabulariesByLevel)
              .sort(([a], [b]) => {
                const order = ['N5', 'N4', 'N3', 'N2', 'N1'];
                return order.indexOf(a) - order.indexOf(b);
              })
              .map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {level}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${(count / analytics.totalVocabularies) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Topics by Word Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IoStatsChart className="w-5 h-5 text-blue-600" />
            Top chủ đề nhiều từ vựng nhất
          </h3>
          <div className="space-y-4">
            {analytics.topVocabTopics.map((topic, index) => (
              <div
                key={topic.topic_id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {topic.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Level {topic.require_level}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{topic.points} điểm</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">
                    {topic.actual_vocab_count}
                  </div>
                  <div className="text-xs text-gray-500">từ vựng</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IoCalendar className="w-5 h-5 text-green-600" />
            Thống kê chi tiết
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IoStatsChart className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Trung bình từ/chủ đề</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {analytics.averageWordsPerTopic}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <IoStatsChart className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Trung bình điểm/chủ đề</span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {analytics.averagePointsPerTopic}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IoPeople className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Tỷ lệ người dùng hoạt động</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {analytics.totalUsers > 0
                  ? Math.round((analytics.activeUsers / analytics.totalUsers) * 100)
                  : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <IoEye className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Tỷ lệ nội dung hiển thị</span>
              </div>
              <span className="text-lg font-bold text-orange-600">
                {analytics.totalTopics + analytics.totalVocabularies > 0
                  ? Math.round(((analytics.publishedTopics + analytics.publishedVocabularies) / 
                    (analytics.totalTopics + analytics.totalVocabularies)) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Status Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái nội dung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center mb-2">
              <IoCheckmarkCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {analytics.publishedTopics + analytics.publishedVocabularies}
            </p>
            <p className="text-sm text-gray-600">Nội dung hiển thị</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <IoEyeOff className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-600">
              {analytics.hiddenTopics + analytics.hiddenVocabularies}
            </p>
            <p className="text-sm text-gray-600">Nội dung ẩn</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center mb-2">
              <RiRobot2Line className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {analytics.aiSuggestedVocabs}
            </p>
            <p className="text-sm text-gray-600">Từ vựng AI tạo</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-100">
            <div className="flex items-center justify-center mb-2">
              <IoCloseCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">
              {analytics.blockedUsers}
            </p>
            <p className="text-sm text-gray-600">Người dùng bị chặn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;