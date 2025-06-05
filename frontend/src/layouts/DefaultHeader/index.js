import SearchInput from '@/components/SearchInput';
import UserMenu from '@/components/UserMenu';

const DefaultHeader = () => {
  return (
    <div 
      data-default-header
      className='sticky top-0 z-50 w-full bg-white h-20 flex items-center justify-center transition-transform duration-300'
    >
      <div className='flex w-3/4 justify-center'>
        <SearchInput />
      </div>
      <UserMenu />
    </div>
  );
};

export default DefaultHeader;