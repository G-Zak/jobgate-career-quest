import React from 'react';
import { useLogout } from '../hooks/useLogout';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const LogoutButton = ({ className = '', children, ...props }) => {
 const { handleLogout } = useLogout();

 return (
 <button
 onClick={handleLogout}
 className={`flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-2 text-sm transition-colors ${className}`}
 {...props}
 >
 <ArrowRightOnRectangleIcon className="h-4 w-4" />
 <span>{children || 'Se déconnecter'}</span>
 </button>
 );
};

export default LogoutButton;
