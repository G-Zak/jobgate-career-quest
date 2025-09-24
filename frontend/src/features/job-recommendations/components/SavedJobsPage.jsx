import React, { useState, useEffect } from 'react';
import {
    BriefcaseIcon,
    MapPinIcon,
    ClockIcon,
    CurrencyDollarIcon,
    BookmarkIcon,
    EyeIcon,
    CheckCircleIcon,
    TagIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../contexts/AuthContext';
import { jobOffers } from '../../../data/jobOffers';
import { mockJobOffers } from '../../../data/mockJobOffers';

const SavedJobsPage = () => {
    const { user } = useAuth();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingJobs, setApplyingJobs] = useState(new Set());
    const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

    // Load saved jobs from localStorage filtered by current user
    useEffect(() => {
        const loadSavedJobs = async () => {
            setLoading(true);
            try {
                if (!user?.id) {
                    console.warn('No user ID available, cannot load saved jobs');
                    setSavedJobs([]);
                    return;
                }

                // Get saved jobs for the current user only
                const userSavedJobsKey = `savedJobs_${user.id}`;
                const userSavedJobDataKey = `savedJobData_${user.id}`;
                const userSavedJobsFallbackKey = `savedJobsFallback_${user.id}`;

                const savedJobIds = JSON.parse(localStorage.getItem(userSavedJobsKey) || '[]');
                const fallbackJobIds = JSON.parse(localStorage.getItem(userSavedJobsFallbackKey) || '[]');
                const savedJobData = JSON.parse(localStorage.getItem(userSavedJobDataKey) || '[]');

                // Merge API and fallback job IDs
                const allSavedJobIds = [...new Set([...savedJobIds, ...fallbackJobIds])];

                // If no saved jobs for this user, return empty array
                if (allSavedJobIds.length === 0) {
                    setSavedJobs([]);
                    return;
                }

                // Use only localStorage for saved jobs (no API calls)
                console.log('📋 Loading saved jobs from localStorage only');

                // Fallback to localStorage with user-specific filtering and fallback merging
                // Merge job sources and remove duplicates by ID (mockJobOffers takes priority)
                const allJobs = [...jobOffers, ...mockJobOffers];
                const uniqueJobs = allJobs.reduce((acc, job) => {
                    if (!acc.find(existingJob => existingJob.id === job.id)) {
                        acc.push(job);
                    }
                    return acc;
                }, []);

                const savedJobsData = uniqueJobs.filter(job => allSavedJobIds.includes(job.id)).map((job, index) => {
                    const savedData = savedJobData.find(data => data.jobId === job.id);
                    return {
                        ...job,
                        savedDate: savedData?.savedDate || new Date().toISOString(),
                        uniqueKey: `${job.id}_${index}_${job.company || 'unknown'}` // Create unique key
                    };
                });

                console.log(`📋 Loaded ${savedJobsData.length} saved jobs for user ${user.id} (${savedJobIds.length} from API, ${fallbackJobIds.length} from fallback)`);
                setSavedJobs(savedJobsData);
            } catch (error) {
                console.error('Error loading saved jobs:', error);
                setSavedJobs([]);
            } finally {
                setLoading(false);
            }
        };

        loadSavedJobs();

        // Listen for storage changes to update when jobs are saved/unsaved from other pages
        const handleStorageChange = (e) => {
            const userSavedJobsKey = `savedJobs_${user?.id}`;
            const userSavedJobDataKey = `savedJobData_${user?.id}`;

            if (e.key === userSavedJobsKey || e.key === userSavedJobDataKey) {
                loadSavedJobs();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events for same-tab updates
        const handleCustomStorageChange = () => {
            loadSavedJobs();
        };

        window.addEventListener('savedJobsUpdated', handleCustomStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('savedJobsUpdated', handleCustomStorageChange);
        };
    }, [user?.id]);

    const handleRemoveFromSaved = async (jobId) => {
        if (!user?.id) {
            console.warn('No user ID available, cannot remove saved job');
            return;
        }

        const newSavedJobs = savedJobs.filter(job => job.id !== jobId);
        setSavedJobs(newSavedJobs);

        // Update user-specific localStorage
        const userSavedJobsKey = `savedJobs_${user.id}`;
        const userSavedJobDataKey = `savedJobData_${user.id}`;
        const userSavedJobsFallbackKey = `savedJobsFallback_${user.id}`;

        const savedJobIds = newSavedJobs.map(job => job.id);
        localStorage.setItem(userSavedJobsKey, JSON.stringify(savedJobIds));

        // Also remove from savedJobData
        const savedJobData = JSON.parse(localStorage.getItem(userSavedJobDataKey) || '[]');
        const updatedSavedJobData = savedJobData.filter(data => data.jobId !== jobId);
        localStorage.setItem(userSavedJobDataKey, JSON.stringify(updatedSavedJobData));

        // Also remove from fallback
        const fallbackJobs = JSON.parse(localStorage.getItem(userSavedJobsFallbackKey) || '[]');
        const updatedFallbackJobs = fallbackJobs.filter(id => id !== jobId);
        localStorage.setItem(userSavedJobsFallbackKey, JSON.stringify(updatedFallbackJobs));

        // Using localStorage only - no API calls needed
        console.log(`✅ Job ${jobId} removed from saved jobs (localStorage only)`);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('savedJobsUpdated'));
    };

    const handleApplyToJob = async (jobId) => {
        setApplyingJobs(prev => new Set(prev).add(jobId));
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update local state
            const newAppliedJobs = new Set(JSON.parse(localStorage.getItem('appliedJobs') || '[]'));
            newAppliedJobs.add(jobId);
            localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));

            // Update job status
            setSavedJobs(prev => prev.map(job =>
                job.id === jobId ? { ...job, status: 'applied' } : job
            ));
        } catch (error) {
            console.error('Error applying to job:', error);
        } finally {
            setApplyingJobs(prev => {
                const newSet = new Set(prev);
                newSet.delete(jobId);
                return newSet;
            });
        }
    };

    const toggleDescription = (jobId) => {
        const newExpanded = new Set(expandedDescriptions);
        if (newExpanded.has(jobId)) {
            newExpanded.delete(jobId);
        } else {
            newExpanded.add(jobId);
        }
        setExpandedDescriptions(newExpanded);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Chargement des offres sauvegardées...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Offres sauvegardées
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {savedJobs.length} offre{savedJobs.length !== 1 ? 's' : ''} sauvegardée{savedJobs.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Saved Jobs List */}
                {savedJobs.length > 0 ? (
                    <div className="space-y-6">
                        {savedJobs.map((job) => {
                            const isApplying = applyingJobs.has(job.id);

                            return (
                                <div
                                    key={job.uniqueKey || `${job.id}_${job.company || 'unknown'}`}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4 flex-1">
                                            {/* Company Avatar */}
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                                                <span className="text-white font-semibold text-sm">
                                                    {job.company?.charAt(0).toUpperCase() || 'C'}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-3">
                                                    {job.company}
                                                </p>

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPinIcon className="w-4 h-4" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        <span>{job.type}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <CurrencyDollarIcon className="w-4 h-4" />
                                                        <span>{job.salary}</span>
                                                    </div>
                                                    {job.experience && (
                                                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                                                            {job.experience}
                                                        </span>
                                                    )}
                                                    {job.remote && (
                                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                                                            Télétravail
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleRemoveFromSaved(job.id)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                                title="Retirer des sauvegardes"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed ${!expandedDescriptions.has(job.id) ? 'line-clamp-2' : ''
                                            }`}>
                                            {job.description}
                                        </p>
                                        {job.description && job.description.length > 150 && (
                                            <button
                                                onClick={() => toggleDescription(job.id)}
                                                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                            >
                                                {expandedDescriptions.has(job.id) ? 'Voir moins' : 'Voir plus'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {job.tags && job.tags.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex flex-wrap gap-2">
                                                {job.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                                                    >
                                                        <TagIcon className="w-3 h-3 mr-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Sauvegardé le {new Date(job.savedDate).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                                Voir détails
                                            </button>
                                            <button
                                                onClick={() => handleApplyToJob(job.id)}
                                                disabled={isApplying || job.status === 'applied'}
                                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${job.status === 'applied'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 cursor-default'
                                                    : isApplying
                                                        ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {isApplying ? (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Candidature...</span>
                                                    </div>
                                                ) : job.status === 'applied' ? (
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                        <span>Candidature envoyée</span>
                                                    </div>
                                                ) : (
                                                    'Postuler'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                        <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune offre sauvegardée</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Commencez à sauvegarder des offres qui vous intéressent.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobsPage;
