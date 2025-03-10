import React from 'react';
import NewFeed from '../../layouts/NewFeed';
import RightSideBar from '../../layouts/RightSideBar';

const Home = () => {
    return (
        <main className="flex flex-1 flex-grow-1 flex-col items-center h-screen">
            <div className="flex justify-center w-full items-stretch flex-row">
                {/* New Feed */}
                <div className="flex-grow flex max-w-2xl justify-center my-2 mx-10">
                    <NewFeed />
                </div>

                {/* Right Sidebar */}
                <div className="flex-1 pl-16 w-96">
                    <RightSideBar />
                </div>
            </div>
        </main>
    );
};

export default Home;
