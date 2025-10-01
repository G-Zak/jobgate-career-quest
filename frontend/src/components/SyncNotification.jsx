import React from 'react';
import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const SyncNotification = ({ status, isSyncing, lastSyncTime, error }) => {
 if (status === 'idle' && !isSyncing) {
 return null;
 }

 const getStatusInfo = () => {
 if (isSyncing || status === 'syncing') {
 return {
 icon: <ArrowPathIcon className="w-4 h-4 animate-spin" />,
 text: 'Synchronisation...',
 className: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
 };
 }

 if (status === 'success') {
 return {
 icon: <CheckIcon className="w-4 h-4" />,
 text: 'Synchronisé avec succès',
 className: 'text-green-600 bg-green-50 dark:bg-green-900/20'
 };
 }

 if (status === 'error') {
 return {
 icon: <XMarkIcon className="w-4 h-4" />,
 text: error || 'Erreur de synchronisation',
 className: 'text-red-600 bg-red-50 dark:bg-red-900/20'
 };
 }

 return null;
 };

 const statusInfo = getStatusInfo();

 if (!statusInfo) return null;

 return (
 <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${statusInfo.className}`}>
 {statusInfo.icon}
 <span className="text-sm font-medium">{statusInfo.text}</span>
 {lastSyncTime && status === 'success' && (
 <span className="text-xs opacity-75">
 ({lastSyncTime.toLocaleTimeString()})
 </span>
 )}
 </div>
 );
};

export default SyncNotification;
