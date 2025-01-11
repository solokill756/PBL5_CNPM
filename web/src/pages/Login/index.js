import React, { useState } from 'react';
import InputBox from '@/components/InputBox';
import LogoImage from '@/assets/images/logoimg.avif';
import BlueButton from '@/components/BlueButton';
import { ReactComponent as FBIcon } from '@/assets/icons/fb.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isAuthenticated, login, logout } = useAuth();

    const isLoginDisabled = username.trim() === '' || password.length < 8;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-96 h-auto my-3 items-center justify-center flex-col flex border">
                <Link to="#" className="my-6 size-16">
                    <img src={LogoImage} alt="Logo" />
                </Link>
                <div>
                    {/* Input cho Username */}
                    <InputBox
                        value="Số điện thoại, tên người dùng hoặc email"
                        type="text"
                        size="w-72 h-10"
                        onChange={(e) => setUsername(e.target.value)} // Cập nhật username
                    />
                    {/* Input cho Password */}
                    <InputBox
                        value="Mật khẩu"
                        type="password"
                        size="w-72 h-10"
                        onChange={(e) => setPassword(e.target.value)} // Cập nhật password
                    />
                </div>
                <div className="my-2">
                    {/* Nút Đăng nhập */}
                    <BlueButton
                        name="Đăng nhập"
                        size={`w-72 h-10 text-white ${
                            isLoginDisabled
                                ? 'opacity-60'
                                : 'opacity-100 hover:bg-blue-500'
                        }`}
                        onClick={login}
                        disabled={isLoginDisabled}
                    />
                </div>
                <div className="flex-row flex my-2 text-sm text-gray-500 font-semibold">
                    <div>HOẶC</div>
                </div>
                <div className="my-2">
                    <BlueButton
                        name="Đăng nhập bằng facebook"
                        icon={<FBIcon />}
                        size="w-72 bg-white text-sky-500"
                    />
                </div>
                {/* <span className="px-8 my-2 text-sm text-red-500 text-center">
                    Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại
                    mật khẩu.
                </span> */}
                <div className="my-2 pb-3 text-sm cursor-pointer text-gray-600">
                    <Link to="/forgetpass">Quên mật khẩu?</Link>
                </div>
            </div>
            <div className="w-96 h-16 my-2 items-center justify-center flex-col flex border">
                <div className="text-sm text-gray-600">
                    <span>
                        Bạn chưa có tài khoản ư?{' '}
                        <Link to="/register">
                            <button className="text-sky-500 font-semibold">
                                Đăng ký
                            </button>
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
