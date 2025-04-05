import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function BlueButton({ name, size, icon, path, loading, isActive, ...props }) {
    return (
        <Link to={path || '#'}>
            <button
                {...props}
                className={`${isActive ? 'bg-red-800 text-white': 'bg-inherit text-red-800'} ${loading == true ? 'opacity-60 cursor-auto' : ''} text-sm flex-row flex justify-center items-center rounded-lg font-semibold ${size}`}
                disabled={loading} 
            >
                {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin size-5" />
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
