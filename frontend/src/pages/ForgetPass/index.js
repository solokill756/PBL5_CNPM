import { ReactComponent as LockIcon } from "@/assets/icons/lock.svg";
import BlueButton from "@/components/BlueButton";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import InputBox from "@/components/InputBox";
import { resetPass } from "@/api/resetPass";

function ForgetPass() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const disabledInput = email.length === 0;

  useEffect(() => {
    const emailFromParam = queryParams.get("email");
    if (emailFromParam) {
      setEmail(emailFromParam);
    } 
  }, []);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleInputFocus = () => {
    setError("");
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const success = await resetPass(email);
      if (success) {
        setError("Mật khẩu mới đã được gửi đến email của bạn!");
      } else {
        setError("Không thể gửi mật khẩu mới, vui lòng kiểm tra lại email.");
      } 
    } catch (error) {
      setError("Email không tồn tại hoặc gặp sự cố khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-96 my-4 border flex flex-col justify-center items-center">
        <div className="my-4">
          <LockIcon />
        </div>
        <span className="font-semibold mt-2">Bạn gặp sự số khi đăng nhập?</span>
        <span className="text-sm px-8 text-center text-gray-500">
          Nhập email của bạn và chúng tôi sẽ
          gửi mật khẩu mới để đăng nhập lại vào tài khoản.
        </span>
        <div className="my-1">
          <InputBox
            value="Email"
            type="text"
            size="w-72 h-10 rounded-lg"
            content={email}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <div className="my-1">
          <BlueButton
            name={loading ? '' : 'Gửi mật khẩu mới'}
            isActive={'login'}
            disable={disabledInput}
            size={`w-72 h-10 rounded-lg ${disabledInput || loading ? "opacity-60 cursor-auto" : "opacity-100 hover:bg-red-900"}`}
            onClick={handleSubmit}
            loading={loading}
          />
        </div>
        {error && (
          <span className="px-8 my-2 text-sm font-medium text-red-600 text-center">
            {error} {/* Hiển thị lỗi */}
          </span>
        )}
        <div className="flex-row flex my-4 text-sm text-gray-500 font-semibold">
          <div>HOẶC</div>
        </div>
        <div className="pb-5">
          <Link to="/accounts/register">
            <span className="text-sm text-gray-600 font-semibold cursor-pointer hover:opacity-70">
              Tạo tài khoản mới
            </span>
          </Link>
        </div>
        <div>
          <BlueButton
            name="Quay lại đăng nhập"
            size="w-96 h-10 text-sm border rounded-none !bg-gray-50 text-gray-600 hover:opacity-70"
            path="/accounts/login"
          />
        </div>
      </div>
    </div>
  );
}

export default ForgetPass;
