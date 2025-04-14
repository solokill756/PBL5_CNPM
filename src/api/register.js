// src/api/register.js
export const fetchRegister = async (fullname, email, username, password) => {
    try {
        const response = await fetch(`http://localhost:3001/users`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const newUser = {
            id: data.length + 1, // Tự động tăng ID
            fullname,
            email,
            username,
            password, // Trong thực tế, bạn nên băm mật khẩu (hash password)
        };

        const createResponse = await fetch(`http://localhost:3001/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        if (!createResponse.ok) {
            throw new Error(
                `Error creating user! status: ${createResponse.status}`
            );
        }

        return newUser; // Trả về thông tin người dùng mới
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};
