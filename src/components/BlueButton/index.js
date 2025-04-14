import { Link } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';

function BlueButton({ name, size, icon, path, loading, isActive, ...props }) {
    return (
        <Link to={path || '#'}>
            <button
                {...props}
                className={`${isActive ? 'bg-red-800 text-white': 'bg-inherit text-red-800'}  text-sm flex-row flex justify-center items-center rounded-lg font-semibold ${size}`}
                // disabled={loading} // Vô hiệu hóa nút khi đang loading
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        {icon && <span className="mx-3">{icon}</span>}
                        <span>{name}</span>
                    </>
                )}
            </button>
        </Link>
    );
}

export default BlueButton;
