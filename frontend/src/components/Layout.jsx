import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default Layout;
