import { Outlet } from 'react-router-dom';

export default function AuthenLayout() {
    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)', height: '100vh' }}>
            {/* Logo/Brand Header */}
            <div className="p-6">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <img
                            src="./logo/chatbot-avatar.png"
                            alt="PC Assistant"
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                                // Fallback if image not found
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                                PC Assistant
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Powered by HPT Technology
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Outlet />
            </div>

            {/* Footer */}
            <div className="p-6">
                <div className="max-w-md mx-auto text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © 2025 HPT Technology. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
