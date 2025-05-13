import Skeleton from "react-loading-skeleton";

export const LearnSkeleton = () => (
    <div className="w-full">
      <Skeleton 
        height={450} 
        borderRadius={16}
        baseColor="#f5f5f5"
        highlightColor="#ebebeb"
      />
      <div className="flex justify-center gap-8 mt-4">
        <Skeleton 
          height={56} 
          width={180} 
          borderRadius={28}
          baseColor="#f5f5f5"
          highlightColor="#ebebeb"
        />
        <Skeleton 
          height={56} 
          width={180} 
          borderRadius={28}
          baseColor="#f5f5f5"
          highlightColor="#ebebeb"
        />
      </div>
    </div>
  );