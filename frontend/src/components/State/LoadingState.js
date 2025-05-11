export const LoadingState = ({ message = "Đang tải..." }) => (
    <div className="flex flex-col items-center justify-center w-full h-64">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl">{message}</p>
    </div>
  );