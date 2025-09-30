import React, { useState, useEffect } from 'react';
import {
  UserCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowUpIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CheckIcon,
  XMarkIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const EnhancedProfileManager = ({ userProfile, onUpdateProfile }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (userProfile) {
      setFormData({
        personal: {
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.contact?.phone || '',
          location: userProfile.contact?.location || '',
          linkedin: userProfile.contact?.linkedin || '',
          bio: userProfile.bio || userProfile.about || ''
        },
        skills: userProfile.skills || [],
        education: userProfile.education || [],
        experience: userProfile.experience || [],
        projects: userProfile.projects || []
      });
    }
  }, [userProfile]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayItemChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, newItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSave = (section) => {
    const updatedProfile = { ...userProfile };
    
    if (section === 'personal') {
      updatedProfile.name = formData.personal.name;
      updatedProfile.email = formData.personal.email;
      updatedProfile.bio = formData.personal.bio;
      updatedProfile.contact = {
        ...updatedProfile.contact,
        phone: formData.personal.phone,
        location: formData.personal.location,
        linkedin: formData.personal.linkedin,
        email: formData.personal.email
      };
    } else {
      updatedProfile[section] = formData[section];
    }

    onUpdateProfile(updatedProfile);
    setEditingSection(null);
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        personal: {
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.contact?.phone || '',
          location: userProfile.contact?.location || '',
          linkedin: userProfile.contact?.linkedin || '',
          bio: userProfile.bio || userProfile.about || ''
        },
        skills: userProfile.skills || [],
        education: userProfile.education || [],
        experience: userProfile.experience || [],
        projects: userProfile.projects || []
      });
    }
    setEditingSection(null);
  };

  const sections = [
    { id: 'personal', name: 'Informations', icon: UserCircleIcon },
    { id: 'skills', name: 'Compétences', icon: CpuChipIcon },
    { id: 'education', name: 'Formation', icon: AcademicCapIcon },
    { id: 'experience', name: 'Expérience', icon: BriefcaseIcon },
    { id: 'projects', name: 'Projets', icon: BuildingOfficeIcon }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      {/* Section Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8 px-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Section Content */}
      <div className="p-6">
        {activeSection === 'personal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h3>
              {editingSection !== 'personal' ? (
                <button
                  onClick={() => setEditingSection('personal')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSave('personal')}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-3 py-1 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                {editingSection === 'personal' ? (
                  <input
                    type="text"
                    value={formData.personal?.name || ''}
                    onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">{userProfile?.name || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                {editingSection === 'personal' ? (
                  <input
                    type="email"
                    value={formData.personal?.email || ''}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">{userProfile?.email || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone
                </label>
                {editingSection === 'personal' ? (
                  <input
                    type="tel"
                    value={formData.personal?.phone || ''}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">{userProfile?.contact?.phone || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                {editingSection === 'personal' ? (
                  <input
                    type="text"
                    value={formData.personal?.location || ''}
                    onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">{userProfile?.contact?.location || 'Not specified'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  LinkedIn Profile
                </label>
                {editingSection === 'personal' ? (
                  <input
                    type="url"
                    value={formData.personal?.linkedin || ''}
                    onChange={(e) => handleInputChange('personal', 'linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">
                    {userProfile?.contact?.linkedin ? (
                      <a href={userProfile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        {userProfile.contact.linkedin}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bio
                </label>
                {editingSection === 'personal' ? (
                  <textarea
                    value={formData.personal?.bio || ''}
                    onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-slate-900 dark:text-white">{userProfile?.bio || userProfile?.about || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Compétences & Technologies
              </h3>
              {editingSection !== 'skills' ? (
                <button
                  onClick={() => setEditingSection('skills')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSave('skills')}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 px-3 py-1 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span>Annuler</span>
                  </button>
                </div>
              )}
            </div>

            {editingSection === 'skills' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ajouter des compétences
                  </label>
                  <input
                    type="text"
                    placeholder="Tapez une compétence et appuyez sur Entrée (ex: JavaScript, React, Python...)"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newSkill = e.target.value.trim();
                        if (!formData.skills.includes(newSkill)) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, newSkill]
                          }));
                        }
                        e.target.value = '';
                      }
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            skills: prev.skills.filter((_, i) => i !== index)
                          }));
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {userProfile?.skills?.length > 0 ? (
                  userProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">Aucune compétence ajoutée pour le moment</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Education
              </h3>
              <button
                onClick={() => addArrayItem('education', {
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                })}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>

            {formData.education?.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No education entries yet. Click "Add Education" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.education?.map((edu, index) => (
                  <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Education #{index + 1}
                      </h4>
                      <button
                        onClick={() => removeArrayItem('education', index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => handleArrayItemChange('education', index, 'institution', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => handleArrayItemChange('education', index, 'degree', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => handleArrayItemChange('education', index, 'field', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={edu.dateRange || `${edu.startDate || ''} - ${edu.current ? 'Present' : edu.endDate || ''}`}
                          onChange={(e) => handleArrayItemChange('education', index, 'dateRange', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                          placeholder="e.g., 2020 - 2024"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Description
                        </label>
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => handleArrayItemChange('education', index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm resize-none"
                          placeholder="Relevant coursework, achievements, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.education?.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('education')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Save Education</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Work Experience Section */}
        {activeSection === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Expérience Professionnelle
              </h3>
              <button
                onClick={() => addArrayItem('experience', {
                  id: Date.now(),
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  technologies: []
                })}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Ajouter une expérience</span>
              </button>
            </div>

            {formData.experience?.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <BriefcaseIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Aucune expérience ajoutée pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.experience?.map((exp, index) => (
                  <div key={exp.id || index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Poste
                        </label>
                        <input
                          type="text"
                          value={exp.title || ''}
                          onChange={(e) => handleArrayItemChange('experience', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          placeholder="Ex: Développeur Full Stack"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Entreprise
                        </label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          placeholder="Ex: TechnoSoft Maroc"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Lieu
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => handleArrayItemChange('experience', index, 'location', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          placeholder="Ex: Casablanca, Maroc"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Début
                          </label>
                          <input
                            type="month"
                            value={exp.startDate || ''}
                            onChange={(e) => handleArrayItemChange('experience', index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Fin
                          </label>
                          <input
                            type="month"
                            value={exp.endDate === 'present' ? '' : exp.endDate || ''}
                            onChange={(e) => handleArrayItemChange('experience', index, 'endDate', e.target.value || 'present')}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
                        placeholder="Décrivez vos responsabilités et réalisations..."
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {exp.startDate} - {exp.endDate === 'present' ? 'Présent' : exp.endDate}
                        </span>
                      </div>
                      <button
                        onClick={() => removeArrayItem('experience', index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.experience?.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('experience')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Sauvegarder l'expérience</span>
                </button>
              </div>
            )}
          </div>
        )}
        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Projets
              </h3>
              <button
                onClick={() => addArrayItem('projects', {
                  id: Date.now(),
                  title: '',
                  description: '',
                  technologies: [],
                  startDate: '',
                  endDate: '',
                  status: 'completed',
                  url: ''
                })}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Ajouter un projet</span>
              </button>
            </div>

            {formData.projects?.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <BuildingOfficeIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Aucun projet ajouté pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.projects?.map((project, index) => (
                  <div key={project.id || index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Titre du projet
                        </label>
                        <input
                          type="text"
                          value={project.title || ''}
                          onChange={(e) => handleArrayItemChange('projects', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          placeholder="Ex: Plateforme de Recommandation d'Emplois"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Statut
                        </label>
                        <select
                          value={project.status || 'completed'}
                          onChange={(e) => handleArrayItemChange('projects', index, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                        >
                          <option value="completed">Terminé</option>
                          <option value="in_progress">En cours</option>
                          <option value="planned">Planifié</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Début
                          </label>
                          <input
                            type="month"
                            value={project.startDate || ''}
                            onChange={(e) => handleArrayItemChange('projects', index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Fin
                          </label>
                          <input
                            type="month"
                            value={project.endDate === 'present' ? '' : project.endDate || ''}
                            onChange={(e) => handleArrayItemChange('projects', index, 'endDate', e.target.value || 'present')}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          URL du projet (optionnel)
                        </label>
                        <input
                          type="url"
                          value={project.url || ''}
                          onChange={(e) => handleArrayItemChange('projects', index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => handleArrayItemChange('projects', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
                        placeholder="Décrivez le projet, ses objectifs et vos contributions..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Technologies utilisées
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                        onChange={(e) => handleArrayItemChange('projects', index, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                        placeholder="Ex: React, Python, Django, PostgreSQL (séparées par des virgules)"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {project.startDate} - {project.endDate === 'present' ? 'En cours' : project.endDate}
                          </span>
                        </div>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>Voir le projet</span>
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => removeArrayItem('projects', index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.projects?.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('projects')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Sauvegarder les projets</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedProfileManager;
