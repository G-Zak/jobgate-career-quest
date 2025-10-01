import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import {
 EyeIcon,
 EyeSlashIcon,
 EnvelopeIcon,
 LockClosedIcon,
 UserIcon,
 ExclamationCircleIcon,
 CheckCircleIcon
} from '@heroicons/react/24/outline';

const RegisterPage = () => {
 const { isDarkMode } = useDarkMode();
 const { register, loading } = useAuth();
 const navigate = useNavigate();

 const [formData, setFormData] = useState({
 full_name: '',
 email: '',
 password: '',
 confirm_password: '',
 location: '',
 profession: '',
 career_field: '',
 level: 'Beginner'
 });
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 const handleChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({
 ...prev,
 [name]: value
 }));
 // Clear error when user starts typing
 if (error) setError('');
 };

 const validateForm = () => {
 if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
 setError('Veuillez remplir tous les champs');
 return false;
 }

 if (formData.full_name.length < 2) {
 setError('Le nom doit contenir au moins 2 caractères');
 return false;
 }

 if (!formData.email.includes('@')) {
 setError('Veuillez entrer une adresse email valide');
 return false;
 }

 if (formData.password.length < 6) {
 setError('Le mot de passe doit contenir au moins 6 caractères');
 return false;
 }

 if (formData.password !== formData.confirm_password) {
 setError('Les mots de passe ne correspondent pas');
 return false;
 }

 return true;
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setSuccess('');

 if (!validateForm()) {
 return;
 }

 try {
 const result = await register({
 full_name: formData.full_name,
 email: formData.email,
 password: formData.password,
 confirm_password: formData.confirm_password,
 location: formData.location,
 profession: formData.profession,
 career_field: formData.career_field,
 level: formData.level
 });

 if (result.success) {
 setSuccess('Compte créé avec succès !');
 setTimeout(() => {
 navigate('/dashboard');
 }, 1000);
 } else {
 setError(result.error || 'Erreur lors de la création du compte');
 }
 } catch (err) {
 setError('Une erreur inattendue s\'est produite');
 }
 };

 return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
 <div className="sm:mx-auto sm:w-full sm:max-w-md">
 <div className="text-center">
 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
 Créer un compte
 </h2>
 <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
 Rejoignez JobGate et trouvez votre emploi idéal
 </p>
 </div>
 </div>

 <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
 <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
 <form className="space-y-6" onSubmit={handleSubmit}>
 {/* Error Message */}
 {error && (
 <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
 <div className="flex">
 <div className="flex-shrink-0">
 <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
 </div>
 <div className="ml-3">
 <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
 {error}
 </h3>
 </div>
 </div>
 </div>
 )}

 {/* Success Message */}
 {success && (
 <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
 <div className="flex">
 <div className="flex-shrink-0">
 <CheckCircleIcon className="h-5 w-5 text-green-400" />
 </div>
 <div className="ml-3">
 <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
 {success}
 </h3>
 </div>
 </div>
 </div>
 )}

 {/* Name Field */}
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Nom complet
 </label>
 <div className="mt-1 relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <UserIcon className="h-5 w-5 text-gray-400" />
 </div>
 <input
 id="full_name"
 name="full_name"
 type="text"
 autoComplete="name"
 required
 value={formData.full_name}
 onChange={handleChange}
 className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="Votre nom complet"
 />
 </div>
 </div>

 {/* Email Field */}
 <div>
 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Adresse email
 </label>
 <div className="mt-1 relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <EnvelopeIcon className="h-5 w-5 text-gray-400" />
 </div>
 <input
 id="email"
 name="email"
 type="email"
 autoComplete="email"
 required
 value={formData.email}
 onChange={handleChange}
 className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="votre@email.com"
 />
 </div>
 </div>

 {/* Password Field */}
 <div>
 <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Mot de passe
 </label>
 <div className="mt-1 relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <LockClosedIcon className="h-5 w-5 text-gray-400" />
 </div>
 <input
 id="password"
 name="password"
 type={showPassword ? 'text' : 'password'}
 autoComplete="new-password"
 required
 value={formData.password}
 onChange={handleChange}
 className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="Votre mot de passe"
 />
 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
 <button
 type="button"
 className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
 onClick={() => setShowPassword(!showPassword)}
 >
 {showPassword ? (
 <EyeSlashIcon className="h-5 w-5" />
 ) : (
 <EyeIcon className="h-5 w-5" />
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Confirm Password Field */}
 <div>
 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Confirmer le mot de passe
 </label>
 <div className="mt-1 relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <LockClosedIcon className="h-5 w-5 text-gray-400" />
 </div>
 <input
 id="confirm_password"
 name="confirm_password"
 type={showConfirmPassword ? 'text' : 'password'}
 autoComplete="new-password"
 required
 value={formData.confirm_password}
 onChange={handleChange}
 className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="Confirmez votre mot de passe"
 />
 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
 <button
 type="button"
 className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 >
 {showConfirmPassword ? (
 <EyeSlashIcon className="h-5 w-5" />
 ) : (
 <EyeIcon className="h-5 w-5" />
 )}
 </button>
 </div>
 </div>
 </div>

 {/* Location Field */}
 <div>
 <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Localisation
 </label>
 <div className="mt-1">
 <input
 id="location"
 name="location"
 type="text"
 value={formData.location}
 onChange={handleChange}
 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="Ville, Pays (ex: Casablanca, Maroc)"
 />
 </div>
 </div>

 {/* Profession Field */}
 <div>
 <label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Profession
 </label>
 <div className="mt-1">
 <input
 id="profession"
 name="profession"
 type="text"
 value={formData.profession}
 onChange={handleChange}
 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="Votre profession (ex: Développeur Web)"
 />
 </div>
 </div>

 {/* Career Field */}
 <div>
 <label htmlFor="career_field" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Domaine de carrière
 </label>
 <div className="mt-1">
 <input
 id="career_field"
 name="career_field"
 type="text"
 value={formData.career_field}
 onChange={handleChange}
 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 placeholder="Ex: Technologie, Finance, Santé..."
 />
 </div>
 </div>

 {/* Level Field */}
 <div>
 <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
 Niveau d'expérience
 </label>
 <div className="mt-1">
 <select
 id="level"
 name="level"
 value={formData.level}
 onChange={handleChange}
 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
 >
 <option value="Beginner">Débutant</option>
 <option value="Intermediate">Intermédiaire</option>
 <option value="Advanced">Avancé</option>
 <option value="Expert">Expert</option>
 </select>
 </div>
 </div>

 {/* Submit Button */}
 <div>
 <button
 type="submit"
 disabled={loading}
 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
 >
 {loading ? (
 <div className="flex items-center">
 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
 Création...
 </div>
 ) : (
 'Créer mon compte'
 )}
 </button>
 </div>

 {/* Login Link */}
 <div className="text-center">
 <p className="text-sm text-gray-600 dark:text-gray-400">
 Déjà un compte ?{' '}
 <Link
 to="/login"
 className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
 >
 Se connecter
 </Link>
 </p>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
};

export default RegisterPage;
