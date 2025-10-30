// src/routers/RouterWrapper.tsx
import { BrowserRouter, HashRouter } from 'react-router-dom';
import React from 'react';

// Kiểm tra có phải Electron không
const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI;

type RouterWrapperProps = {
    children: React.ReactNode;
};

export const RouterWrapper: React.FC<RouterWrapperProps> = ({ children }) => {
    if (isElectron) {
        return <HashRouter>{children}</HashRouter>;
    }
    return <BrowserRouter>{children}</BrowserRouter>;
};