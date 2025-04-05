import React, { useContext, useState } from "react";
import InputBox from "@/components/InputBox";
import LogoIcon from "@/assets/images/LogoIcon.png";
import BlueButton from "@/components/BlueButton";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import AuthContext from "@/context/AuthProvider";
import { fetchLogin } from "@/api/login";
import Cookies from "js-cookie";
import { getOTP } from "@/api/getOTP";
import { getTokens } from "@/helper/tokenService";
import { loginGoogle } from "@/api/loginGoogle";

function Login() {
  const { login } = useContext(AuthContext); // Lấy context để lưu token
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoginDisabled = email.trim() === "" || password.length < 8;

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { user, error } = await fetchLogin(email, password);

      if (error === "unverified") {
        // Điều hướng trước, gửi OTP sau (tránh delay)
        navigate(`/accounts/emailverification?email=${email}`);
        try {
          const response = await getOTP(email);
          if (!response) setError("Email chưa được đăng ký!");
        } catch (otpError) {
          setError("Lỗi xảy ra khi gửi OTP. Vui lòng thử lại.");
        }
        return;
      }

      const { accessToken, refreshToken } = getTokens();
      console.log(accessToken, refreshToken);
      if (!accessToken || !refreshToken) {
        setError("Không nhận được token hợp lệ. Vui lòng thử lại.");
        return;
      }

      login(accessToken, refreshToken, user);
      navigate("/");
    } catch (err) {
      const status = err.response?.status;

      if (!status) {
        setError("Lỗi mạng, vui lòng thử lại.");
      } else if (status === 403) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginGoogle();
      console.log('====================================');
      console.log(user);
      console.log('====================================');
      if (user) {
        const { accessToken, refreshToken } = getTokens();
        console.log(accessToken, refreshToken);
        if (!accessToken || !refreshToken) {
          setError("Không nhận được token hợp lệ. Vui lòng thử lại.");
          return;
        }

        login(accessToken, refreshToken, user);
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-96 h-auto my-3 items-center justify-center flex-col flex border">
        <Link to="#" className="mt-4 w-48">
          <img src={LogoIcon} alt="Logo" />
        </Link>
        <div>
          {/* Input cho Username hoặc Email */}
          <InputBox
            value="Email"
            type="text"
            size="w-72 h-10"
            onChange={(e) => setemail(e.target.value)}
            onClick={() => setError("")}
          />
          {/* Input cho Password */}
          <InputBox
            value="Mật khẩu"
            type="password"
            size="w-72 h-10"
            onChange={(e) => setPassword(e.target.value)}
            onClick={() => setError("")}
          />
        </div>
        <div className="my-2">
          {/* Nút Đăng nhập */}
          <BlueButton
            name={loading ? "" : "Đăng nhập"}
            isActive={"login"}
            size={`w-72 h-10 flex items-center justify-center ${
              isLoginDisabled || loading
                ? "opacity-60 cursor-auto"
                : "opacity-100 hover:bg-red-900"
            }`}
            onClick={handleLogin}
            disabled={isLoginDisabled || loading} // Vô hiệu hóa khi đang loading
            loading={loading}
          />
        </div>
        {error && (
          <span className="px-8 my-2 text-xs text-red-500 text-center">
            {error} {/* Hiển thị lỗi */}
          </span>
        )}
        <div className="flex-row flex my-2 text-sm text-gray-500 font-semibold">
          <div>HOẶC</div>
        </div>
        {/* <div className="my-2">
                    <BlueButton
                        name="Đăng nhập bằng facebook"
                        icon={<FBIcon className='!text-blue-500'/>}
                        size="w-72 !bg-white !text-gray-600"
                    />
                </div> */}

        <div className="my-2">
          <BlueButton
            name="Đăng nhập bằng google"
            icon={<FcGoogle className="size-6 !text-blue-500" />}
            size="w-72 !bg-white !text-gray-600"
            onClick={handleGoogleLogin}
          />
        </div>
        <div className="my-2 pb-3 text-sm cursor-pointer text-gray-600">
          <Link to={`/accounts/forgetpass?email=${email}`}>Quên mật khẩu?</Link>
        </div>
      </div>
      <div className="w-96 h-16 my-2 items-center justify-center flex-col flex border">
        <div className="text-sm text-gray-600">
          <span>
            Bạn chưa có tài khoản ư?{" "}
            <Link to="/accounts/register">
              <button className="text-red-800 font-semibold">Đăng ký</button>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
