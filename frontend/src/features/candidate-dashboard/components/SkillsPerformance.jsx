import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target } from 'lucide-react';

const SkillsPerformance = () => {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillsPerformance();
  }, []);

  const loadSkillsPerformance = async () => {
    try {
      // Load test results to calculate skill performance
      const response = await fetch('http://localhost:8000/api/results/');
      const testResults = await response.json();

      // Group results by skill/test type
      const skillsMap = {};
      testResults.forEach(result => {
        const skillName = result.test_name || result.skill || 'Unknown Skill';
        if (!skillsMap[skillName]) {
          skillsMap[skillName] = {
            name: skillName,
            scores: [],
            averageScore: 0,
            testCount: 0
          };
        }
        skillsMap[skillName].scores.push(result.percentage || 0);
        skillsMap[skillName].testCount++;
      });

      // Calculate average scores
      const skillsArray = Object.values(skillsMap).map(skill => ({
        ...skill,
        averageScore: Math.round(skill.scores.reduce((sum, score) => sum + score, 0) / skill.scores.length)
      }));

      // Sort by average score (highest first)
      skillsArray.sort((a, b) => b.averageScore - a.averageScore);

      setSkillsData(skillsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error loading skills performance:', error);
      setLoading(false);
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'sa-stat-value-success';
    if (score >= 60) return 'sa-stat-value-warning';
    return 'sa-stat-value-danger';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    if (score >= 40) return 'Beginner';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <h3 className="sa-heading-2">Performance par Compétence</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (skillsData.length === 0) {
    return (
      <div className="sa-card sa-fade-in">
        <div className="sa-card-header">
          <h3 className="sa-heading-2">Performance par Compétence</h3>
          <div className="sa-caption">0 compétence évaluée</div>
        </div>
        <div className="sa-empty-state">
          <div className="sa-empty-state-icon">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <div className="sa-empty-state-title">Aucune performance</div>
          <div className="sa-empty-state-description">
            Passez des tests pour voir vos performances
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-card sa-fade-in">
      <div className="sa-card-header">
        <h3 className="sa-heading-2">Performance par Compétence</h3>
        <div className="sa-caption">{skillsData.length} compétence{skillsData.length > 1 ? 's' : ''} évaluée{skillsData.length > 1 ? 's' : ''}</div>
      </div>
      
      <div className="sa-stack">
        {skillsData.map((skill, index) => (
          <div key={skill.name} className="sa-stat-item">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <div className="sa-body font-medium">{skill.name}</div>
                  <div className="sa-caption">{getPerformanceLevel(skill.averageScore)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`sa-stat-value ${getPerformanceColor(skill.averageScore)}`}>
                    {skill.averageScore}%
                  </div>
                  <div className="sa-caption">{skill.testCount} test{skill.testCount > 1 ? 's' : ''}</div>
                </div>
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      skill.averageScore >= 80 ? 'bg-green-500' : 
                      skill.averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${skill.averageScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPerformance;
