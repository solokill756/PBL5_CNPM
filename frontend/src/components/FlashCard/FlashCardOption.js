const FlashCardOption = ({ icon, label, onClick }) => {
    return (
      <button
        className="flex items-center p-4 bg-zinc-100 rounded-lg w-full transition-all duration-300 hover:shadow-[inset_0px_-4px_0px_0px_rgb(252,165,165)]"
        onClick={onClick}
      >
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <span className="font-medium text-gray-800">{label}</span>
        </div>
      </button>
    )
  }
  
  export default FlashCardOption
  