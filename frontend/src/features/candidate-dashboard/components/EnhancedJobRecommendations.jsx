import React, { useState } from 'react';
import {
 BriefcaseIcon,
 MapPinIcon,
 CurrencyDollarIcon,
 ClockIcon,
 StarIcon,
 CheckCircleIcon,
 XCircleIcon,
 ChevronRightIcon
} from '@heroicons/react/24/outline';

const EnhancedJobRecommendations = ({ onViewAll }) => {
 const [selectedJob, setSelectedJob] = useState(null);

 const jobRecommendations = [
 {
 id: 1,
 title: 'Junior Software Developer',
 company: 'TechCorp Solutions',
 location: 'Remote',
 salary: '$65k - $85k',
 type: 'Full-time',
 match: 92,
 employabilityRequired: 75,
 skills: ['JavaScript', 'React', 'Node.js', 'Python'],
 description: 'Perfect match for your strong technical skills and logical reasoning. Your 88% technical score makes you an ideal candidate.',
 requirements: [
 'Strong technical skills ( You have 88%)',
 'Problem-solving abilities ( You have 78%)',
 'Team collaboration (️ You have 65%)',
 'Communication skills (️ You have 45%)'
 ],
 benefits: ['Health Insurance', 'Remote Work', 'Learning Budget', 'Flexible Hours'],
 posted: '2 days ago',
 applicants: 45
 },
 {
 id: 2,
 title: 'Data Analyst',
 company: 'DataFlow Inc',
 location: 'San Francisco, CA',
 salary: '$70k - $90k',
 type: 'Full-time',
 match: 85,
 employabilityRequired: 70,
 skills: ['Python', 'SQL', 'Excel', 'Tableau'],
 description: 'Great match for your numerical reasoning and technical skills. Your 85% numerical score is above the requirement.',
 requirements: [
 'Numerical reasoning ( You have 85%)',
 'Technical skills ( You have 88%)',
 'Data visualization (️ You have 70%)',
 'Statistical analysis (️ You have 65%)'
 ],
 benefits: ['Health Insurance', 'Dental', 'Vision', '401k'],
 posted: '1 week ago',
 applicants: 32
 },
 {
 id: 3,
 title: 'Product Manager',
 company: 'InnovateTech',
 location: 'New York, NY',
 salary: '$90k - $120k',
 type: 'Full-time',
 match: 78,
 employabilityRequired: 80,
 skills: ['Product Strategy', 'Agile', 'Analytics', 'Communication'],
 description: 'Good match but requires improvement in communication skills. Your situational judgment is strong at 82%.',
 requirements: [
 'Communication skills (️ You have 45%)',
 'Leadership abilities (️ You have 52%)',
 'Strategic thinking ( You have 78%)',
 'Team management (️ You have 65%)'
 ],
 benefits: ['Health Insurance', 'Stock Options', 'Unlimited PTO', 'Gym Membership'],
 posted: '3 days ago',
 applicants: 28
 },
 {
 id: 4,
 title: 'UX Designer',
 company: 'CreativeStudio',
 location: 'Austin, TX',
 salary: '$75k - $95k',
 type: 'Full-time',
 match: 72,
 employabilityRequired: 75,
 skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
 description: 'Decent match but needs improvement in spatial reasoning. Your abstract reasoning could be stronger.',
 requirements: [
 'Spatial reasoning (️ You have 58%)',
 'Abstract thinking (️ You have 65%)',
 'Creativity ( You have 70%)',
 'User empathy (️ You have 60%)'
 ],
 benefits: ['Health Insurance', 'Design Tools', 'Conference Budget', 'Flexible Schedule'],
 posted: '5 days ago',
 applicants: 41
 }
 ];

 const getMatchColor = (match) => {
 if (match >= 90) return 'text-green-600 bg-green-50';
 if (match >= 80) return 'text-blue-600 bg-blue-50';
 if (match >= 70) return 'text-yellow-600 bg-yellow-50';
 return 'text-red-600 bg-red-50';
 };

 const getMatchLabel = (match) => {
 if (match >= 90) return 'Excellent Match';
 if (match >= 80) return 'Great Match';
 if (match >= 70) return 'Good Match';
 return 'Fair Match';
 };

 const getRequirementStatus = (requirement) => {
 if (requirement.includes('')) return 'met';
 if (requirement.includes('️')) return 'partial';
 return 'not-met';
 };

 const getRequirementIcon = (status) => {
 switch (status) {
 case 'met': return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
 case 'partial': return <XCircleIcon className="w-4 h-4 text-yellow-600" />;
 default: return <XCircleIcon className="w-4 h-4 text-red-600" />;
 }
 };

 return (
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center space-x-3">
 <div className="p-2 bg-green-100 rounded-lg">
 <BriefcaseIcon className="w-6 h-6 text-green-600" />
 </div>
 <div>
 <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
 <p className="text-sm text-gray-500">Based on your employability score and skills</p>
 </div>
 </div>
 <button
 onClick={onViewAll}
 className="text-blue-600 hover:text-blue-700 text-sm font-medium"
 >
 View All Jobs
 </button>
 </div>

 {/* Job Cards - Top 3-4 Jobs Only */}
 <div className="space-y-4">
 {jobRecommendations.slice(0, 3).map((job) => (
 <div
 key={job.id}
 className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
 selectedJob === job.id
 ? 'border-blue-300 bg-blue-50'
 : 'border-gray-200 hover:border-gray-300'
 }`}
 onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
 >
 {/* Compact Job Header */}
 <div className="flex items-center justify-between mb-2">
 <div className="flex-1">
 <div className="flex items-center space-x-2 mb-1">
 <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(job.match)}`}>
 {job.match}%
 </span>
 </div>
 <div className="flex items-center space-x-3 text-sm text-gray-600">
 <span>{job.company}</span>
 <span>•</span>
 <span>{job.location}</span>
 <span>•</span>
 <span>{job.salary}</span>
 </div>
 </div>
 </div>

 {/* Compact Match Info */}
 <div className="mb-3">
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600">Score: 72/{job.employabilityRequired}</span>
 <div className="flex items-center space-x-2">
 {job.skills.slice(0, 2).map((skill, index) => (
 <span
 key={index}
 className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
 >
 {skill}
 </span>
 ))}
 {job.skills.length > 2 && (
 <span className="text-xs text-gray-500">+{job.skills.length - 2} more</span>
 )}
 </div>
 </div>
 </div>

 {/* Compact Job Details */}
 <div className="flex items-center justify-between text-sm text-gray-500">
 <div className="flex items-center space-x-3">
 <div className="flex items-center space-x-1">
 <ClockIcon className="w-4 h-4" />
 <span>{job.type}</span>
 </div>
 <span>•</span>
 <span>{job.posted}</span>
 </div>
 <ChevronRightIcon className="w-4 h-4" />
 </div>

 {/* Expanded Details */}
 {selectedJob === job.id && (
 <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
 {/* Requirements */}
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements Analysis</h4>
 <div className="space-y-2">
 {job.requirements.map((req, index) => {
 const status = getRequirementStatus(req);
 return (
 <div key={index} className="flex items-center space-x-2">
 {getRequirementIcon(status)}
 <span className="text-sm text-gray-600">{req}</span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Benefits */}
 <div>
 <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
 <div className="flex flex-wrap gap-2">
 {job.benefits.map((benefit, index) => (
 <span
 key={index}
 className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
 >
 {benefit}
 </span>
 ))}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex space-x-3">
 <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
 Apply Now
 </button>
 <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
 Save Job
 </button>
 </div>
 </div>
 )}
 </div>
 ))}
 </div>

 {/* Job Match Insights */}
 <div className="mt-4 p-4 bg-blue-50 rounded-lg">
 <h4 className="text-sm font-medium text-blue-900 mb-3">Your Job Match Insights</h4>
 <div className="space-y-2">
 <div className="flex items-center justify-between text-sm">
 <span className="text-blue-700">Average Match Score</span>
 <span className="font-semibold text-blue-900">85%</span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="text-blue-700">Best Match</span>
 <span className="font-semibold text-blue-900">Junior Software Developer (92%)</span>
 </div>
 <div className="flex items-center justify-between text-sm">
 <span className="text-blue-700">Salary Range</span>
 <span className="font-semibold text-blue-900">$70k - $120k</span>
 </div>
 </div>
 </div>

 {/* Quick Tips */}
 <div className="mt-4 p-4 bg-green-50 rounded-lg">
 <h4 className="text-sm font-medium text-green-900 mb-3"> Quick Tips</h4>
 <div className="space-y-2 text-sm text-green-800">
 <div className="flex items-start space-x-2">
 <span className="text-green-600">•</span>
 <span>Improve communication skills to unlock more opportunities</span>
 </div>
 <div className="flex items-start space-x-2">
 <span className="text-green-600">•</span>
 <span>Your technical skills are highly valued by employers</span>
 </div>
 <div className="flex items-start space-x-2">
 <span className="text-green-600">•</span>
 <span>Consider remote positions for better work-life balance</span>
 </div>
 </div>
 </div>

 {/* Compact Summary */}
 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
 <div className="flex items-center justify-between text-sm">
 <span className="text-gray-600">You qualify for 3 out of 3 recommended positions</span>
 <button
 onClick={onViewAll}
 className="text-blue-600 hover:text-blue-700 font-medium"
 >
 View All Jobs →
 </button>
 </div>
 </div>
 </div>
 );
};

export default EnhancedJobRecommendations;
