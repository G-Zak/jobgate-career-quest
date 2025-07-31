import React, { useState } from 'react';
import GameContainer from './game/GameContainer';

export default function App() {
  const [showGame, setShowGame] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('react');

  const skills = [
    { id: 'react', name: 'React Development', icon: '⚛️' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'django', name: 'Django', icon: '🎸' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' }
  ];

  // Handler when user exits the game
  const handleGameExit = () => {
    console.log('👋 User exited the game');
    setShowGame(false);
  };

  // Handler when user starts quiz from game
  const handleQuizStart = (skill) => {
    console.log(`🎯 Quiz started for skill: ${skill}`);
    
    // For now, show an alert. Later this will navigate to quiz interface
    alert(`Quiz for ${skill} would start here!\n\nThis will be implemented in F4 - Quiz Interface task.`);
    
    // Optionally exit game to show React quiz interface
    // setShowGame(false);
  };

  if (showGame) {
    return (
      <div className="min-h-screen bg-gray-900">
        <GameContainer 
          selectedSkill={selectedSkill}
          onGameExit={handleGameExit}
          onQuizStart={handleQuizStart}
          className="w-full h-screen"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 font-pixel text-green-500">
        🎮 JobGate Career Quest
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl mb-6 text-center">Select a skill to validate:</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map(skill => (
            <div 
              key={skill.id}
              className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-green-500 hover:border-green-400"
              onClick={() => {
                setSelectedSkill(skill.id);
                setShowGame(true);
              }}
            >
              <div className="text-4xl mb-2">{skill.icon}</div>
              <h3 className="text-xl font-semibold">{skill.name}</h3>
              <p className="text-gray-400 mt-2">Click to start assessment</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowGame(true)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Random Assessment
          </button>
        </div>
        
        <div className="mt-8 text-center text-green-500 font-pixel">
          <p>Welcome to the retro job fair!</p>
        </div>
      </div>
    </div>
  );
}