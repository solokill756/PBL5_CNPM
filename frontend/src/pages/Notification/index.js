import React from "react";
import DefaultHeader from "@/layouts/DefaultHeader";
import NotificationCard from "@/components/NotificationCard";

const NotificationPage = () => {
  return (
    <main className="flex flex-1 flex-grow-1 flex-col items-center">
      <DefaultHeader />
      <div className="flex flex-col items-center w-full mt-4">
        <div className="w-full max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold text-red-800 dark:text-white mb-4 mt-6">
            Thông báo
          </h1>
          <NotificationCard/>
        </div>   
      </div>
    </main>
  );
};
export default NotificationPage;