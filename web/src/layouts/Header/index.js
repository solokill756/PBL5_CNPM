import { ReactComponent as LogoText } from '@/assets/icons/logotext.svg';
import BlueButton from '@/components/BlueButton';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div>
            <div className="w-screen grid grid-cols-2 py-4 border-b">
                <Link to="#" className="flex justify-center items-center">
                    <LogoText />
                </Link>
                <div className="flex justify-center items-center">
                    <BlueButton
                        name="Đăng nhập"
                        size="h-8 w-28 text-white"
                        path="/login"
                    />
                    <BlueButton
                        name="Đăng ký"
                        size="h-8 w-28 bg-white text-sky-500"
                        path="/register"
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;
