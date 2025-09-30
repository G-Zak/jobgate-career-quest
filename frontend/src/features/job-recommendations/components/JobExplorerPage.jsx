import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    MapPinIcon,
    BriefcaseIcon,
    CurrencyDollarIcon,
    FunnelIcon,
    XMarkIcon,
    StarIcon,
    TagIcon,
    ClockIcon,
    BookmarkIcon,
    HeartIcon,
    EyeIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../../contexts/AuthContext';
import { jobOffers } from '../../../data/jobOffers';
import { mockJobOffers } from '../../../data/mockJobOffers';

const JobExplorerPage = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [likedJobs, setLikedJobs] = useState(new Set());
    const [applyingJobs, setApplyingJobs] = useState(new Set());
    const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

    // Search and filter state
    const [searchParams, setSearchParams] = useState({
        q: '',
        location: '',
        job_type: '',
        seniority: '',
        remote: false,
        min_salary: '',
        max_salary: '',
        skills: []
    });

    const [showFilters, setShowFilters] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Available options for filters
    const jobTypes = [
        { value: 'CDI', label: 'CDI' },
        { value: 'CDD', label: 'CDD' },
        { value: 'Stage', label: 'Stage' },
        { value: 'Freelance', label: 'Freelance' },
        { value: 'Alternance', label: 'Alternance' },
        { value: 'Temps partiel', label: 'Temps partiel' }
    ];

    const seniorityLevels = [
        { value: 'junior', label: 'Junior (0-2 ans)' },
        { value: 'mid', label: 'Mid-level (2-5 ans)' },
        { value: 'senior', label: 'Senior (5-10 ans)' },
        { value: 'lead', label: 'Lead/Expert (10+ ans)' }
    ];

    const commonSkills = [
        'Python', 'JavaScript', 'React', 'Django', 'Node.js', 'Vue.js', 'Angular',
        'Java', 'PHP', 'C#', 'C++', 'Go', 'Rust', 'TypeScript', 'HTML', 'CSS',
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
        'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'DevOps', 'Machine Learning'
    ];

    // Load jobs on component mount
    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                // Combine job offers and mock data
                const allJobs = [...jobOffers, ...mockJobOffers].filter(job => job.status === 'active');
                setJobs(allJobs);
            } catch (error) {
                console.error('Error loading jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    // Load saved jobs from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedJobs');
        if (saved) {
            try {
                setSavedJobs(new Set(JSON.parse(saved)));
            } catch (error) {
                console.error('Error loading saved jobs:', error);
            }
        }
    }, []);

    // Save jobs to localStorage
    const saveJobsToStorage = (jobs) => {
        try {
            localStorage.setItem('savedJobs', JSON.stringify([...jobs]));
        } catch (error) {
            console.error('Error saving jobs:', error);
        }
    };

    const handleSaveJob = async (jobId) => {
        // Get user ID from auth context or fallback
        const currentUserId = user?.id || 1; // Default to 1 if no user found

        if (!currentUserId) {
            console.warn('No user ID available, cannot save job');
            return;
        }

        const newSavedJobs = new Set(savedJobs);
        const isCurrentlySaved = newSavedJobs.has(jobId);

        // Use user-specific keys
        const userSavedJobsKey = `savedJobs_${currentUserId}`;
        const userSavedJobDataKey = `savedJobData_${currentUserId}`;

        if (isCurrentlySaved) {
            newSavedJobs.delete(jobId);
            // Remove from savedJobData when unsaving
            const savedJobData = JSON.parse(localStorage.getItem(userSavedJobDataKey) || '[]');
            const updatedSavedJobData = savedJobData.filter(data => data.jobId !== jobId);
            localStorage.setItem(userSavedJobDataKey, JSON.stringify(updatedSavedJobData));
        } else {
            newSavedJobs.add(jobId);
            // Add to savedJobData when saving
            const savedJobData = JSON.parse(localStorage.getItem(userSavedJobDataKey) || '[]');
            const existingIndex = savedJobData.findIndex(data => data.jobId === jobId);
            const newSavedJobData = {
                jobId,
                savedDate: new Date().toISOString()
            };

            if (existingIndex >= 0) {
                savedJobData[existingIndex] = newSavedJobData;
            } else {
                savedJobData.push(newSavedJobData);
            }
            localStorage.setItem(userSavedJobDataKey, JSON.stringify(savedJobData));
        }

        setSavedJobs(newSavedJobs);

        // Update user-specific localStorage
        localStorage.setItem(userSavedJobsKey, JSON.stringify([...newSavedJobs]));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('savedJobsUpdated'));
    };

    const handleLikeJob = (jobId) => {
        const newLikedJobs = new Set(likedJobs);
        if (newLikedJobs.has(jobId)) {
            newLikedJobs.delete(jobId);
        } else {
            newLikedJobs.add(jobId);
        }
        setLikedJobs(newLikedJobs);
        localStorage.setItem('likedJobs', JSON.stringify([...newLikedJobs]));
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
            setJobs(prev => prev.map(job =>
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

    const handleSearch = () => {
        // Filter jobs based on search parameters
        let filteredJobs = [...jobOffers, ...mockJobOffers].filter(job => job.status === 'active');

        if (searchParams.q) {
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(searchParams.q.toLowerCase()) ||
                job.company.toLowerCase().includes(searchParams.q.toLowerCase()) ||
                job.description.toLowerCase().includes(searchParams.q.toLowerCase())
            );
        }

        if (searchParams.location) {
            filteredJobs = filteredJobs.filter(job =>
                job.location.toLowerCase().includes(searchParams.location.toLowerCase())
            );
        }

        if (searchParams.job_type) {
            filteredJobs = filteredJobs.filter(job => job.type === searchParams.job_type);
        }

        if (searchParams.seniority) {
            filteredJobs = filteredJobs.filter(job =>
                job.experience.toLowerCase().includes(searchParams.seniority.toLowerCase())
            );
        }

        if (searchParams.remote) {
            filteredJobs = filteredJobs.filter(job => job.remote === true);
        }

        if (selectedSkills.length > 0) {
            filteredJobs = filteredJobs.filter(job =>
                job.tags?.some(tag =>
                    selectedSkills.some(skill =>
                        tag.toLowerCase().includes(skill.toLowerCase())
                    )
                )
            );
        }

        setJobs(filteredJobs);
    };

    const handleClearFilters = () => {
        setSearchParams({
            q: '',
            location: '',
            job_type: '',
            seniority: '',
            remote: false,
            min_salary: '',
            max_salary: '',
            skills: []
        });
        setSelectedSkills([]);
        // Reset to all jobs
        const allJobs = [...jobOffers, ...mockJobOffers].filter(job => job.status === 'active');
        setJobs(allJobs);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">Chargement des offres...</p>
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
                        Explorer les offres
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Découvrez toutes les opportunités d'emploi disponibles
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un poste, entreprise ou compétence..."
                                    value={searchParams.q}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, q: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="lg:w-64">
                            <div className="relative">
                                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Localisation"
                                    value={searchParams.location}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                            Filtres
                        </button>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Rechercher
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Job Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type de contrat
                                    </label>
                                    <select
                                        value={searchParams.job_type}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, job_type: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Tous les types</option>
                                        {jobTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Seniority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Niveau d'expérience
                                    </label>
                                    <select
                                        value={searchParams.seniority}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, seniority: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Tous les niveaux</option>
                                        {seniorityLevels.map(level => (
                                            <option key={level.value} value={level.value}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Remote Work */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remote"
                                        checked={searchParams.remote}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, remote: e.target.checked }))}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remote" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Télétravail uniquement
                                    </label>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={handleClearFilters}
                                        className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Effacer les filtres
                                    </button>
                                </div>
                            </div>

                            {/* Skills Filter */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Compétences
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {commonSkills.map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => {
                                                if (selectedSkills.includes(skill)) {
                                                    setSelectedSkills(prev => prev.filter(s => s !== skill));
                                                } else {
                                                    setSelectedSkills(prev => [...prev, skill]);
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedSkills.includes(skill)
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        {jobs.length} offre{jobs.length !== 1 ? 's' : ''} trouvée{jobs.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Job Listings */}
                <div className="space-y-6">
                    {jobs.map((job) => {
                        const isSaved = savedJobs.has(job.id);
                        const isLiked = likedJobs.has(job.id);
                        const isApplying = applyingJobs.has(job.id);

                        return (
                            <div
                                key={job.id}
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
                                            onClick={() => handleLikeJob(job.id)}
                                            className={`p-2 rounded-lg transition-all duration-200 ${isLiked
                                                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 shadow-sm'
                                                : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                }`}
                                        >
                                            {isLiked ? (
                                                <HeartSolidIcon className="w-5 h-5" />
                                            ) : (
                                                <HeartIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleSaveJob(job.id)}
                                            className={`p-2 rounded-lg transition-all duration-200 ${isSaved
                                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-sm'
                                                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                                }`}
                                        >
                                            {isSaved ? (
                                                <BookmarkSolidIcon className="w-5 h-5" />
                                            ) : (
                                                <BookmarkIcon className="w-5 h-5" />
                                            )}
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
                                                    key={`${job.id}-tag-${index}`}
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
                                        Publié le {new Date(job.posted || Date.now()).toLocaleDateString('fr-FR')}
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

                {/* No Results */}
                {jobs.length === 0 && (
                    <div className="text-center py-12">
                        <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune offre trouvée</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Essayez de modifier vos critères de recherche.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobExplorerPage;
