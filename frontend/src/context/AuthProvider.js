import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = Cookies.get("auth");
        return savedAuth ? JSON.parse(savedAuth) : null; // Khôi phục auth từ localStorage
    });

    useEffect(() => {
        if (auth) {
            Cookies.set("auth", JSON.stringify(auth)); // Cập nhật localStorage khi auth thay đổi
        } else {
            Cookies.remove("auth"); 
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
