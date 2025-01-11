import { useContext, createContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Giả lập trạng thái đăng nhập (isAuthenticated: true hoặc false)
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    const login = () => {
        console.log("Logged in!");
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log("Logged out!");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
