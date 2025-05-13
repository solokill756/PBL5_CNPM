import Skeleton from "react-loading-skeleton";

export const LearnHeaderSkeleton = () => (
    <>
      <div className="w-full flex justify-between items-center mb-2">
        <Skeleton 
          height={36} 
          width={120} 
          borderRadius={8}
          baseColor="#f5f5f5"
          highlightColor="#ebebeb"  
        />
        <Skeleton 
          height={24} 
          width={80} 
          borderRadius={4}
          baseColor="#f5f5f5"
          highlightColor="#ebebeb"
        />
      </div>
      <Skeleton 
        height={20} 
        width="100%" 
        borderRadius={10}
        baseColor="#f5f5f5"
        highlightColor="#ebebeb"
      />
    </>
  );