import { Link } from "react-router-dom";

function BlueButton({ name, size, icon, path, ...props }) {
    return (
        <Link to={path || '#'}>
            <button
                {...props}
                className={`bg-sky-500 text-sm flex-row flex justify-center items-center rounded-lg font-semibold ${size}`}
            >
                {icon && <span className="mx-3">{icon}</span>}
                {name}
            </button>
        </Link>
    );
}

export default BlueButton;
