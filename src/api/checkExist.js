export const checkExist = async (type, value) => {
    try {
        const response = await fetch(`http://localhost:3001/users?${type}=${value}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Chuyển đổi dữ liệu thành JSON
        return data.length > 0; // Kiểm tra nếu mảng trả về có phần tử
    } catch (error) {
        console.error('Error checking existence:', error);
        throw error;
    }
};
