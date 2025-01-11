function ScrollButton( {direction, onClick }) {
    const isLeft = direction === 'left';

    return (
        <button
            className={`p-2 rounded-full bg-gray-300 hover:bg-gray-400 shadow-md ${isLeft ? 'left-2' : 'right-2'}`}
            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            onClick={onClick}
        >
            {isLeft ? '<' : '>'}
        </button>
    );
}

export default ScrollButton;