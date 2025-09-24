import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getAllSkills } from '../../../data/predefinedSkills';

const SkillsSelector = ({
    skills = [],
    onSkillsChange,
    availableSkills = [],
    className = ""
}) => {
    const [newSkill, setNewSkill] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);

    // Use predefined skills if no availableSkills provided
    const allAvailableSkills = availableSkills.length > 0 ? availableSkills : getAllSkills().map(skill => ({
        id: skill,
        name: skill
    }));

    const handleAddSkill = (skill) => {
        // Handle both predefined skills and custom skills
        let skillToAdd;
        if (typeof skill === 'string') {
            // Custom skill entered by user
            skillToAdd = {
                id: skill.toLowerCase().replace(/\s+/g, '-'),
                name: skill.trim()
            };
        } else {
            // Predefined skill
            skillToAdd = {
                id: skill.id || skill.name.toLowerCase().replace(/\s+/g, '-'),
                name: skill.name
            };
        }

        if (skillToAdd && !skills.find(s => s.id === skillToAdd.id || s.name === skillToAdd.name)) {
            onSkillsChange([...skills, skillToAdd]);
        }
        setNewSkill('');
        setShowSuggestions(false);
    };

    const handleRemoveSkill = (skillId) => {
        onSkillsChange(skills.filter(skill => skill.id !== skillId));
    };


    const handleInputChange = (value) => {
        setNewSkill(value);
        setShowSuggestions(value.length > 0);
    };

    const filteredSuggestions = allAvailableSkills
        .filter(skill => {
            const skillName = skill.name.toLowerCase();
            const searchTerm = newSkill.toLowerCase().trim();
            return skillName.includes(searchTerm) &&
                !skills.find(s => s.id === skill.id || s.name === skill.name);
        })
        .sort((a, b) => {
            // Sort by relevance (exact matches first, then starts with, then contains)
            const searchTerm = newSkill.toLowerCase().trim();
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            if (aName === searchTerm) return -1;
            if (bName === searchTerm) return 1;
            if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
            if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
            return aName.localeCompare(bName);
        });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getSkillBadgeColor = (skillName) => {
        const colors = [
            'bg-slate-100 text-slate-700 border-slate-200',
            'bg-blue-50 text-blue-700 border-blue-200',
            'bg-gray-100 text-gray-700 border-gray-200',
            'bg-indigo-50 text-indigo-700 border-indigo-200',
            'bg-slate-50 text-slate-600 border-slate-200',
            'bg-blue-50 text-blue-600 border-blue-200',
            'bg-gray-50 text-gray-600 border-gray-200',
            'bg-indigo-50 text-indigo-600 border-indigo-200',
            'bg-slate-50 text-slate-500 border-slate-200',
            'bg-blue-50 text-blue-500 border-blue-200'
        ];

        // Use skill name to consistently assign colors
        const hash = skillName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="group inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
                    >
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSkillBadgeColor(skill.name)}`}>
                            {skill.name}
                        </span>
                        <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <XMarkIcon className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Skill Input */}
            <div className="relative" ref={dropdownRef}>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm font-medium transition-all duration-200 bg-white dark:bg-gray-800"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newSkill.trim()) {
                                    handleAddSkill(newSkill.trim());
                                }
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if (newSkill.trim()) {
                                handleAddSkill(newSkill.trim());
                            }
                        }}
                        className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Add
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-[9999] w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                        <div className="py-1">
                            {filteredSuggestions.slice(0, 20).map((skill, index) => (
                                <button
                                    key={`${skill.id}-${index}`}
                                    onClick={() => handleAddSkill(skill)}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 group cursor-pointer"
                                >
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getSkillBadgeColor(skill.name)}`}>
                                        {skill.name}
                                    </span>
                                </button>
                            ))}
                            {filteredSuggestions.length > 20 && (
                                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
                                    Showing first 20 results. Type more to narrow down.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Skills Count */}
            <div className="flex items-center space-x-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                    {skills.length} skill{skills.length !== 1 ? 's' : ''} selected
                </div>
            </div>
        </div>
    );
};

export default SkillsSelector;
