import React from 'react';

const BubbleWindow: React.FC = () => {
    const handleClick = () => {
        if (window.electronAPI) {
            window.electronAPI.showMainWindow();
        }
    };

    return (
        <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                 flex items-center justify-center shadow-2xl cursor-pointer 
                 hover:scale-110 active:scale-95 transition-transform duration-200
                 select-none"
            onClick={handleClick}
            style={{
                // @ts-ignore
                WebkitAppRegion: 'drag',
            }}
        >
            <div
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
                style={{
                    // @ts-ignore
                    WebkitAppRegion: 'no-drag'
                }}
            >
                <img
                    src="./logo/chatbot-ai-logo-transparent.png"
                    alt="PC Assistant"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    );
};

export default BubbleWindow;
