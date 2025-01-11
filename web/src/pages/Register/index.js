import React, { useState } from 'react';
import InputBox from '@/components/InputBox';
import LogoImage from '@/assets/images/logoimg.avif';
import BlueButton from '@/components/BlueButton';
import { ReactComponent as FBIcon } from '@/assets/icons/fb.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function Register() {
    const [fullname, setFullname] = useState('');
    const [phonemail, setPhoneMail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isAuthenticated, login, logout } = useAuth();

    const isRegisterDisabled =
        username.trim() === '' ||
        phonemail.trim() === '' ||
        fullname.trim() === '' ||
        password.length < 8;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-96 h-auto my-3 items-center justify-center flex-col flex border">
                <Link to="#" className="my-6 size-16">
                    <img src={LogoImage} alt="Logo" />
                </Link>
                <span className="mb-2 text-gray-600 text-base font-medium">
                    Đăng ký để xem ảnh và video từ bạn bè.
                </span>
                <div className="my-2">
                    <BlueButton
                        name="Đăng nhập bằng facebook"
                        icon={<FBIcon />}
                        size="w-72 h-9 bg-sky-500 text-white"
                    />
                </div>
                <div className="flex-row flex my-2 text-sm text-gray-500 font-semibold">
                    <div>HOẶC</div>
                </div>
                <div>
                    {/* Input cho Username */}
                    <InputBox
                        value="Số điện thoại hoặc email"
                        type="text"
                        size="w-72 h-10"
                        onChange={(e) => setPhoneMail(e.target.value)}
                    />
                    {/* Input cho Password */}
                    <InputBox
                        value="Mật khẩu"
                        type="password"
                        size="w-72 h-10"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputBox
                        value="Tên đầy đủ"
                        type="text"
                        size="w-72 h-10"
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    <InputBox
                        value="Tên người dùng"
                        type="text"
                        size="w-72 h-10"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <span className="px-14 my-2 text-xs text-gray-500 text-center">
                    Bằng cách đăng ký, bạn đồng ý với{' '}
                    <Link className="text-sky-600">Điều khoản</Link>,
                    <Link className="text-sky-600">
                        {' '}
                        Chính sách quyền riêng tư
                    </Link>{' '}
                    và <Link className="text-sky-600">
                        Chính sách cookie
                    </Link>{' '}
                    của chúng tôi.
                </span>
                <div className="my-2">
                    {/* Nút Đăng nhập */}
                    <BlueButton
                        name="Đăng ký"
                        size={`w-72 h-10 text-white ${
                            isRegisterDisabled
                                ? 'opacity-60'
                                : 'opacity-100 hover:bg-blue-500'
                        }`}
                        onClick={login}
                        disabled={isRegisterDisabled}
                    />
                </div>
                {/* <span className="px-8 my-2 text-sm text-red-500 text-center">
                    Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại
                    mật khẩu.
                </span> */}
            </div>
            <div className="w-96 h-16 my-2 items-center justify-center flex-col flex border">
                <div className="text-sm text-gray-600">
                    <span>
                        Bạn đã có tài khoản?{' '}
                        <Link to="/login">
                            <button className="text-sky-500 font-semibold">
                                Đăng nhập
                            </button>
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;
