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
  ClockIcon
} from '@heroicons/react/24/outline';
import { useJobSearch } from '../../../hooks/useJobRecommendations';

const JobSearchBackend = () => {
  const { jobs, loading, error, filters, searchJobs, clearSearch } = useJobSearch();

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

  const handleSearch = () => {
    const params = { ...searchParams };
    if (selectedSkills.length > 0) {
      params.skills = selectedSkills;
    }
    searchJobs(params);
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
    clearSearch();
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const formatSalary = (job) => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${job.salary_currency}`;
    } else if (job.salary_min) {
      return `À partir de ${job.salary_min.toLocaleString()} ${job.salary_currency}`;
    } else if (job.salary_max) {
      return `Jusqu'à ${job.salary_max.toLocaleString()} ${job.salary_currency}`;
    }
    return 'Salaire non spécifié';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un poste, une entreprise..."
                value={searchParams.q}
                onChange={(e) => setSearchParams(prev => ({ ...prev, q: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filtres</span>
          </button>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Rechercher
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ville, région..."
                  value={searchParams.location}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={searchParams.remote}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, remote: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remote" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Télétravail
                </label>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salaire minimum (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 10000"
                  value={searchParams.min_salary}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, min_salary: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salaire maximum (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 20000"
                  value={searchParams.max_salary}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, max_salary: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compétences
              </label>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedSkills.includes(skill)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClearFilters}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Effacer les filtres</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedSkills.length} compétence{selectedSkills.length > 1 ? 's' : ''} sélectionnée{selectedSkills.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Recherche en cours...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune offre trouvée
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}

        {!loading && !error && jobs.map((job) => (
          <div key={job.id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200">
            {/* Header with Company Avatar and Actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                {/* Company Avatar */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {job.company?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-2">
                    {job.company}
                  </p>

                  {/* Compact Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BriefcaseIcon className="w-3.5 h-3.5" />
                      <span>{job.job_type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{job.seniority}</span>
                    </div>
                    {job.remote && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">
                        Remote
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date and Salary */}
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {formatDate(job.posted_at)}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatSalary(job)}
                </div>
              </div>
            </div>

            {/* Description - More Compact */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
              {job.description}
            </p>

            {/* Required Skills - Enhanced */}
            {job.required_skills && job.required_skills.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-1 mb-2">
                  <TagIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Compétences requises
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.slice(0, 5).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md text-xs font-medium"
                    >
                      {skill.name || skill}
                    </span>
                  ))}
                  {job.required_skills.length > 5 && (
                    <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-md text-xs">
                      +{job.required_skills.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mr-4">
                {job.contact_email}
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <StarIcon className="w-4 h-4" />
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm hover:shadow">
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSearchBackend;

