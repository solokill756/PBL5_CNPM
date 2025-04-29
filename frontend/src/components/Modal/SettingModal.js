import React, { useMemo } from 'react';
import Modal from '@/components/Modal/Modal';
import { useFlashcardStore } from '@/store/useflashcardStore';
import DropdownDefault from '../DropdownDefault';
import { FaAngleDown } from 'react-icons/fa6';
import ToggleSwitch from '../ToggleSwitch';

const languageOptions = [
  { label: 'Tiếng Nhật', value: true },
  { label: 'Tiếng Việt', value: false },
];

export default function SettingModal() {
  // Hooks always at top
  const isModalOpen = useFlashcardStore(state => state.isModalOpen);
  const modalType = useFlashcardStore(state => state.modalType);
  const closeModal = useFlashcardStore(state => state.closeModal);
  const showFrontFirst = useFlashcardStore(state => state.showFrontFirst);
  const setShowFrontFirst = useFlashcardStore(state => state.setShowFrontFirst);

  // Memoize menu items
  const menuItems = useMemo(() =>
    languageOptions.map(opt => ({
      ...opt,
      onClick: () => {
        if (showFrontFirst !== opt.value) {
          setShowFrontFirst(opt.value);
        }
      },
    })),
    [showFrontFirst, setShowFrontFirst]
  );

  if (modalType !== 'setting') return null;

  // Determine current button label
  const buttonLabel = showFrontFirst ? languageOptions[0].label : languageOptions[1].label;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="max-w-3xl">
      <div className="my-4 !px-4 space-y-6">
        <h2 className="text-3xl pb-4 font-bold">Tùy chọn</h2>

        {/* Chỉ học thuật ngữ có gắn sao */}
        <div className="flex items-center w-full">
          <span className="text-base font-medium">Chỉ học thuật ngữ có gắn sao</span>
          <ToggleSwitch className="flex-1 flex justify-end" />
        </div>
        <hr />

        {/* Mặt trước hiển thị */}
        <div className="flex items-center w-full">
          <span className="text-base font-medium w-[82%]">Mặt trước hiển thị</span>
          <DropdownDefault
            className="flex-1"
            buttonLabel={buttonLabel}
            icon={<FaAngleDown />}
            menu={menuItems}
          />
        </div>
        <hr />

        {/* Text-to-speech */}
        <div className="flex items-center w-full">
          <span className="text-base font-medium">Chuyển văn bản thành giọng nói</span>
          <ToggleSwitch className="flex-1 flex justify-end" />
        </div>
        <hr />

        {/* Reset deck */}
        <button className="text-red-700 hover:text-red-800 text-base font-semibold">
          Khởi động lại thẻ ghi nhớ
        </button>
      </div>
    </Modal>
  );
}
