import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
 Briefcase,
 Calendar,
 Clock,
 Star,
 TrendingUp,
 Award,
 Target
} from 'lucide-react';
import dashboardApi from '../services/dashboardApi';
import xpCalculationService from '../services/xpCalculationService';

const ProfileHeader = ({ user: initialUser }) => {
 const [user, setUser] = useState(initialUser);
 const [profileStats, setProfileStats] = useState(null);

 useEffect(() => {
 const fetchEnhancedProfileData = async () => {
 if (!initialUser) return;

 try {
 // Fetch additional profile data for enhanced display
 const [userProfile, testStats, achievements] = await Promise.all([
 dashboardApi.getUserProfile(),
 dashboardApi.getTestStatistics(),
 dashboardApi.getAchievements()
 ]);

 // Calculate enhanced profile statistics
 const totalXP = xpCalculationService.calculateTotalXP({
 tests: Array(testStats.totalTests).fill({ test_type: 'general', difficulty: 'medium', score: testStats.averageScore, questions_count: 10 }),
 achievements: achievements || []
 });

 const levelProgress = xpCalculationService.calculateLevelProgress(totalXP);
 const levelTitle = xpCalculationService.getLevelTitle(levelProgress.currentLevel);

 // Calculate member since date
 const memberSince = userProfile?.created_at ? new Date(userProfile.created_at) : new Date();
 const lastActivity = userProfile?.last_login ? new Date(userProfile.last_login) : new Date();

 // Enhanced user data
 const enhancedUser = {
 ...initialUser,
 ...userProfile,
 level: levelProgress.currentLevel,
 levelTitle,
 totalXP,
 memberSince: memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
 lastActivity: formatLastActivity(lastActivity),
 completionRate: calculateProfileCompletion(userProfile),
 skillsCount: userProfile?.skills?.length || initialUser?.declaredSkills?.length || 0,
 achievementsCount: achievements?.filter(a => a.earned).length || 0
 };

 setUser(enhancedUser);
 setProfileStats({
 testsCompleted: testStats.totalTests || 0,
 averageScore: Math.round(testStats.averageScore || 0),
 skillLevel: testStats.skillLevel || 'Novice',
 progressPercentage: levelProgress.progressPercentage
 });

 } catch (error) {
 console.error('Error fetching enhanced profile data:', error);
 // Use initial user data as fallback
 }
 };

 fetchEnhancedProfileData();
 }, [initialUser]);

 const formatLastActivity = (date) => {
 const now = new Date();
 const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

 if (diffInHours < 1) return 'Active now';
 if (diffInHours < 24) return `${diffInHours}h ago`;

 const diffInDays = Math.floor(diffInHours / 24);
 if (diffInDays < 7) return `${diffInDays}d ago`;

 return date.toLocaleDateString();
 };

 const calculateProfileCompletion = (profile) => {
 if (!profile) return 0;

 let completed = 0;
 let total = 6;

 if (profile.full_name) completed++;
 if (profile.bio) completed++;
 if (profile.location) completed++;
 if (profile.profession) completed++;
 if (profile.skills && profile.skills.length > 0) completed++;
 if (profile.profile_picture) completed++;

 return Math.round((completed / total) * 100);
 };

 const getStatusColor = (lastActivity) => {
 if (!lastActivity) return 'bg-gray-500';
 if (lastActivity === 'Active now') return 'bg-green-500';
 if (lastActivity.includes('h ago')) return 'bg-yellow-500';
 if (lastActivity.includes('d ago')) return 'bg-orange-500';
 return 'bg-gray-500';
 };

 if (!user) {
 return (
 <div className="sa-card sa-fade-in">
 <div className="animate-pulse flex items-center space-x-4">
 <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
 <div className="flex-1 space-y-2">
 <div className="h-6 bg-gray-200 rounded w-32"></div>
 <div className="h-4 bg-gray-200 rounded w-48"></div>
 <div className="h-2 bg-gray-200 rounded w-full"></div>
 </div>
 </div>
 </div>
 );
 }

 return (
 <motion.div
 className="sa-card sa-fade-in"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 <div className="flex items-center space-x-4">
 {/* Enhanced Avatar Section */}
 <div className="relative">
 <div className="sa-avatar relative">
 {user.profile_picture ? (
 <img
 src={user.profile_picture}
 alt={user.name || user.full_name}
 className="w-full h-full object-cover rounded-full"
 />
 ) : (
 <span className="text-xl font-bold">
 {(user.name || user.full_name || 'U').charAt(0).toUpperCase()}
 </span>
 )}
 {/* Status indicator */}
 <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.lastActivity)} rounded-full border-2 border-white`}></div>
 </div>
 <div className="sa-level-badge flex items-center space-x-1">
 <Star className="w-3 h-3" />
 <span>Lvl {user.level}</span>
 </div>
 </div>

 {/* Enhanced Profile Information */}
 <div className="flex-1 min-w-0">
 {/* Name and Title */}
 <div className="mb-2">
 <h2 className="sa-heading-1 truncate">{user.name || user.full_name}</h2>
 <div className="flex items-center space-x-2 text-sm text-gray-600">
 <span>Level {user.level} {user.levelTitle || 'Career Explorer'}</span>
 {user.profession && (
 <>
 <span>•</span>
 <div className="flex items-center space-x-1">
 <Briefcase className="w-3 h-3" />
 <span className="truncate">{user.profession}</span>
 </div>
 </>
 )}
 </div>
 </div>

 {/* Enhanced Stats Row */}
 <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-gray-500">
 {user.memberSince && (
 <div className="flex items-center space-x-1 flex-shrink-0">
 <Calendar className="w-3 h-3" />
 <span className="whitespace-nowrap">Since {user.memberSince}</span>
 </div>
 )}
 {user.lastActivity && (
 <div className="flex items-center space-x-1 flex-shrink-0">
 <Clock className="w-3 h-3" />
 <span className="whitespace-nowrap">{user.lastActivity}</span>
 </div>
 )}
 {profileStats && (
 <div className="flex items-center space-x-1 flex-shrink-0">
 <TrendingUp className="w-3 h-3" />
 <span className="whitespace-nowrap">{profileStats.testsCompleted} tests</span>
 </div>
 )}
 {user.achievementsCount > 0 && (
 <div className="flex items-center space-x-1 flex-shrink-0">
 <Award className="w-3 h-3" />
 <span className="whitespace-nowrap">{user.achievementsCount} achievement{user.achievementsCount !== 1 ? 's' : ''}</span>
 </div>
 )}
 </div>

 {/* Enhanced Progress Section */}
 <div className="mb-4">
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center space-x-2">
 <Target className="w-4 h-4 text-blue-600" />
 <span className="sa-body">Career Progress</span>
 </div>
 <div className="flex items-center space-x-2">
 <span className="sa-body font-semibold text-blue-600">
 {user.overallScore || profileStats?.averageScore || 0}%
 </span>
 {profileStats && (
 <span className="text-xs text-gray-500">
 ({profileStats.skillLevel})
 </span>
 )}
 </div>
 </div>
 <div className="sa-progress">
 <motion.div
 className="sa-progress-bar"
 initial={{ width: 0 }}
 animate={{ width: `${user.overallScore || profileStats?.averageScore || 0}%` }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 />
 </div>
 {/* Profile completion indicator */}
 <div className="flex justify-between text-xs text-gray-500 mt-1">
 <span>Profile: {user.completionRate || 0}% complete</span>
 {profileStats && (
 <span>Level Progress: {profileStats.progressPercentage}%</span>
 )}
 </div>
 </div>

 {/* Enhanced Skills Section */}
 <div className="flex flex-wrap gap-2">
 {(user.skills || user.declaredSkills || []).slice(0, 4).map((skill, index) => (
 <motion.span
 key={index}
 className="sa-chip sa-chip-primary"
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.3, delay: index * 0.1 }}
 >
 {skill.name || skill}
 </motion.span>
 ))}
 {(user.skills || user.declaredSkills || []).length > 4 && (
 <span className="sa-chip bg-gray-100 text-gray-600 text-xs">
 +{(user.skills || user.declaredSkills || []).length - 4} more
 </span>
 )}
 {(!user.skills && !user.declaredSkills) || (user.skills || user.declaredSkills || []).length === 0 && (
 <span className="text-xs text-gray-500 italic">No skills added yet</span>
 )}
 </div>
 </div>
 </div>
 </motion.div>
 );
};

export default ProfileHeader;