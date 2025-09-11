import React from 'react';
import { User, MapPin, Briefcase } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  return (
    <div className="sa-card sa-fade-in">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="sa-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="sa-level-badge">
            Lvl {user.level}
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="sa-heading-1">{user.name}</h2>
          <p className="sa-body mb-3">Level {user.level} Career Explorer</p>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="sa-body">Career Progress</span>
              <span className="sa-body font-semibold text-blue-600">{user.overallScore}%</span>
            </div>
            <div className="sa-progress">
              <div 
                className="sa-progress-bar" 
                style={{ width: `${user.overallScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {user.declaredSkills.map((skill, index) => (
              <span 
                key={index} 
                className="sa-chip sa-chip-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;