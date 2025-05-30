import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLevelStore = create(
  persist(
    (set, get) => ({
      userLevel: {
        current_level: 1,
        total_points: 0,
        levelThreshold: 0,
        total_words_mastered: 0,
        total_topics_completed: 0,
        badges: [],
      },

      levelRewards: {
        2: {
          topics: ["Lập trình"],
          badges: ["Beginner Coder"],
          themes: ["Basic Theme"],
        },
        3: {
          topics: ["Mạng máy tính"],
          badges: ["Network Specialist"],
          themes: ["Blue Theme"],
        },
        4: {
          topics: ["Điện toán đám mây"],
          badges: ["Cloud Master"],
          themes: ["Cloud Theme"],
        },
        5: {
          topics: ["AI và Big Data"],
          badges: ["AI Expert"],
          themes: ["Dark Tech Theme"],
        },
      },

      // Lấy thông tin cấp độ
      getLevelInfo: () => {
        const { userLevel } = get();

        const pointsForCurrentLevel = (userLevel.current_level - 1) * userLevel.levelThreshold;
        const pointsForNextLevel = userLevel.current_level * userLevel.levelThreshold;

        const next_level_points = pointsForCurrentLevel + userLevel.levelThreshold;

        // Tính số điểm đã có trong cấp độ hiện tại
        const pointsInCurrentLevel = userLevel.total_points - pointsForCurrentLevel;

        // Tính phần trăm tiến trình (trong khoảng 0-100)
        const progress_percent = Math.min(
          100,
          Math.max(0, Math.round((pointsInCurrentLevel / 500) * 100))
        );

        return {
          ...userLevel,
          next_level_points: next_level_points,
          progress_percent: progress_percent,
        };
      },

      // Kiểm tra xem có đạt đủ điều kiện lên cấp không
      checkLevelUp: () => {
        const { userLevel } = get();
        const pointsForNextLevel = userLevel.level * 500;

        if (userLevel.points >= pointsForNextLevel) {
          // Đủ điểm để lên cấp
          const newLevel = userLevel.level + 1;

          set({
            userLevel: {
              ...userLevel,
              level: newLevel,
            },
          });

          return {
            leveledUp: true,
            newLevel,
            rewards: get().levelRewards[newLevel] || {},
          };
        }

        return { leveledUp: false };
      },

      addPoints: (points) => {
        const { userLevel } = get();

        set({
          userLevel: {
            ...userLevel,
            points: userLevel.points + points,
          },
        });

        return get().checkLevelUp();
      },

      // Cập nhật số từ vựng đã thuộc
      updateMasteredWords: (count) => {
        const { userLevel } = get();

        set({
          userLevel: {
            ...userLevel,
            total_words_mastered: count,
          },
        });

        // Thêm điểm dựa trên số từ mới
        // Có thể thêm logic tính điểm tùy theo yêu cầu
      },

      // Cập nhật số chủ đề đã hoàn thành
      completeTopicProgress: (topicId, progressPercent) => {
        // Logic xử lý khi hoàn thành một phần của chủ đề
        // Nếu progressPercent = 100%, tính là hoàn thành

        if (progressPercent === 100) {
          const { userLevel } = get();

          set({
            userLevel: {
              ...userLevel,
              total_topics_completed: userLevel.total_topics_completed + 1,
            },
          });

          // Thưởng điểm khi hoàn thành chủ đề
          return get().addPoints(100);
        }

        return { leveledUp: false };
      },

      // Lấy reward cho level hiện tại
      getCurrentLevelRewards: () => {
        const { userLevel } = get();
        return get().levelRewards[userLevel.level] || {};
      },

      // Lấy reward cho level tiếp theo
      getNextLevelRewards: () => {
        const { userLevel } = get();
        return get().levelRewards[userLevel.level + 1] || {};
      },

      // Thêm huy hiệu
      addBadge: (badgeName) => {
        const { userLevel } = get();

        if (!userLevel.badges.includes(badgeName)) {
          set({
            userLevel: {
              ...userLevel,
              badges: [...userLevel.badges, badgeName],
            },
          });
        }
      },

      // Fetch level info từ API
      fetchLevelInfo: async (axios, point = 0) => {
        try {
          const response = await axios.get('/api/vocabulary/checkLevelUser', {
            new_points: point,
          });

          const { current_level, total_points, levelThreshold } = response.data;

          set({
            userLevel: {
              current_level: Number(current_level),
              total_points: Number(total_points),
              levelThreshold: Number(levelThreshold),
              total_words_mastered: 0,
              total_topics_completed: 0,
              badges: [],
            }
          });

          return get().getLevelInfo();
        } catch (error) {
          console.error("Error fetching level info:", error);
          throw error;
        }
      },

      updateMasteredWords: (count) => {
        const { userLevel } = get();
      
        set({
          userLevel: {
            ...userLevel,
            total_words_mastered: count,
          }
        });
      },
      
      completeTopicProgress: (axios, progressPercent) => {
        if (progressPercent === 100) {
          const { userLevel } = get();
      
          set({
            userLevel: {
              ...userLevel,
              total_topics_completed: userLevel.total_topics_completed + 1,
            }
          });
      
          return get().fetchLevelInfo(axios, 100); // Add points for completing a topic
        }
      
        return { leveledUp: false };
      },
    }),
    {
      name: "itk-user-level",
      getStorage: () => localStorage,
    }
  )
);

export default useLevelStore;
