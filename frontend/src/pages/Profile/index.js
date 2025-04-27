import React from 'react';
import DefaultHeader from "@/layouts/DefaultHeader";
import Card from '@/components/Card/PersonalCard';
import InterfaceCard from '@/components/Card/InterfaceCard';
import Privacy from '@/components/Card/Privacy';
import NotificationCard from '@/components/Card/NotificationCard';

const Profile = () => {
    return (
        <main className='flex flex-1 flex-grow-1 flex-col items-center'>
            <DefaultHeader />
            <div className="flex flex-col items-center w-full mt-4">
                <div className="w-full max-w-4xl px-4">
                    <span className='text-base font-semibold text-gray-600 dark:text-white mb-4'>Thông tin cá nhân</span>
                        <Card />
                </div>
                <div className="w-full max-w-4xl px-4">
                    <span className='text-base font-semibold text-gray-600 dark:text-white mb-4'>Thông báo</span>
                        <NotificationCard />
                </div>
                <div className="w-full max-w-4xl px-4">
                    <span className='text-base font-semibold text-gray-600 dark:text-white mb-4'>Tài khoản và quyền riêng tư</span>
                        <Privacy />
                </div>
                
            </div>
        </main>
    );
};

export default Profile;
