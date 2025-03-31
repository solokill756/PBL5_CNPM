import SearchInput from '@/components/SearchInput';
import UserMenu from '@/components/UserMenu';

const DefaultHeader = () => {
  const [active, setActive] = useState(false);
  const avatarRef = useRef(null);

  // Xử lý click bên ngoài để ẩn popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='sticky top-0 z-50 w-full bg-white h-20 flex items-center justify-center'>
      <div className='flex w-3/4 justify-center'>
        <SearchInput />
      </div>
      <UserMenu />
    </div>
  );
};

export default DefaultHeader;
