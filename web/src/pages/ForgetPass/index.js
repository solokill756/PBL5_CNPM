import Header from '@/layouts/Header';
import { ReactComponent as LockIcon } from '@/assets/icons/lock.svg';
import InputBtn from '@/components/InputBox';
import BlueButton from '@/components/BlueButton';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgetPass() {
    const [username, setUsername] = useState('');
    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-96 my-4 border flex flex-col justify-center items-center">
                <div className="my-4">
                    <LockIcon />
                </div>
                <span className="font-semibold mb-2">
                    Bạn gặp sự số khi đăng nhập?
                </span>
                <span className="text-sm px-8 text-center text-gray-500">
                    Nhập email, số điện thoại hoặc tên người dùng của bạn và
                    chúng tôi sẽ gửi cho bạn một liên kết để truy cập lại vào
                    tài khoản.
                </span>
                <div className="my-1">
                    <InputBtn
                        value="Email, điện thoại hoặc tên người dùng"
                        type="text"
                        size="w-72 h-10 rounded-lg"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="my-1">
                    <BlueButton
                        name="Gửi liên kết đăng nhập"
                        size={`w-72 h-10 rounded-lg text-white ${username.length == 0 ? 'opacity-60 cursor-auto' : 'opacity-100 hover:bg-blue-500'}`}
                    />
                </div>
                <div className="flex-row flex my-4 text-sm text-gray-500 font-semibold">
                    <div>HOẶC</div>
                </div>
                <div className="pb-5">
                    <Link to="/register">
                        <span className="text-sm text-gray-600 font-semibold cursor-pointer hover:opacity-70">
                            Tạo tài khoản mới
                        </span>
                    </Link>
                </div>
                <div>
                    <BlueButton
                        name="Quay lại đăng nhập"
                        size={`w-96 h-10 text-sm border rounded-none !bg-gray-50 text-gray-600 hover:opacity-70`}
                        path="/login"
                    />
                </div>
            </div>
        </div>
    );
}

export default ForgetPass;
