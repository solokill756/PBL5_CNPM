import { FaFire, FaCheckCircle, FaTimesCircle, FaUser, FaUserFriends } from 'react-icons/fa';

// Mô phỏng websocket (trong ứng dụng thực tế, bạn sẽ sử dụng socket.io hoặc các thư viện websocket khác)
export const mockWebSocket = {
  onmessage: null,
  send: (data) => {
    console.log('WebSocket sent:', data);
    // Giả lập phản hồi từ server
    setTimeout(() => {
      if (mockWebSocket.onmessage) {
        // Mô phỏng đối thủ trả lời đúng sau 3-7 giây
        const delay = Math.floor(Math.random() * 4000) + 3000;
        setTimeout(() => {
          const event = {
            data: JSON.stringify({
              type: 'opponent_answer',
              correct: Math.random() > 0.3, // 70% khả năng đối thủ trả lời đúng
              time: delay / 1000,
            })
          };
          mockWebSocket.onmessage(event);
        }, delay);
      }
    }, 100);
  }
};

// Dữ liệu mẫu cho bộ câu hỏi
export const mockQuestions = [
  {
    id: 1,
    term: 'データベース',
    pronunciation: 'でーたべーす',
    definition: 'Cơ sở dữ liệu',
    options: [
      'Cơ sở dữ liệu',
      'Máy chủ',
      'Mạng máy tính',
      'Phần mềm'
    ],
    correctAnswer: 'Cơ sở dữ liệu'
  },
  {
    id: 2,
    term: 'ネットワーク',
    pronunciation: 'ねっとわーく',
    definition: 'Mạng',
    options: [
      'Internet',
      'Mạng',
      'Website',
      'Ứng dụng'
    ],
    correctAnswer: 'Mạng'
  },
  {
    id: 3,
    term: 'サーバー',
    pronunciation: 'さーばー',
    definition: 'Máy chủ',
    options: [
      'Trình duyệt',
      'Máy tính',
      'Máy chủ',
      'Phần cứng'
    ],
    correctAnswer: 'Máy chủ'
  },
  {
    id: 4,
    term: 'プログラミング',
    pronunciation: 'ぷろぐらみんぐ',
    definition: 'Lập trình',
    options: [
      'Thiết kế',
      'Lập trình',
      'Kiểm thử',
      'Phân tích'
    ],
    correctAnswer: 'Lập trình'
  },
  {
    id: 5,
    term: 'アルゴリズム',
    pronunciation: 'あるごりずむ',
    definition: 'Thuật toán',
    options: [
      'Mã nguồn',
      'Biến',
      'Thuật toán',
      'Hàm'
    ],
    correctAnswer: 'Thuật toán'
  }
];

// Dữ liệu giả cho người chơi và đối thủ
export const mockPlayers = {
  player: {
    id: 'p1',
    name: 'Người chơi',
    avatar: 'https://i.pravatar.cc/150?img=11',
    score: 0,
  },
  opponent: {
    id: 'p2',
    name: 'Đối thủ',
    avatar: 'https://i.pravatar.cc/150?img=12',
    score: 0,
  }
};

// Mock data cho chế độ ghép thẻ
export const mockMatchingQuestions = [
  {
    id: 1,
    pairs: [
      { japanese: 'データベース', vietnamese: 'Cơ sở dữ liệu' },
      { japanese: 'ネットワーク', vietnamese: 'Mạng máy tính' },
      { japanese: 'サーバー', vietnamese: 'Máy chủ' },
      { japanese: 'プログラミング', vietnamese: 'Lập trình' }
    ],
    pronunciations: {
      'データベース': 'でーたべーす',
      'ネットワーク': 'ねっとわーく',
      'サーバー': 'さーばー',
      'プログラミング': 'ぷろぐらみんぐ'
    }
  },
  {
    id: 2,
    pairs: [
      { japanese: 'インターネット', vietnamese: 'Internet' },
      { japanese: 'アプリケーション', vietnamese: 'Ứng dụng' },
      { japanese: 'セキュリティ', vietnamese: 'Bảo mật' },
      { japanese: 'クラウド', vietnamese: 'Đám mây' }
    ],
    pronunciations: {
      'インターネット': 'いんたーねっと',
      'アプリケーション': 'あぷりけーしょん',
      'セキュリティ': 'せきゅりてぃ',
      'クラウド': 'くらうど'
    }
  },
  {
    id: 3,
    pairs: [
      { japanese: 'アルゴリズム', vietnamese: 'Thuật toán' },
      { japanese: 'メモリ', vietnamese: 'Bộ nhớ' },
      { japanese: 'ファイル', vietnamese: 'Tập tin' },
      { japanese: 'コード', vietnamese: 'Mã lệnh' }
    ],
    pronunciations: {
      'アルゴリズム': 'あるごりずむ',
      'メモリ': 'めもり',
      'ファイル': 'ふぁいる',
      'コード': 'こーど'
    }
  }
];