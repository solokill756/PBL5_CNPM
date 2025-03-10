import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

function ScrollButton( {direction, onClick }) {
    const isLeft = direction === 'left';

    return (
        <button
            className={`size-7 px-1 text-xl text-gray-500 absolute top-1/2 -translate-y-2/3 z-10 rounded-full bg-white shadow-md ${isLeft ? 'left-5' : 'right-5'}`}
            onClick={onClick}
        >
            {!isLeft ? <MdNavigateNext /> : <GrFormPrevious />}
        </button>
    );
}

export default ScrollButton;