import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonFlashCardItem = () => (
  <div className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
    <Skeleton width="75%" height={24} />
    <Skeleton width="33%" height={20} borderRadius={999} />
    <div className="flex items-center space-x-3">
      <Skeleton circle width={32} height={32} />
      <Skeleton width="25%" height={16} />
    </div>
  </div>
);
