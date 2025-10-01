import React, { useState, useEffect } from 'react';
import {
 BriefcaseIcon,
 MapPinIcon,
 ClockIcon,
 CurrencyDollarIcon,
 EyeIcon,
 CheckCircleIcon,
 TagIcon,
 CalendarIcon,
 ArrowUpIcon,
 ArrowDownIcon,
 TrashIcon,
 XMarkIcon,
 ChevronDownIcon,
 PencilIcon
} from '@heroicons/react/24/outline';
import { jobOffers } from '../../../data/jobOffers';
import { mockJobOffers } from '../../../data/mockJobOffers';

const ApplicationsPage = () => {
 const [appliedJobs, setAppliedJobs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
 const [deletingJobId, setDeletingJobId] = useState(null);
 const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
 const [showStatusModal, setShowStatusModal] = useState(null);

 // Load applied jobs from localStorage
 useEffect(() => {
 const loadAppliedJobs = () => {
 setLoading(true);
 try {
 const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
 const appliedJobData = JSON.parse(localStorage.getItem('appliedJobData') || '[]');

 // Get job details for applied jobs - use stored job data first, fallback to static data
 const allJobs = [...jobOffers, ...mockJobOffers];
 const jobsWithApplicationData = appliedJobIds
 .map(jobId => {
 const applicationData = appliedJobData.find(data => data.jobId === jobId);
 let job;

 // Use stored job data if available, otherwise fallback to static data
 if (applicationData?.jobData) {
 job = applicationData.jobData;
 } else {
 job = allJobs.find(j => j.id === jobId);
 }

 if (!job) return null; // Filter out jobs that don't exist
 return {
 ...job,
 applicationDate: applicationData?.applicationDate || new Date().toISOString(),
 applicationStatus: applicationData?.status || 'applied'
 };
 })
 .filter(Boolean); // Remove null values

 // Sort by application date
 const sortedJobs = jobsWithApplicationData.sort((a, b) => {
 const dateA = new Date(a.applicationDate);
 const dateB = new Date(b.applicationDate);
 return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
 });

 setAppliedJobs(sortedJobs);
 } catch (error) {
 console.error('Error loading applied jobs:', error);
 setAppliedJobs([]);
 } finally {
 setLoading(false);
 }
 };

 loadAppliedJobs();
 }, [sortOrder]);

 const formatApplicationDate = (dateString) => {
 const date = new Date(dateString);
 return date.toLocaleDateString('fr-FR', {
 day: 'numeric',
 month: 'long',
 year: 'numeric'
 });
 };

 const getApplicationStatusColor = (status) => {
 switch (status) {
 case 'applied':
 return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
 case 'reviewed':
 return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
 case 'interview':
 return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
 case 'accepted':
 return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
 case 'rejected':
 return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
 default:
 return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
 }
 };

 const getApplicationStatusText = (status) => {
 switch (status) {
 case 'applied':
 return 'Candidature envoyée';
 case 'reviewed':
 return 'En cours d\'examen';
 case 'interview':
 return 'Entretien programmé';
 case 'accepted':
 return 'Candidature acceptée';
 case 'rejected':
 return 'Candidature refusée';
 default:
 return 'Statut inconnu';
 }
 };

 const toggleSortOrder = () => {
 setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
 };

 // Delete application function
 const handleDeleteApplication = async (jobId) => {
 setDeletingJobId(jobId);
 try {
 // Remove from appliedJobs Set
 const appliedJobIds = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
 const updatedAppliedJobIds = appliedJobIds.filter(id => id !== jobId);
 localStorage.setItem('appliedJobs', JSON.stringify(updatedAppliedJobIds));

 // Remove from appliedJobData
 const appliedJobData = JSON.parse(localStorage.getItem('appliedJobData') || '[]');
 const updatedAppliedJobData = appliedJobData.filter(data => data.jobId !== jobId);
 localStorage.setItem('appliedJobData', JSON.stringify(updatedAppliedJobData));

 // Update local state
 setAppliedJobs(prev => prev.filter(job => job.id !== jobId));

 // Hide delete confirmation
 setShowDeleteConfirm(null);

 console.log('Application deleted successfully');
 } catch (error) {
 console.error('Error deleting application:', error);
 } finally {
 setDeletingJobId(null);
 }
 };

 // Show delete confirmation
 const handleShowDeleteConfirm = (jobId) => {
 setShowDeleteConfirm(jobId);
 };

 // Cancel delete
 const handleCancelDelete = () => {
 setShowDeleteConfirm(null);
 };

 // Handle status tracking button click
 const handleTrackStatus = (jobId) => {
 setShowStatusModal(jobId);
 };

 // Close status modal
 const handleCloseStatusModal = () => {
 setShowStatusModal(null);
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <div className="flex items-center justify-center py-20">
 <div className="flex flex-col items-center space-y-4">
 <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
 <p className="text-gray-600 dark:text-gray-400 text-lg">Chargement de vos candidatures...</p>
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
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
 Mes candidatures
 </h1>
 <p className="text-gray-600 dark:text-gray-400">
 {appliedJobs.length} candidature{appliedJobs.length !== 1 ? 's' : ''} envoyée{appliedJobs.length !== 1 ? 's' : ''}
 </p>
 </div>

 {/* Sort Button */}
 {appliedJobs.length > 1 && (
 <button
 onClick={toggleSortOrder}
 className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
 >
 <CalendarIcon className="w-4 h-4 text-gray-500" />
 <span className="text-sm text-gray-700 dark:text-gray-300">
 {sortOrder === 'newest' ? 'Plus récentes' : 'Plus anciennes'}
 </span>
 {sortOrder === 'newest' ? (
 <ArrowDownIcon className="w-4 h-4 text-gray-500" />
 ) : (
 <ArrowUpIcon className="w-4 h-4 text-gray-500" />
 )}
 </button>
 )}
 </div>
 </div>

 {/* Applications List */}
 {appliedJobs.length > 0 ? (
 <div className="space-y-6">
 {appliedJobs.map((job, index) => (
 <div
 key={job.id || `job-${index}`}
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
 <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-2">
 {job.company}
 </p>

 {/* Application Date */}
 <div className="flex items-center space-x-2 mb-3">
 <CalendarIcon className="w-4 h-4 text-gray-400" />
 <span className="text-sm text-gray-500 dark:text-gray-400">
 Candidature envoyée le {formatApplicationDate(job.applicationDate)}
 </span>
 </div>

 {/* Application Status */}
 <div className="mb-3">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(job.applicationStatus)}`}>
 <CheckCircleIcon className="w-3 h-3 mr-1" />
 {getApplicationStatusText(job.applicationStatus)}
 </span>
 </div>

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

 {/* Delete Button */}
 <div className="flex-shrink-0">
 {showDeleteConfirm === job.id ? (
 <div className="flex items-center space-x-2">
 <button
 onClick={() => handleDeleteApplication(job.id)}
 disabled={deletingJobId === job.id}
 className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
 >
 {deletingJobId === job.id ? (
 <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
 ) : (
 <TrashIcon className="w-4 h-4" />
 )}
 <span>{deletingJobId === job.id ? 'Suppression...' : 'Confirmer'}</span>
 </button>
 <button
 onClick={handleCancelDelete}
 className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
 >
 <XMarkIcon className="w-4 h-4" />
 <span>Annuler</span>
 </button>
 </div>
 ) : (
 <button
 onClick={() => handleShowDeleteConfirm(job.id)}
 className="flex items-center space-x-1 px-3 py-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
 title="Supprimer cette candidature"
 >
 <TrashIcon className="w-4 h-4" />
 <span className="text-sm">Supprimer</span>
 </button>
 )}
 </div>
 </div>

 {/* Description */}
 <div className="mb-6">
 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
 {job.description}
 </p>
 </div>

 {/* Skills */}
 {job.tags && job.tags.length > 0 && (
 <div className="mb-6">
 <div className="flex flex-wrap gap-2">
 {job.tags.slice(0, 6).map((tag, index) => (
 <span
 key={index}
 className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
 >
 <TagIcon className="w-3 h-3 mr-1" />
 {tag}
 </span>
 ))}
 {job.tags.length > 6 && (
 <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
 +{job.tags.length - 6} autres
 </span>
 )}
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
 onClick={() => handleTrackStatus(job.id)}
 className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
 >
 <CheckCircleIcon className="w-4 h-4" />
 <span>Suivre le statut</span>
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 /* Empty State */
 <div className="text-center py-12">
 <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
 <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune candidature</h3>
 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
 Commencez à postuler aux offres qui vous intéressent.
 </p>
 </div>
 )}
 </div>

 {/* Status Tracking Modal */}
 {showStatusModal && (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
 {(() => {
 const job = appliedJobs.find(j => j.id === showStatusModal);
 if (!job) return null;

 return (
 <div className="p-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center space-x-3">
 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
 <CheckCircleIcon className="w-6 h-6 text-white" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-gray-900 dark:text-white">
 Statut de candidature
 </h3>
 <p className="text-sm text-gray-500 dark:text-gray-400">
 {job.title} - {job.company}
 </p>
 </div>
 </div>
 <button
 onClick={handleCloseStatusModal}
 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
 >
 <XMarkIcon className="w-6 h-6" />
 </button>
 </div>

 {/* Current Status */}
 <div className="mb-6">
 <div className="flex items-center justify-between mb-4">
 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
 Statut actuel
 </span>
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getApplicationStatusColor(job.applicationStatus)}`}>
 <CheckCircleIcon className="w-4 h-4 mr-2" />
 {getApplicationStatusText(job.applicationStatus)}
 </span>
 </div>
 </div>

 {/* Application Details */}
 <div className="space-y-4 mb-6">
 <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
 <span className="text-sm text-gray-600 dark:text-gray-400">Date de candidature</span>
 <span className="text-sm font-medium text-gray-900 dark:text-white">
 {formatApplicationDate(job.applicationDate)}
 </span>
 </div>
 <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
 <span className="text-sm text-gray-600 dark:text-gray-400">Localisation</span>
 <span className="text-sm font-medium text-gray-900 dark:text-white">
 {job.location}
 </span>
 </div>
 <div className="flex items-center justify-between py-2">
 <span className="text-sm text-gray-600 dark:text-gray-400">Salaire</span>
 <span className="text-sm font-medium text-gray-900 dark:text-white">
 {job.salary}
 </span>
 </div>
 </div>

 {/* Status Timeline */}
 <div className="mb-6">
 <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
 Prochaines étapes possibles
 </h4>
 <div className="space-y-2">
 {[
 { status: 'reviewed', label: 'Examen de votre candidature' },
 { status: 'interview', label: 'Entretien programmé' },
 { status: 'interviewed', label: 'Entretien terminé' },
 { status: 'accepted', label: 'Candidature acceptée' }
 ].map((step, index) => (
 <div key={step.status} className="flex items-center space-x-3">
 <div className={`w-2 h-2 rounded-full ${job.applicationStatus === step.status
 ? 'bg-blue-500'
 : 'bg-gray-300 dark:bg-gray-600'
 }`} />
 <span className={`text-sm ${job.applicationStatus === step.status
 ? 'text-blue-600 dark:text-blue-400 font-medium'
 : 'text-gray-500 dark:text-gray-400'
 }`}>
 {step.label}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex space-x-3">
 <button
 onClick={handleCloseStatusModal}
 className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
 >
 Fermer
 </button>
 <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
 Voir détails
 </button>
 </div>
 </div>
 );
 })()}
 </div>
 </div>
 )}
 </div>
 );
};

export default ApplicationsPage;
