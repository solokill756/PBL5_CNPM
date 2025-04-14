import LogoImage from '@/assets/images/ITKotoba.png';
import BlueButton from '@/components/BlueButton';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [activeButton, setActiveButton] = useState('login');

    return (
        <div>
            <div className="w-screen grid grid-cols-2 py-4 border-b bg-zinc-50">
                <Link to="#" className="flex justify-center items-center">
                    <img className='w-40' src={LogoImage} alt=''/>
                </Link>
                <div className="flex justify-center items-center">
                    <BlueButton
                        name="Đăng nhập"
                        size="h-8 w-28"
                        path="/accounts/login"
                        isActive={activeButton === 'login'}
                        onClick={() => setActiveButton('login')}
                    />
                    <BlueButton
                        name="Đăng ký"
                        size="h-8 w-28"
                        path="/accounts/register"
                        isActive={activeButton === 'register'}
                        onClick={() => setActiveButton('register')}
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;
