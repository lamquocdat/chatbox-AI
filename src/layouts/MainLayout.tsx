import { ReactNode, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
    children?: ReactNode;
    sidebarContent?: ReactNode;
    sidebarOpen?: boolean;
    onSidebarChange?: (isOpen: boolean) => void;
}

const MainLayout = ({ children, sidebarContent, sidebarOpen, onSidebarChange }: MainLayoutProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            const wasDesktop = !isMobile;
            const isSwitchingToMobile = wasDesktop && mobile;

            // Update mobile state first
            setIsMobile(mobile);

            // If switching to mobile and sidebar is open, animate then close it
            if (isSwitchingToMobile && sidebarOpen && onSidebarChange) {
                setIsAnimating(true);
                // Wait for animation to complete (300ms) before closing
                setTimeout(() => {
                    onSidebarChange(false);
                    setIsAnimating(false);
                }, 300);
            }
        };

        // Listen for resize
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [isMobile, sidebarOpen, onSidebarChange]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar - Dạng 1: Relative positioning với animation */}
            {!isMobile && (
                <aside
                    className="h-full border-r relative transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                        backgroundColor: 'var(--sidebar-bg)',
                        width: sidebarOpen ? '280px' : '0px',
                        minWidth: sidebarOpen ? '280px' : '0px',
                        borderRightWidth: sidebarOpen ? '1px' : '0px',
                    }}
                >
                    <div className="w-[px] h-full">
                        {sidebarContent}
                    </div>
                </aside>
            )}

            {/* Mobile Sidebar - Dạng 2: Fixed positioning với overlay và animation */}
            {isMobile && (
                <>
                    {/* Overlay - fade in/out */}
                    <div
                        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300 ${(sidebarOpen || isAnimating) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => onSidebarChange?.(false)}
                    />

                    {/* Sidebar - slide in/out from left, vẫn render khi đang animate */}
                    <aside
                        className="fixed top-0 left-0 h-full border-r z-40 transition-transform duration-300 ease-in-out"
                        style={{
                            backgroundColor: 'var(--sidebar-bg)',
                            transform: (sidebarOpen || isAnimating) ? 'translateX(0)' : 'translateX(-100%)',
                        }}
                    >
                        <div className="w-[280px] h-full">
                            {sidebarContent}
                        </div>
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden w-full">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default MainLayout;
