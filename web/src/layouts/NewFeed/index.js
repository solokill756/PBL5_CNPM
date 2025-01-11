import StoryList from '@/components/Story/StoryList';
function NewFeed() {
    const stories = [
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'John Doe',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            // name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            // name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'John Doe',
            status: true,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'John Doe',
            status: true,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1546881963-ac8d67aee789?q=80&w=2558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'John Doe',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://images.unsplash.com/photo-1663893364107-a6ecd06cf615?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Bob Johnson',
            status: true,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Jane Smith',
            status: false,
        },
        {
            avatar: 'https://via.placeholder.com/150',
            name: 'Bob Johnson',
            status: true,
        },
    ];

    return (
        <div className="h-screen ml-10">
            <StoryList stories={stories} />
        </div> // Add your feed items here as well as a header (e.g., h1) for the feed section.
    );
}

export default NewFeed;
