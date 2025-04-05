import Cookies from "js-cookie";

export const setTokens = (accessToken, refreshToken) => {
  Cookies.set("accessToken", accessToken, {
    expires: 1/48, 
    secure: true,
    sameSite: "Strict",
    path: "/", 
  });
  Cookies.set("refreshToken", refreshToken, {
    expires: 7,
    secure: true,
    sameSite: "Strict",
    path: "/",
  });
};

export const getTokens = () => {
  return {
    accessToken: Cookies.get("accessToken"),
    refreshToken: Cookies.get("refreshToken"),
  };
}

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  Cookies.remove("refreshToken");
};
