import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { clearTokens, setTokens } from "@/helper/tokenService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = Cookies.get("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  const login = (accessToken, refreshToken, user) => {
    const authData = { accessToken, refreshToken, user };
    setTokens(accessToken, refreshToken);
    setAuth(authData);
    Cookies.set("auth", JSON.stringify(authData));
  };

  const logout = () => {
    clearTokens();
    Cookies.remove("auth");
    setAuth(null);
  };

  useEffect(() => {
    if (!auth) {
      Cookies.remove("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
