import { useState, useEffect, useCallback } from 'react';
import { profileSyncService } from '../services/profileSyncService';
import { loadUserProfile } from '../utils/profileUtils';

/**
 * Hook personnalisé pour gérer la synchronisation du profil avec les recommandations
 */
export const useProfileSync = () => {
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [syncError, setSyncError] = useState(null);

    /**
     * Synchronise le profil avec le backend
     */
    const syncProfile = useCallback(async (userProfile) => {
        if (isSyncing) {
            console.log('Sync already in progress, skipping...');
            return false;
        }

        setIsSyncing(true);
        setSyncStatus('syncing');
        setSyncError(null);

        try {
            const success = await profileSyncService.syncProfile(userProfile);

            if (success) {
                setSyncStatus('success');
                setLastSyncTime(new Date());
                setSyncError(null);

                // Reset status after 3 seconds
                setTimeout(() => setSyncStatus('idle'), 3000);
                return true;
            } else {
                setSyncStatus('error');
                setSyncError('Échec de la synchronisation');

                // Reset status after 5 seconds
                setTimeout(() => setSyncStatus('idle'), 5000);
                return false;
            }
        } catch (error) {
            console.error('Profile sync error:', error);
            setSyncStatus('error');
            setSyncError(error.message || 'Erreur de synchronisation');

            // Reset status after 5 seconds
            setTimeout(() => setSyncStatus('idle'), 5000);
            return false;
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing]);

    /**
     * Force la synchronisation du profil
     */
    const forceSync = useCallback(async (userProfile) => {
        return await profileSyncService.forceSync(userProfile);
    }, []);

    /**
     * Synchronise automatiquement si nécessaire
     */
    const autoSync = useCallback(async (userProfile) => {
        if (profileSyncService.hasProfileChanged(userProfile)) {
            return await syncProfile(userProfile);
        }
        return true;
    }, [syncProfile]);

    /**
     * Vérifie si le profil a besoin d'être synchronisé
     */
    const needsSync = useCallback((userProfile) => {
        return profileSyncService.hasProfileChanged(userProfile);
    }, []);

    /**
     * Obtient le statut de synchronisation
     */
    const getSyncStatus = useCallback(() => {
        return {
            status: syncStatus,
            isSyncing,
            lastSyncTime,
            error: syncError,
            needsSync: needsSync(loadUserProfile())
        };
    }, [syncStatus, isSyncing, lastSyncTime, syncError, needsSync]);

    return {
        syncStatus,
        isSyncing,
        lastSyncTime,
        syncError,
        syncProfile,
        forceSync,
        autoSync,
        needsSync,
        getSyncStatus
    };
};

export default useProfileSync;
