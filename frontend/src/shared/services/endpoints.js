// API Endpoints Configuration
// Centralized endpoint definitions

export const ENDPOINTS = {
 // Authentication
 AUTH: {
 LOGIN: '/auth/login/',
 REGISTER: '/auth/register/',
 LOGOUT: '/auth/logout/',
 REFRESH: '/auth/refresh/',
 PROFILE: '/auth/profile/',
 },

 // User Management
 USERS: {
 LIST: '/users/',
 DETAIL: (id) => `/users/${id}/`,
 UPDATE_PROFILE: (id) => `/users/${id}/profile/`,
 },

 // Dashboard Data
 DASHBOARD: {
 CANDIDATE: '/dashboard/candidate/',
 RECRUITER: '/dashboard/recruiter/',
 STATS: '/dashboard/stats/',
 },

 // Skills Assessment
 SKILLS: {
 LIST: '/skills/',
 CATEGORIES: '/skills/categories/',
 ASSESSMENT: '/skills/assessment/',
 RESULTS: '/skills/results/',
 USER_SKILLS: (userId) => `/skills/user/${userId}/`,
 },

 // Tests Engine
 TESTS: {
 LIST: '/tests/',
 DETAIL: (id) => `/tests/${id}/`,
 START: (id) => `/tests/${id}/start/`,
 SUBMIT: (id) => `/tests/${id}/submit/`,
 RESULTS: '/tests/results/',
 HISTORY: (userId) => `/tests/history/${userId}/`,
 },

 // Jobs & Recommendations
 JOBS: {
 LIST: '/jobs/',
 DETAIL: (id) => `/jobs/${id}/`,
 SEARCH: '/jobs/search/',
 APPLY: (id) => `/jobs/${id}/apply/`,
 RECOMMENDATIONS: '/jobs/recommendations/',
 },

 // Applications
 APPLICATIONS: {
 LIST: '/applications/',
 DETAIL: (id) => `/applications/${id}/`,
 STATUS: (id) => `/applications/${id}/status/`,
 WITHDRAW: (id) => `/applications/${id}/withdraw/`,
 },

 // Badges
 BADGES: {
 LIST: '/badges/',
 USER_BADGES: (userId) => `/badges/user/${userId}/`,
 AWARD: '/badges/award/',
 },
};

export default ENDPOINTS;
