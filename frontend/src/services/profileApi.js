// Profile API Service for database operations
class ProfileApiService {
 constructor() {
 this.baseURL = 'http://localhost:8001';
 }

 getAuthHeaders() {
 const token = localStorage.getItem('access_token');
 return token ? { 'Authorization': `Bearer ${token}` } : {};
 }

 // Update user skills in database
 async updateUserSkills(candidateId, skills, skillsWithProficiency = null) {
 try {
 const skillIds = await this.getOrCreateSkillIds(skills);

 const response = await fetch(`${this.baseURL}/api/candidates/update_skills/`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 ...this.getAuthHeaders(),
 },
 body: JSON.stringify({
 candidate_id: candidateId,
 skill_ids: skillIds,
 skills_with_proficiency: skillsWithProficiency || []
 })
 });

 if (!response.ok) {
 throw new Error(`HTTP error! status: ${response.status}`);
 }

 const result = await response.json();
 console.log('Skills updated in database:', result);
 return result;
 } catch (error) {
 console.error('Error updating skills in database:', error);
 throw error;
 }
 }

 // Get or create skill IDs for skill names
 async getOrCreateSkillIds(skillNames) {
 try {
 const skillIds = [];

 // Get all existing skills first
 const skillsResponse = await fetch(`${this.baseURL}/api/skills/`, {
 headers: {
 'Content-Type': 'application/json',
 ...this.getAuthHeaders()
 }
 });
 const existingSkills = await skillsResponse.json();

 for (const skillName of skillNames) {
 // Check if skill already exists
 let skill = existingSkills.find(s =>
 s.name.toLowerCase() === skillName.toLowerCase()
 );

 if (!skill) {
 // Create new skill
 const createResponse = await fetch(`${this.baseURL}/api/skills/`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 ...this.getAuthHeaders()
 },
 body: JSON.stringify({
 name: skillName,
 category: 'programming',
 description: `${skillName} skill`
 })
 });

 if (createResponse.ok) {
 skill = await createResponse.json();
 }
 }

 if (skill) {
 skillIds.push(skill.id);
 }
 }

 return skillIds;
 } catch (error) {
 console.error('Error getting/creating skill IDs:', error);
 return [];
 }
 }

 // Update user profile in database
 async updateUserProfile(candidateId, profileData) {
 try {
 const response = await fetch(`${this.baseURL}/api/skills/candidates/${candidateId}/`, {
 method: 'PATCH',
 headers: {
 'Content-Type': 'application/json',
 ...this.getAuthHeaders(),
 },
 body: JSON.stringify(profileData)
 });

 if (!response.ok) {
 throw new Error(`HTTP error! status: ${response.status}`);
 }

 const result = await response.json();
 console.log('Profile updated in database:', result);
 return result;
 } catch (error) {
 console.error('Error updating profile in database:', error);
 throw error;
 }
 }

 // Upload profile photo
 async uploadProfilePhoto(candidateId, photoFile) {
 try {
 const formData = new FormData();
 formData.append('photo', photoFile);

 const response = await fetch(`${this.baseURL}/api/skills/candidates/${candidateId}/upload_photo/`, {
 method: 'POST',
 headers: {
 ...this.getAuthHeaders()
 },
 body: formData
 });

 if (!response.ok) {
 throw new Error(`HTTP error! status: ${response.status}`);
 }

 const result = await response.json();
 console.log('Photo uploaded successfully:', result);
 return result;
 } catch (error) {
 console.error('Error uploading photo:', error);
 throw error;
 }
 }

 // Remove profile photo
 async removeProfilePhoto(candidateId) {
 try {
 const response = await fetch(`${this.baseURL}/api/skills/candidates/${candidateId}/remove_photo/`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 ...this.getAuthHeaders(),
 }
 });

 if (!response.ok) {
 throw new Error(`HTTP error! status: ${response.status}`);
 }

 const result = await response.json();
 console.log('Photo removed successfully:', result);
 return result;
 } catch (error) {
 console.error('Error removing photo:', error);
 throw error;
 }
 }
}

export const profileApiService = new ProfileApiService();
export default profileApiService;

