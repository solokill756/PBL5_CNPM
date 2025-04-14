// src/api/login.js
export const fetchLogin = async (usernameOrEmail, password) => {
    try {
        // setError(''); // Reset error trước khi gửi request
        const response = await axios.post('/login', 
            { usernameOrEmail, password }, 
            { withCredentials: true } // Gửi cookie nếu có
        );
        
        const { accessToken, user } = response.data;

        setAuth({ user, accessToken }); // Lưu vào context
        navigate('/'); // Chuyển hướng về trang chính sau khi đăng nhập

    } catch (err) {
        if (!err.response) {
            setError('Lỗi mạng, vui lòng thử lại.');
        } else if (err.response.status === 401) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        } else {
            setError('Đăng nhập thất bại, thử lại sau.');
        }
    }
};
