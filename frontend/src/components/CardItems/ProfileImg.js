import React, { useRef, useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";

function ProfileImage({ src, onAvatarUploaded }) {
  const inputFileRef = useRef(null);
  const [selectedAvatar, setSelectedAvatar] = useState(src || "");

  useEffect(() => {
    if (src && src.trim() !== "") {
      setSelectedAvatar(src);
    }
  }, [src]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedAvatar(previewUrl);
      onAvatarUploaded(file);
    }
  };

  const handleAddClick = () => {
    inputFileRef.current.click();
  };

  const defaultAvatar = "/path/to/default/avatar.png";

  return (
    <div className="flex-col overflow-hidden mt-2">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 text-left">
        Ảnh hồ sơ
      </h3>
      <div className="flex items-center gap-3">
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden shrink-0">
          <img
            src={
              selectedAvatar && selectedAvatar.trim() !== ""
                ? selectedAvatar
                : defaultAvatar
            }
            alt="Ảnh đại diện"
            className="w-full h-full object-cover"
            key={selectedAvatar || "default"}
          />
        </div>

        <button
          onClick={handleAddClick}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-xl font-medium shrink-0 hover:bg-gray-100"
        >
          <IoMdAdd className="w-10 h-10 text-gray-600 font-medium" />
        </button>

        <input
          type="file"
          ref={inputFileRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default ProfileImage;
