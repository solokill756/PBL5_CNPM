import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setTokens } from "@/helper/tokenService";
import { axiosPrivate } from "@/api/axios";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoogleAuth = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const code = query.get("code");

        if (!code) {
          setError("Không có mã xác thực từ Google.");
          navigate("/accounts/login");
          return;
        }

        const response = await axiosPrivate.post("/api/auth/google/callback?code=" + code);
        const data = response.data;

        if (data?.accessToken && data?.refreshToken) {
          setTokens(data.accessToken, data.refreshToken);
          navigate("/");
        } else {
          setError("Token không hợp lệ.");
          navigate("/accounts/login");
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi khi đăng nhập.");
        navigate("/accounts/login");
      }
    };

    fetchGoogleAuth();
  }, [location]);

  return <p>Đang đăng nhập bằng Google...</p>;
};

export default GoogleCallback;
