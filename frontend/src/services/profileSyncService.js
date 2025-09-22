/**
 * Service de synchronisation du profil utilisateur avec le système de recommandations
 */

import recommendationApi from './recommendationApi';

class ProfileSyncService {
    constructor() {
        this.syncInProgress = false;
        this.lastSyncTime = null;
    }

    /**
     * Synchronise le profil utilisateur avec le backend
     * @param {Object} userProfile - Le profil utilisateur complet
     * @returns {Promise<boolean>} - Succès de la synchronisation
     */
    async syncProfile(userProfile) {
        if (this.syncInProgress) {
            console.log('Sync already in progress, skipping...');
            return false;
        }

        this.syncInProgress = true;

        try {
            console.log('🔄 Starting profile sync...', userProfile);

            // Extraire les compétences du profil
            const skills = this.extractSkillsFromProfile(userProfile);

            // Mettre à jour les recommandations avec les nouvelles compétences
            const recommendations = await recommendationApi.getRecommendations({
                limit: 10,
                min_score: 50,
                user_profile: userProfile
            });

            // Mettre à jour l'analyse des compétences
            const skillsAnalysis = await recommendationApi.getUserSkillsAnalysis();

            this.lastSyncTime = new Date();

            console.log('✅ Profile sync completed successfully');
            console.log('📊 Recommendations updated:', recommendations.length);
            console.log('🎯 Skills analysis updated:', skillsAnalysis);

            return true;

        } catch (error) {
            console.error('❌ Profile sync failed:', error);
            return false;
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Extrait les compétences du profil utilisateur
     * @param {Object} userProfile - Le profil utilisateur
     * @returns {Array} - Liste des compétences
     */
    extractSkillsFromProfile(userProfile) {
        let skills = [];

        // Extraire des skillsWithProficiency si disponible
        if (userProfile.skillsWithProficiency && userProfile.skillsWithProficiency.length > 0) {
            skills = userProfile.skillsWithProficiency.map(skill => skill.name);
        }
        // Sinon, utiliser le tableau skills simple
        else if (userProfile.skills && userProfile.skills.length > 0) {
            skills = userProfile.skills;
        }

        return skills;
    }

    /**
     * Vérifie si le profil a été modifié depuis la dernière synchronisation
     * @param {Object} userProfile - Le profil utilisateur
     * @returns {boolean} - True si le profil a été modifié
     */
    hasProfileChanged(userProfile) {
        if (!this.lastSyncTime) return true;

        const profileUpdateTime = new Date(userProfile.updatedAt);
        return profileUpdateTime > this.lastSyncTime;
    }

    /**
     * Force la synchronisation du profil
     * @param {Object} userProfile - Le profil utilisateur
     * @returns {Promise<boolean>} - Succès de la synchronisation
     */
    async forceSync(userProfile) {
        this.lastSyncTime = null; // Reset pour forcer la sync
        return await this.syncProfile(userProfile);
    }

    /**
     * Synchronise automatiquement si nécessaire
     * @param {Object} userProfile - Le profil utilisateur
     * @returns {Promise<boolean>} - Succès de la synchronisation
     */
    async autoSync(userProfile) {
        if (this.hasProfileChanged(userProfile)) {
            return await this.syncProfile(userProfile);
        }
        return true; // Pas de sync nécessaire
    }

    /**
     * Obtient le statut de la synchronisation
     * @returns {Object} - Statut de la synchronisation
     */
    getSyncStatus() {
        return {
            inProgress: this.syncInProgress,
            lastSyncTime: this.lastSyncTime,
            needsSync: this.lastSyncTime === null
        };
    }
}

// Instance singleton
export const profileSyncService = new ProfileSyncService();
export default profileSyncService;
