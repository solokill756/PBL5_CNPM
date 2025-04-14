import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

function ScrollButton( {direction, onClick }) {
    const isLeft = direction === 'left';

    return (
        <button
            className={`size-10 px-2 border-2 text-2xl text-gray-500 absolute top-1/2 -translate-y-1/2 z-10 rounded-full hover:bg-slate-100 bg-white shadow-md ${isLeft ? '-left-2' : '-right-4'}`}
            onClick={onClick}
        >
            {!isLeft ? <MdNavigateNext /> : <GrFormPrevious />}
        </button>
    );
}

export default ScrollButton;