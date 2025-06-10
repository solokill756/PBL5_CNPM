import { verifyOTP } from "@/api/verifyOTP";
import MailImg from "@/assets/images/mail.png";
import BlueButton from "@/components/BlueButton";
import InputBox from "@/components/InputBox";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getOTP } from "@/api/getOTP";
import { useAuthStore } from "@/store/useAuthStore";

function EmailVerification() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [disabled, setDisabled] = useState(true);

  const login     = useAuthStore(state => state.login);
  const setTokens = useAuthStore(state => state.setTokens);

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const handleInputFocus = () => {
    setError("");
  };

  useEffect(() => {
    const emailFromParam = queryParams.get("email");
    if (emailFromParam) {
      setEmail(emailFromParam);
    } else {
      setError("Không tìm thấy email xác thực.");
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { success, user, accessToken, refreshToken, message } =
        await verifyOTP(code, email);
      if (success) {
        if (!accessToken || !refreshToken) {
          setError("Không nhận được token hợp lệ. Vui lòng thử lại.");
          return;
        }

        login({accessToken, refreshToken, user});
        setTokens({ accessToken, refreshToken });
      } else {
        setError(message);
        setDisabled(false);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      const success = await getOTP(email);
      if (success) {
        setDisabled(true);
      } else {
        setError("Không thể gửi mã xác nhận. Vui lòng thử lại.");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const disableVerification = code.length < 6;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-96 my-4 border flex flex-col justify-center items-center">
        <div className="my-3">
          <img className="w-24 h-auto" alt="" src={MailImg} />
        </div>
        <span className="font-semibold mb-2">Nhập mã xác nhận</span>
        <span className="text-sm px-6 text-center text-gray-500">
          Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ {}
          {email}.
        </span>
        <div className="my-1">
          <InputBox
            value="Mã xác nhận"
            type="text"
            size="w-72 h-10 rounded-lg"
            reSend={handleResend}
            disabled={disabled}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <div className="my-1">
          <BlueButton
            loading={loading}
            name={`${loading ? "" : "Xác nhận"}`}
            isActive={"login"}
            size={`w-72 h-10 rounded-lg text-white ${
              code.length < 6
                ? "opacity-60 cursor-auto"
                : "opacity-100 hover:bg-red-900"
            }`}
            disabled={disableVerification || loading}
            onClick={handleSubmit}
          />
          <BlueButton
            name={`Quay lại`}
            size={`w-72 h-10 rounded-lg`}
            path={"/accounts/register"}
          />
        </div>
        {error && (
          <span className="px-8 mb-2 text-sm font-medium text-red-600 text-center">
            {error} {/* Hiển thị lỗi */}
          </span>
        )}
      </div>
      <div className="w-96 h-16 my-2 items-center justify-center flex-col flex border">
        <div className="text-sm text-gray-600">
          <span>
            Bạn đã có tài khoản?{" "}
            <Link to="/accounts/login">
              <button className="text-red-800 font-semibold">Đăng nhập</button>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
