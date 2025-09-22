import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getAllSkills, proficiencyLevels } from '../../../data/predefinedSkills';

const SkillsSelector = ({
    skills = [],
    onSkillsChange,
    availableSkills = [],
    className = ""
}) => {
    const [newSkill, setNewSkill] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
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
                name: skill.trim(),
                proficiency: 'intermediate'
            };
        } else {
            // Predefined skill
            skillToAdd = {
                id: skill.id || skill.name.toLowerCase().replace(/\s+/g, '-'),
                name: skill.name,
                proficiency: skill.proficiency || 'intermediate'
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

    const handleProficiencyChange = (skillId, newProficiency) => {
        const updatedSkills = skills.map(skill => 
            skill.id === skillId 
                ? { ...skill, proficiency: newProficiency }
                : skill
        );
        onSkillsChange(updatedSkills);
        setEditingSkill(null);
    };

    const handleInputChange = (value) => {
        setNewSkill(value);
        setShowSuggestions(value.length > 0);
    };

    const filteredSuggestions = allAvailableSkills.filter(skill =>
        skill.name.toLowerCase().includes(newSkill.toLowerCase()) &&
        !skills.find(s => s.id === skill.id || s.name === skill.name)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setEditingSkill(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm relative"
                    >
                        <span>{skill.name}</span>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setEditingSkill(editingSkill === skill.id ? null : skill.id)}
                                className="flex items-center space-x-1 text-xs bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded-full hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors cursor-pointer group"
                                title="Cliquer pour changer le niveau"
                            >
                                <span>
                                    {skill.proficiency === 'beginner' && 'Débutant'}
                                    {skill.proficiency === 'intermediate' && 'Intermédiaire'}
                                    {skill.proficiency === 'advanced' && 'Avancé'}
                                    {skill.proficiency === 'expert' && 'Expert'}
                                </span>
                                <ChevronDownIcon className={`w-3 h-3 transition-transform ${editingSkill === skill.id ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Proficiency Dropdown */}
                            {editingSkill === skill.id && (
                                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 min-w-[120px]">
                                    {proficiencyLevels.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => handleProficiencyChange(skill.id, level.value)}
                                            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-md last:rounded-b-md ${
                                                skill.proficiency === level.value 
                                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                                                    : 'text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {level.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Skill Input */}
            <div className="relative">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Ajouter une compétence"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-1"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Ajouter</span>
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => handleAddSkill(skill)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Skills Count */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {skills.length} compétence{skills.length > 1 ? 's' : ''} sélectionnée{skills.length > 1 ? 's' : ''}
            </div>
        </div>
    );
};

export default SkillsSelector;
