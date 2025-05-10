export const getTimeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
  
    if (diffYears > 0) {
      return `${diffYears} năm`;
    } else if (diffMonths > 0) {
      return `${diffMonths} tháng`;
    } else if (diffDays > 0) {
      return `${diffDays} ngày`;
    } else {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours > 0) {
        return `${diffHours} giờ`;
      } else {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} phút`;
      }
    }
  };