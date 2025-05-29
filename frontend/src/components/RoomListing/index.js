import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch, FaTimes, FaUserFriends, FaPlay } from 'react-icons/fa';
import { IoRocketOutline, IoTime, IoTrophy, IoSchool } from 'react-icons/io5';

// Mock data cho các phòng
const mockRooms = [
  {
    id: 'room1',
    name: 'Thuật ngữ CNTT Cơ bản',
    topic: 'Công nghệ thông tin',
    players: 1,
    maxPlayers: 2,
    status: 'waiting', // waiting, playing, finished
    creator: {
      name: 'User123',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    level: 'Dễ',
    createdAt: new Date(Date.now() - 5 * 60000) // 5 phút trước
  },
  {
    id: 'room2',
    name: 'Lập trình N3-N2',
    topic: 'Lập trình',
    players: 2,
    maxPlayers: 2,
    status: 'playing',
    creator: {
      name: 'DevNinja',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    level: 'Trung bình',
    createdAt: new Date(Date.now() - 15 * 60000) // 15 phút trước
  },
  {
    id: 'room3',
    name: 'Thuật ngữ mạng máy tính',
    topic: 'Mạng',
    players: 1,
    maxPlayers: 2,
    status: 'waiting',
    creator: {
      name: 'NetExpert',
      avatar: 'https://i.pravatar.cc/150?img=7'
    },
    level: 'Khó',
    createdAt: new Date(Date.now() - 2 * 60000) // 2 phút trước
  }
];

// Mock topics cho dropdown chọn chủ đề
const mockTopics = [
  { id: 1, name: 'Công nghệ thông tin' },
  { id: 2, name: 'Lập trình' },
  { id: 3, name: 'Mạng máy tính' },
  { id: 4, name: 'Cơ sở dữ liệu' },
  { id: 5, name: 'Trí tuệ nhân tạo' }
];

// Component modal tạo phòng mới
const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Trung bình');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName || !selectedTopic) return;
    
    onCreateRoom({
      name: roomName,
      topic: selectedTopic,
      level: difficultyLevel
    });
    
    // Reset form
    setRoomName('');
    setSelectedTopic('');
    setDifficultyLevel('Trung bình');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tạo phòng đấu mới</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Tên phòng
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập tên phòng"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Chủ đề
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  {mockTopics.map(topic => (
                    <option key={topic.id} value={topic.name}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Mức độ khó
                </label>
                <div className="flex gap-3">
                  {['Dễ', 'Trung bình', 'Khó'].map(level => (
                    <label
                      key={level}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg border ${
                        difficultyLevel === level
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } cursor-pointer transition-colors`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={difficultyLevel === level}
                        onChange={() => setDifficultyLevel(level)}
                        className="sr-only"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
              >
                Tạo phòng
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Card hiển thị phòng
const RoomCard = ({ room, onJoin }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Vừa tạo';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    return `${Math.floor(diffInHours / 24)} ngày trước`;
  };
  
  // Map level to color
  const levelColors = {
    'Dễ': 'bg-green-100 text-green-700',
    'Trung bình': 'bg-yellow-100 text-yellow-700',
    'Khó': 'bg-red-100 text-red-700'
  };
  
  // Map status to UI
  const statusConfig = {
    'waiting': {
      label: 'Đang chờ',
      color: 'text-green-500',
      action: 'Tham gia',
      actionEnabled: true
    },
    'playing': {
      label: 'Đang chơi',
      color: 'text-blue-500',
      action: 'Đang diễn ra',
      actionEnabled: false
    },
    'finished': {
      label: 'Đã kết thúc',
      color: 'text-gray-500',
      action: 'Đã đóng',
      actionEnabled: false
    }
  };
  
  const config = statusConfig[room.status];
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{room.name}</h3>
            <p className="text-gray-500 text-sm">{room.topic}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[room.level]}`}>
            {room.level}
          </span>
        </div>
        
        <div className="flex items-center mb-4 text-sm">
          <div className="flex items-center mr-4">
            <IoTime className="text-gray-400 mr-1" />
            <span className="text-gray-600">{formatTimeAgo(room.createdAt)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaUserFriends className="text-gray-400 mr-1" />
            <span>{room.players}/{room.maxPlayers}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={room.creator.avatar}
              alt={room.creator.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{room.creator.name}</span>
          </div>
          
          <div className={`flex items-center ${config.color}`}>
            <span className="relative flex h-2 w-2 mr-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.status === 'waiting' ? 'bg-green-400' : (room.status === 'playing' ? 'bg-blue-400' : 'bg-gray-400')}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${room.status === 'waiting' ? 'bg-green-500' : (room.status === 'playing' ? 'bg-blue-500' : 'bg-gray-500')}`}></span>
            </span>
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => config.actionEnabled && onJoin(room.id)}
        disabled={!config.actionEnabled}
        className={`w-full py-3 flex items-center justify-center gap-2 font-semibold text-white ${
          config.actionEnabled
            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        } transition-colors`}
      >
        {config.actionEnabled ? <FaPlay className="w-4 h-4" /> : null}
        {config.action}
      </button>
    </motion.div>
  );
};

// Component chính hiển thị danh sách phòng
const RoomListing = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  
  useEffect(() => {
    // Mô phỏng fetch dữ liệu từ API
    setTimeout(() => {
      setRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleCreateRoom = (roomData) => {
    // Trong thực tế sẽ gọi API để tạo phòng và lấy ID phòng từ response
    const roomId = 'new-room-' + Date.now().toString();
    
    // Sau khi tạo phòng thành công, chuyển hướng đến phòng đó
    navigate(`/battle/${roomId}`);
  };
  
  const handleJoinRoom = (roomId) => {
    // Chuyển hướng đến phòng đã chọn
    navigate(`/battle/${roomId}`);
  };
  
  // Lọc phòng theo tìm kiếm và chủ đề
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchQuery === '' || 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = filterTopic === '' || room.topic === filterTopic;
    
    return matchesSearch && matchesTopic;
  });
  
  return (
    <div className="min-h-screen bg-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Phòng đấu từ vựng</h1>
            <p className="text-gray-600">Tham gia hoặc tạo phòng đấu để trải nghiệm chế độ đối kháng</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Tạo phòng mới
          </motion.button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tìm kiếm phòng..."
              />
            </div>
            
            <div className="md:w-64">
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Tất cả chủ đề</option>
                {mockTopics.map(topic => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onJoin={handleJoinRoom}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <IoSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy phòng</h3>
            <p className="text-gray-500 mb-6">
              Không có phòng đấu nào phù hợp với tiêu chí tìm kiếm.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              Tạo phòng mới
            </button>
          </div>
        )}
        
        <div className="mt-16 bg-indigo-900 text-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Tại sao chơi chế độ đối kháng?</h2>
            <p className="text-indigo-200 mb-8">
              Chế độ đối kháng giúp bạn ôn tập từ vựng tiếng Nhật một cách thú vị và hiệu quả, 
              đồng thời xây dựng kỹ năng phản xạ nhanh - điều cần thiết khi giao tiếp thực tế.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-800 rounded-lg p-5">
                <IoRocketOutline className="w-8 h-8 text-indigo-300 mb-3" />
                <h3 className="font-bold text-lg mb-2">Học tập cạnh tranh</h3>
                <p className="text-indigo-200 text-sm">
                  Thi đấu trực tiếp với người khác tạo động lực học tập và ghi nhớ từ vựng tốt hơn.
                </p>
              </div>
              
              <div className="bg-indigo-800 rounded-lg p-5">
                <IoTime className="w-8 h-8 text-indigo-300 mb-3" />
                <h3 className="font-bold text-lg mb-2">Phản xạ nhanh</h3>
                <p className="text-indigo-200 text-sm">
                  Luyện tập phản ứng nhanh với thời gian giới hạn, giúp bạn nhớ và truy xuất từ vựng tức thì.
                </p>
              </div>
              
              <div className="bg-indigo-800 rounded-lg p-5">
                <IoTrophy className="w-8 h-8 text-indigo-300 mb-3" />
                <h3 className="font-bold text-lg mb-2">Phần thưởng hấp dẫn</h3>
                <p className="text-indigo-200 text-sm">
                  Giành huy hiệu và điểm kinh nghiệm để mở khóa nội dung độc quyền và theo dõi tiến độ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default RoomListing;