import { Avatar } from '../ui/avatar';

function StoryItem({ avatar, username, storyId, status, onClick, ...props }) {

    return (
        <div
            className="flex flex-col justify-center items-center cursor-pointer"
            onClick={onClick}
            {...props}
        >
            <div
                className={`p-0.5 items-center inline-flex justify-center w-[62px] h-[62px] m-1 rounded-full ${
                    status
                        ? 'bg-gray-200'
                        : 'bg-gradient-to-br from-pink-500 to-orange-400'
                }`}
            >
                <Avatar
                    src={avatar}
                    className={`rounded-full size-full border-2 border-solid border-white`}
                />
            </div>
            <span
                className={`text-xs ${status ? 'text-gray-500' : ''} max-w-[60px] block truncate`}
                // style={{
                //     display: 'block', // Bắt buộc để giới hạn width hiệu quả
                //     overflow: 'hidden', // Ẩn nội dung dư thừa
                //     whiteSpace: 'nowrap', // Không xuống dòng
                //     textOverflow: 'ellipsis', // Thêm dấu "..." khi nội dung bị cắt
                // }}
            >
                {username}
            </span>
        </div>
    );
}

export default StoryItem;
