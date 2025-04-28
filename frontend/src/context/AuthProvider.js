import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import defaultAvatar from "@/assets/images/avatar.jpg";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = Cookies.get("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const login = (accessToken, refreshToken, user) => {
    const authData = { accessToken, refreshToken, user };
    if (user.profile_picture === null) {
      user.profile_picture = defaultAvatar;
    }
    setAuth(authData);
    Cookies.set("auth", JSON.stringify(authData));
  };

  const logout = () => {
    Cookies.remove("auth");
    setAuth(null);
  };

  useEffect(() => {
    if (!auth) {
      Cookies.remove("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
