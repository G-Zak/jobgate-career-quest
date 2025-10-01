import React from 'react';
import { mockJobOffers } from '../data/mockJobOffers';

const DebugJobSkills = () => {
    const testJob = mockJobOffers[0]; // Premier emploi

    // Simuler la logique d'extraction des compétences
    const extractSkills = (skills) => {
        if (!Array.isArray(skills)) return [];
        return skills.map(skill => {
            if (typeof skill === 'string') return skill;
            if (typeof skill === 'object' && skill.name) return skill.name;
            return String(skill);
        }).filter(skill => skill && skill.length > 0);
    };

    const requiredSkills = extractSkills(testJob.required_skills);
    const preferredSkills = extractSkills(testJob.preferred_skills);

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
                Debug Job Skills - {testJob.title}
            </h3>

            <div className="space-y-4">
                <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Raw Data
                    </h4>
                    <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        <p><strong>required_skills:</strong> {JSON.stringify(testJob.required_skills, null, 2)}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Extracted Skills
                    </h4>
                    <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        <p><strong>Required Skills:</strong> {JSON.stringify(requiredSkills)}</p>
                        <p><strong>Required Skills Count:</strong> {requiredSkills.length}</p>
                        <p><strong>Preferred Skills:</strong> {JSON.stringify(preferredSkills)}</p>
                        <p><strong>Preferred Skills Count:</strong> {preferredSkills.length}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Test Display
                    </h4>
                    <div className="text-sm text-red-700 dark:text-red-300">
                        {requiredSkills.length > 0 ? (
                            <div>
                                <p>✅ Required Skills Section would be displayed</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {requiredSkills.map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>❌ Required Skills Section would NOT be displayed (length = 0)</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugJobSkills;

