import React, { useState } from 'react';
import {
 ChevronLeftIcon,
 ChevronRightIcon,
 BookOpenIcon,
 AcademicCapIcon,
 BriefcaseIcon,
 DocumentTextIcon,
 UserGroupIcon,
 ArrowRightIcon,
 StarIcon,
 ClockIcon,
 EyeIcon
} from '@heroicons/react/24/outline';

const CareerAdvicePage = () => {
 const [activeCarousel, setActiveCarousel] = useState({});

 // Sample data for each category
 const contentSections = [
 {
 id: 'ibm-skillsbuild',
 title: 'Formation en ligne - IBM SkillsBuild',
 description: 'Développez vos compétences avec les cours certifiés IBM',
 articles: [
 {
 id: 1,
 title: 'Introduction à l\'intelligence artificielle',
 category: 'IBM SkillsBuild',
 image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&crop=center',
 readTime: '4 min',
 views: '2.3k',
 rating: 4.8,
 description: 'Découvrez les fondamentaux de l\'IA et ses applications pratiques'
 },
 {
 id: 2,
 title: 'Cloud Computing avec IBM Cloud',
 category: 'IBM SkillsBuild',
 image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop&crop=center',
 readTime: '6 min',
 views: '1.8k',
 rating: 4.6,
 description: 'Maîtrisez les services cloud IBM et leurs cas d\'usage'
 },
 {
 id: 3,
 title: 'Cybersécurité et protection des données',
 category: 'IBM SkillsBuild',
 image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop&crop=center',
 readTime: '5 min',
 views: '3.1k',
 rating: 4.9,
 description: 'Apprenez les meilleures pratiques de sécurité informatique'
 },
 {
 id: 4,
 title: 'Développement avec Watson',
 category: 'IBM SkillsBuild',
 image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&crop=center',
 readTime: '7 min',
 views: '1.5k',
 rating: 4.7,
 description: 'Intégrez l\'IA dans vos applications avec Watson'
 }
 ]
 },
 {
 id: 'interview-prep',
 title: 'Préparation aux entretiens',
 description: 'Conseils et techniques pour réussir vos entretiens d\'embauche',
 articles: [
 {
 id: 5,
 title: 'Les 10 questions les plus fréquentes en entretien',
 category: 'Entretiens',
 image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop&crop=center',
 readTime: '8 min',
 views: '5.2k',
 rating: 4.9,
 description: 'Préparez-vous aux questions classiques avec des réponses efficaces'
 },
 {
 id: 6,
 title: 'Comment présenter vos projets techniques',
 category: 'Entretiens',
 image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop&crop=center',
 readTime: '6 min',
 views: '3.7k',
 rating: 4.8,
 description: 'Structurez et présentez vos réalisations de manière convaincante'
 },
 {
 id: 7,
 title: 'Gérer le stress avant et pendant l\'entretien',
 category: 'Entretiens',
 image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
 readTime: '5 min',
 views: '4.1k',
 rating: 4.7,
 description: 'Techniques de relaxation et de confiance en soi'
 },
 {
 id: 8,
 title: 'Questions à poser au recruteur',
 category: 'Entretiens',
 image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&crop=center',
 readTime: '4 min',
 views: '2.9k',
 rating: 4.6,
 description: 'Montrez votre intérêt avec des questions pertinentes'
 }
 ]
 },
 {
 id: 'oracle-university',
 title: 'Formation en ligne - Oracle University',
 description: 'Certifications et formations Oracle pour votre carrière',
 articles: [
 {
 id: 9,
 title: 'Oracle Database Administration Fundamentals',
 category: 'Oracle University',
 image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center',
 readTime: '12 min',
 views: '1.9k',
 rating: 4.8,
 description: 'Apprenez les bases de l\'administration de bases de données Oracle'
 },
 {
 id: 10,
 title: 'Java Programming avec Oracle JDK',
 category: 'Oracle University',
 image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=200&fit=crop&crop=center',
 readTime: '10 min',
 views: '2.4k',
 rating: 4.7,
 description: 'Maîtrisez Java avec les outils et frameworks Oracle'
 },
 {
 id: 11,
 title: 'Oracle Cloud Infrastructure (OCI)',
 category: 'Oracle University',
 image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop&crop=center',
 readTime: '9 min',
 views: '1.6k',
 rating: 4.9,
 description: 'Découvrez les services cloud Oracle et leurs avantages'
 },
 {
 id: 12,
 title: 'Préparation à la certification OCA',
 category: 'Oracle University',
 image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop&crop=center',
 readTime: '15 min',
 views: '1.2k',
 rating: 4.8,
 description: 'Guide complet pour réussir votre certification Oracle'
 }
 ]
 },
 {
 id: 'first-job-internships',
 title: 'Premier emploi et stages',
 description: 'Conseils pour débuter votre carrière professionnelle',
 articles: [
 {
 id: 13,
 title: 'Comment trouver un stage en entreprise',
 category: 'Premier emploi',
 image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=200&fit=crop&crop=center',
 readTime: '7 min',
 views: '6.3k',
 rating: 4.9,
 description: 'Stratégies efficaces pour décrocher le stage idéal'
 },
 {
 id: 14,
 title: 'Les compétences clés pour un premier emploi',
 category: 'Premier emploi',
 image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center',
 readTime: '6 min',
 views: '4.8k',
 rating: 4.7,
 description: 'Développez les compétences recherchées par les employeurs'
 },
 {
 id: 15,
 title: 'Réseautage professionnel pour débutants',
 category: 'Premier emploi',
 image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop&crop=center',
 readTime: '8 min',
 views: '3.5k',
 rating: 4.8,
 description: 'Construisez votre réseau professionnel dès le début'
 },
 {
 id: 16,
 title: 'Transition études-professionnel',
 category: 'Premier emploi',
 image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop&crop=center',
 readTime: '5 min',
 views: '2.7k',
 rating: 4.6,
 description: 'Conseils pour réussir votre entrée dans le monde du travail'
 }
 ]
 },
 {
 id: 'cv-writing',
 title: 'Rédaction du CV',
 description: 'Créez un CV qui vous démarque des autres candidats',
 articles: [
 {
 id: 17,
 title: 'Structure optimale d\'un CV moderne',
 category: 'CV',
 image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop&crop=center',
 readTime: '9 min',
 views: '7.1k',
 rating: 4.9,
 description: 'Organisez votre CV pour maximiser l\'impact'
 },
 {
 id: 18,
 title: 'Mots-clés à inclure dans votre CV',
 category: 'CV',
 image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop&crop=center',
 readTime: '6 min',
 views: '5.4k',
 rating: 4.8,
 description: 'Optimisez votre CV pour les systèmes de recrutement'
 },
 {
 id: 19,
 title: 'CV pour développeurs : exemples concrets',
 category: 'CV',
 image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&crop=center',
 readTime: '8 min',
 views: '4.2k',
 rating: 4.7,
 description: 'Modèles et conseils spécifiques aux métiers tech'
 },
 {
 id: 20,
 title: 'Erreurs à éviter dans votre CV',
 category: 'CV',
 image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
 readTime: '5 min',
 views: '3.8k',
 rating: 4.9,
 description: 'Les pièges courants qui peuvent coûter un emploi'
 }
 ]
 }
 ];

 const getCategoryIcon = (categoryId) => {
 switch (categoryId) {
 case 'ibm-skillsbuild':
 return <AcademicCapIcon className="w-6 h-6" />;
 case 'interview-prep':
 return <UserGroupIcon className="w-6 h-6" />;
 case 'oracle-university':
 return <BookOpenIcon className="w-6 h-6" />;
 case 'first-job-internships':
 return <BriefcaseIcon className="w-6 h-6" />;
 case 'cv-writing':
 return <DocumentTextIcon className="w-6 h-6" />;
 default:
 return <BookOpenIcon className="w-6 h-6" />;
 }
 };

 const getCategoryColor = (categoryId) => {
 switch (categoryId) {
 case 'ibm-skillsbuild':
 return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
 case 'interview-prep':
 return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
 case 'oracle-university':
 return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
 case 'first-job-internships':
 return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
 case 'cv-writing':
 return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
 default:
 return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
 }
 };

 const nextSlide = (sectionId) => {
 setActiveCarousel(prev => ({
 ...prev,
 [sectionId]: (prev[sectionId] || 0) + 1
 }));
 };

 const prevSlide = (sectionId) => {
 setActiveCarousel(prev => ({
 ...prev,
 [sectionId]: Math.max(0, (prev[sectionId] || 0) - 1)
 }));
 };

 const getVisibleArticles = (articles, sectionId) => {
 const currentIndex = activeCarousel[sectionId] || 0;
 const articlesPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
 return articles.slice(currentIndex, currentIndex + articlesPerView);
 };

 const canGoNext = (articles, sectionId) => {
 const currentIndex = activeCarousel[sectionId] || 0;
 const articlesPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
 return currentIndex + articlesPerView < articles.length;
 };

 const canGoPrev = (sectionId) => {
 return (activeCarousel[sectionId] || 0) > 0;
 };

 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* Header Section */}
 <div className="text-center mb-16">
 <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent mb-6">
 Unlock your career potential
 </h1>
 <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
 Découvrez nos conseils d'experts, préparez-vous aux entretiens et développez vos compétences
 avec des formations certifiées pour accélérer votre carrière.
 </p>
 </div>

 {/* Content Sections */}
 <div className="space-y-16">
 {contentSections.map((section) => (
 <div key={section.id} className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8">
 {/* Section Header */}
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center space-x-4">
 <div className={`p-3 rounded-xl ${getCategoryColor(section.id)}`}>
 {getCategoryIcon(section.id)}
 </div>
 <div>
 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
 {section.title}
 </h2>
 <p className="text-slate-600 dark:text-slate-400 mt-1">
 {section.description}
 </p>
 </div>
 </div>
 <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
 <span>Voir tout</span>
 <ArrowRightIcon className="w-4 h-4" />
 </button>
 </div>

 {/* Carousel */}
 <div className="relative">
 {/* Articles Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {getVisibleArticles(section.articles, section.id).map((article) => (
 <div
 key={article.id}
 className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
 >
 {/* Article Image */}
 <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
 <img
 src={article.image}
 alt={article.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
 onError={(e) => {
 e.target.style.display = 'none';
 e.target.nextSibling.style.display = 'flex';
 }}
 />
 {/* Fallback when image fails to load */}
 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20" style={{ display: 'none' }}>
 <div className="text-center">
 <BookOpenIcon className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
 <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Article</p>
 </div>
 </div>
 <div className="absolute top-4 left-4">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(section.id)}`}>
 {article.category}
 </span>
 </div>
 <div className="absolute top-4 right-4">
 <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1">
 <StarIcon className="w-3 h-3 text-yellow-500" />
 <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
 {article.rating}
 </span>
 </div>
 </div>
 </div>

 {/* Article Content */}
 <div className="p-6">
 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
 {article.title}
 </h3>
 <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
 {article.description}
 </p>

 {/* Article Meta */}
 <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
 <div className="flex items-center space-x-4">
 <div className="flex items-center space-x-1">
 <ClockIcon className="w-3 h-3" />
 <span>{article.readTime}</span>
 </div>
 <div className="flex items-center space-x-1">
 <EyeIcon className="w-3 h-3" />
 <span>{article.views}</span>
 </div>
 </div>
 <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
 Lire →
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Carousel Navigation */}
 {section.articles.length > 3 && (
 <div className="flex items-center justify-center mt-8 space-x-4">
 <button
 onClick={() => prevSlide(section.id)}
 disabled={!canGoPrev(section.id)}
 className={`p-2 rounded-full transition-all duration-200 ${canGoPrev(section.id)
 ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
 : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
 }`}
 >
 <ChevronLeftIcon className="w-5 h-5" />
 </button>

 {/* Dots Indicator */}
 <div className="flex space-x-2">
 {Array.from({ length: Math.ceil(section.articles.length / 3) }).map((_, index) => (
 <button
 key={index}
 onClick={() => setActiveCarousel(prev => ({ ...prev, [section.id]: index }))}
 className={`w-2 h-2 rounded-full transition-all duration-200 ${(activeCarousel[section.id] || 0) === index
 ? 'bg-blue-600 dark:bg-blue-400'
 : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
 }`}
 />
 ))}
 </div>

 <button
 onClick={() => nextSlide(section.id)}
 disabled={!canGoNext(section.articles, section.id)}
 className={`p-2 rounded-full transition-all duration-200 ${canGoNext(section.articles, section.id)
 ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
 : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
 }`}
 >
 <ChevronRightIcon className="w-5 h-5" />
 </button>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>

 {/* Call to Action */}
 <div className="mt-16 text-center">
 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
 <h3 className="text-2xl font-bold mb-4">
 Prêt à accélérer votre carrière ?
 </h3>
 <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
 Rejoignez des milliers de professionnels qui développent leurs compétences
 et trouvent leur emploi idéal grâce à nos conseils et formations.
 </p>
 <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
 Commencer maintenant
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

export default CareerAdvicePage;
