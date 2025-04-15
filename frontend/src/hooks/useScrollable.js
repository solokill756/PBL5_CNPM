import { useState, useEffect, useLayoutEffect } from "react";

const useScrollable = ({
  scrollRef,
  itemsToScroll = 2, // số item cần scroll mỗi lần
  scrollBehavior = "smooth",
  offset = 5, // sai số nhỏ tránh lỗi làm tròn
}) => {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const updateButtonVisibility = () => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setIsLeftVisible(scrollLeft > offset);
    setIsRightVisible(scrollLeft + clientWidth < scrollWidth - offset);
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    // Chọn lấy phần tử đầu tiên, giả sử các item có chung class tên "scrollable-item"
    const item = container.querySelector(".scrollable-item");
    if (!item) return;

    // Tính toán kích thước item (bao gồm margin)
    const itemRect = item.getBoundingClientRect();
    let itemWidth = itemRect.width;
    const itemStyle = window.getComputedStyle(item);
    const marginRight = parseFloat(itemStyle.marginRight) || 0;
    itemWidth += marginRight;
    
    const totalScrollDistance = itemWidth * itemsToScroll;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - totalScrollDistance
        : container.scrollLeft + totalScrollDistance;

    container.scrollTo({
      left: newScrollLeft,
      behavior: scrollBehavior,
    });
  };

  // Cập nhật trạng thái khi scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateButtonVisibility);
    updateButtonVisibility();
    return () => container.removeEventListener("scroll", updateButtonVisibility);
  }, [scrollRef]);

  // Sử dụng useLayoutEffect để cập nhật ngay khi container thay đổi kích thước
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container || !window.ResizeObserver) return;
    const observer = new ResizeObserver(() => {
      // Tính toán lại currentIndex dựa trên kích thước item
      const item = container.querySelector(".scrollable-item");
      if (!item) return;
      const itemRect = item.getBoundingClientRect();
      let itemWidth = itemRect.width;
      const itemStyle = window.getComputedStyle(item);
      const marginRight = parseFloat(itemStyle.marginRight) || 0;
      itemWidth += marginRight;

      const currentIndex = Math.round(container.scrollLeft / itemWidth);
      container.scrollLeft = currentIndex * itemWidth;
      updateButtonVisibility();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [scrollRef]);

  return { isLeftVisible, isRightVisible, handleScroll, updateButtonVisibility };
};

export default useScrollable;
