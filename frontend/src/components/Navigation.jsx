import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
 Bars3Icon,
 XMarkIcon,
 UserIcon,
 Cog6ToothIcon,
 ArrowRightOnRectangleIcon,
 SunIcon,
 MoonIcon,
 HomeIcon,
 BriefcaseIcon,
 ChartBarIcon,
 UserGroupIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
 const { user, isAuthenticated, logout } = useAuth();
 const { isDarkMode, toggleDarkMode } = useDarkMode();
 const navigate = useNavigate();
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

 const handleLogout = () => {
 const result = logout();
 if (result.success) {
 navigate('/login');
 }
 setIsProfileMenuOpen(false);
 };

 const navigationItems = [
 { name: 'Accueil', href: '/', icon: HomeIcon },
 { name: 'Offres d\'emploi', href: '/jobs', icon: BriefcaseIcon },
 { name: 'Tableau de bord', href: '/dashboard', icon: ChartBarIcon },
 { name: 'Profil', href: '/profile', icon: UserIcon },
 ];

 return (
 <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between h-16">
 {/* Logo and brand */}
 <div className="flex items-center">
 <Link to="/" className="flex-shrink-0 flex items-center group">
 <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-200">
 <BriefcaseIcon className="h-6 w-6 text-white" />
 </div>
 <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
 JobGate
 </span>
 </Link>
 </div>

 {/* Desktop navigation */}
 <div className="hidden md:flex items-center space-x-1">
 {navigationItems.map((item) => (
 <Link
 key={item.name}
 to={item.href}
 className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
 >
 <item.icon className="h-4 w-4" />
 <span>{item.name}</span>
 </Link>
 ))}
 </div>

 {/* Right side items */}
 <div className="flex items-center space-x-4">
 {/* Dark mode toggle */}
 <button
 onClick={toggleDarkMode}
 className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
 >
 {isDarkMode ? (
 <SunIcon className="h-5 w-5" />
 ) : (
 <MoonIcon className="h-5 w-5" />
 )}
 </button>

 {/* User menu */}
 {isAuthenticated ? (
 <div className="relative">
 <button
 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
 className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
 >
 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
 </div>
 <div className="hidden md:block text-left">
 <div className="text-sm font-medium text-gray-900 dark:text-white">
 {user?.name || 'Utilisateur'}
 </div>
 <div className="text-xs text-gray-500 dark:text-gray-400">
 {user?.email || 'user@example.com'}
 </div>
 </div>
 </button>

 {/* Profile dropdown */}
 {isProfileMenuOpen && (
 <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
 <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
 <p className="text-sm font-medium text-gray-900 dark:text-white">
 {user?.name || 'Utilisateur'}
 </p>
 <p className="text-sm text-gray-500 dark:text-gray-400">
 {user?.email || 'user@example.com'}
 </p>
 </div>
 <div className="py-1">
 <Link
 to="/profile"
 className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
 onClick={() => setIsProfileMenuOpen(false)}
 >
 <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
 Mon profil
 </Link>
 <Link
 to="/settings"
 className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
 onClick={() => setIsProfileMenuOpen(false)}
 >
 <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-400" />
 Paramètres
 </Link>
 </div>
 <div className="border-t border-gray-200 dark:border-gray-700 py-1">
 <button
 onClick={handleLogout}
 className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
 >
 <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
 Se déconnecter
 </button>
 </div>
 </div>
 )}
 </div>
 ) : (
 <div className="flex items-center space-x-2">
 <Link
 to="/login"
 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
 >
 Se connecter
 </Link>
 <Link
 to="/register"
 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
 >
 S'inscrire
 </Link>
 </div>
 )}

 {/* Mobile menu button */}
 <div className="md:hidden">
 <button
 onClick={() => setIsMenuOpen(!isMenuOpen)}
 className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2"
 >
 {isMenuOpen ? (
 <XMarkIcon className="h-6 w-6" />
 ) : (
 <Bars3Icon className="h-6 w-6" />
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Mobile menu */}
 {isMenuOpen && (
 <div className="md:hidden">
 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
 {navigationItems.map((item) => (
 <Link
 key={item.name}
 to={item.href}
 className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
 onClick={() => setIsMenuOpen(false)}
 >
 <item.icon className="h-5 w-5" />
 <span>{item.name}</span>
 </Link>
 ))}
 </div>
 </div>
 )}
 </div>
 </nav>
 );
};

export default Navigation;
