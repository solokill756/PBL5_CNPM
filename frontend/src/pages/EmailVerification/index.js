import MailImg from "@/assets/images/mail.png";
import BlueButton from "@/components/BlueButton";
import InputBox from "@/components/InputBox";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function EmailVerification() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [code, setCode] = useState("");
  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const disableVerification = code.length < 6;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-96 my-4 border flex flex-col justify-center items-center">
        <div className="my-3">
          <img className="w-24 h-auto" src={MailImg} />
        </div>
        <span className="font-semibold mb-2">Nhập mã xác nhận</span>
        <span className="text-sm px-6 text-center text-gray-500">
          Nhập mã xác nhận mà chúng tôi đã gửi đến địa chỉ { }
          {email}.
        </span>
        <div className="my-1">
          <InputBox
            value="Mã xác nhận"
            type="text"
            size="w-72 h-10 rounded-lg"
            onChange={handleInputChange}
          />
        </div>
        <div className="my-1">
          <BlueButton
            name="Tiếp"
            isActive={"login"}
            size={`w-72 h-10 rounded-lg text-white ${
              code.length < 6
                ? "opacity-60 cursor-auto"
                : "opacity-100 hover:bg-red-900"
            }`}
            disabled={disableVerification}
          />
          <BlueButton
            name="Quay lại"
            size={`w-72 h-10 rounded-lg`}
            path={"/accounts/register"}
          />
        </div>
      </div>
      <div className="w-96 h-16 my-2 items-center justify-center flex-col flex border">
        <div className="text-sm text-gray-600">
          <span>
            Bạn đã có tài khoản?{" "}
            <Link to="/login">
              <button className="text-red-800 font-semibold">Đăng nhập</button>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
