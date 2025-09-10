import React, { useState, useEffect } from 'react';
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaSave, 
    FaTimes, 
    FaQuestion,
    FaCog,
    FaList,
    FaEye,
    FaClipboardList
} from 'react-icons/fa';

const TestAdministration = ({ onBackToDashboard }) => {
    const [activeTab, setActiveTab] = useState('tests'); // tests, questions, results
    const [skills, setSkills] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showTestModal, setShowTestModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Charger les compétences
            const skillsResponse = await fetch('http://localhost:3001/api/skills/available');
            const skillsData = await skillsResponse.json();
            setSkills(skillsData.skills);

            // Charger tous les tests existants
            await loadTests();
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const loadTests = async () => {
        try {
            // Pour charger tous les tests, on va faire une requête directe
            const response = await fetch('http://localhost:3001/api/skills/all-tests');
            if (response.ok) {
                const data = await response.json();
                setTests(data.tests);
            }
        } catch (error) {
            console.error('Error loading tests:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FaCog className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
                    <p>Chargement de l'administration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <button
                    onClick={onBackToDashboard}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <FaTimes className="mr-2" />
                    Retour au tableau de bord
                </button>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Administration des Tests</h1>
                <p className="text-gray-600">
                    Gérez vos tests personnalisés, ajoutez des questions et consultez les résultats.
                </p>
            </div>

            {/* Onglets */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'tests', label: 'Mes Tests', icon: FaClipboardList },
                        { id: 'create', label: 'Créer un Test', icon: FaPlus },
                        { id: 'results', label: 'Résultats', icon: FaEye }
                    ].map(tab => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <IconComponent className="mr-2" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'tests' && (
                <TestsList 
                    tests={tests} 
                    skills={skills}
                    onEditTest={setEditingTest}
                    onDeleteTest={(testId) => {
                        setTests(tests.filter(t => t.id !== testId));
                    }}
                    onSelectTest={setSelectedTest}
                />
            )}

            {activeTab === 'create' && (
                <CreateTestForm 
                    skills={skills}
                    editingTest={editingTest}
                    onTestCreated={(newTest) => {
                        setTests([...tests, newTest]);
                        setEditingTest(null);
                        setActiveTab('tests');
                    }}
                    onCancel={() => {
                        setEditingTest(null);
                        setActiveTab('tests');
                    }}
                />
            )}

            {activeTab === 'results' && (
                <TestResults />
            )}
        </div>
    );
};

// Composant pour lister les tests
const TestsList = ({ tests, skills, onEditTest, onDeleteTest, onSelectTest }) => {
    const getSkillName = (skillId) => {
        const skill = skills.find(s => s.id === skillId);
        return skill ? skill.name : 'Compétence inconnue';
    };

    const deleteTest = async (testId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/skills/admin/test/${testId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                onDeleteTest(testId);
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting test:', error);
            alert('Erreur lors de la suppression');
        }
    };

    if (tests.length === 0) {
        return (
            <div className="text-center py-12">
                <FaClipboardList className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun test créé</h3>
                <p className="text-gray-600 mb-6">Commencez par créer votre premier test personnalisé.</p>
                <button
                    onClick={() => setActiveTab('create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaPlus className="inline mr-2" />
                    Créer mon premier test
                </button>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
                <div key={test.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                                {test.test_name}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {getSkillName(test.skill_id)}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {test.description}
                        </p>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Score total:</span>
                                <span className="font-medium">{test.total_score} points</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Durée:</span>
                                <span className="font-medium">{test.time_limit} minutes</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Questions:</span>
                                <span className="font-medium">{test.question_count || 0}</span>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => onSelectTest(test)}
                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                                <FaEye className="inline mr-1" />
                                Voir
                            </button>
                            <button
                                onClick={() => onEditTest(test)}
                                className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                                <FaEdit className="inline mr-1" />
                                Modifier
                            </button>
                            <button
                                onClick={() => deleteTest(test.id)}
                                className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Composant pour créer/modifier un test
const CreateTestForm = ({ skills, editingTest, onTestCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        skillId: '',
        testName: '',
        description: '',
        totalScore: 10,
        timeLimit: 30,
        instructions: '',
        questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'a',
        points: 1,
        explanation: ''
    });

    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);

    useEffect(() => {
        if (editingTest) {
            setFormData({
                skillId: editingTest.skill_id,
                testName: editingTest.test_name,
                description: editingTest.description,
                totalScore: editingTest.total_score,
                timeLimit: editingTest.time_limit,
                instructions: editingTest.instructions,
                questions: editingTest.questions || []
            });
        }
    }, [editingTest]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleQuestionChange = (field, value) => {
        setCurrentQuestion(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addQuestion = () => {
        if (!currentQuestion.questionText.trim()) {
            alert('Veuillez saisir le texte de la question');
            return;
        }

        const newQuestions = [...formData.questions];
        
        if (editingQuestionIndex >= 0) {
            newQuestions[editingQuestionIndex] = { ...currentQuestion };
            setEditingQuestionIndex(-1);
        } else {
            newQuestions.push({ ...currentQuestion });
        }

        setFormData(prev => ({
            ...prev,
            questions: newQuestions
        }));

        // Reset form
        setCurrentQuestion({
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'a',
            points: 1,
            explanation: ''
        });
        setShowQuestionForm(false);
    };

    const editQuestion = (index) => {
        setCurrentQuestion(formData.questions[index]);
        setEditingQuestionIndex(index);
        setShowQuestionForm(true);
    };

    const deleteQuestion = (index) => {
        if (!confirm('Supprimer cette question ?')) return;
        
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };

    const saveTest = async () => {
        if (!formData.skillId || !formData.testName.trim()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (formData.questions.length === 0) {
            alert('Veuillez ajouter au moins une question');
            return;
        }

        try {
            const url = editingTest 
                ? `http://localhost:3001/api/skills/admin/test/${editingTest.id}`
                : 'http://localhost:3001/api/skills/admin/test';
            
            const method = editingTest ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                onTestCreated(data.test);
                alert(editingTest ? 'Test modifié avec succès!' : 'Test créé avec succès!');
            } else {
                alert('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving test:', error);
            alert('Erreur lors de la sauvegarde');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {editingTest ? 'Modifier le test' : 'Créer un nouveau test'}
                    </h2>
                </div>

                {/* Informations générales du test */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compétence *
                        </label>
                        <select
                            value={formData.skillId}
                            onChange={(e) => handleInputChange('skillId', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Sélectionner une compétence</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name} ({skill.category})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du test *
                        </label>
                        <input
                            type="text"
                            value={formData.testName}
                            onChange={(e) => handleInputChange('testName', e.target.value)}
                            placeholder="Ex: Test JavaScript Avancé"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Description du test..."
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Score total
                        </label>
                        <input
                            type="number"
                            value={formData.totalScore}
                            onChange={(e) => handleInputChange('totalScore', parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Durée (minutes)
                        </label>
                        <input
                            type="number"
                            value={formData.timeLimit}
                            onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instructions
                        </label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => handleInputChange('instructions', e.target.value)}
                            placeholder="Instructions pour les candidats..."
                            rows="2"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Section Questions */}
                <div className="border-t pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Questions ({formData.questions.length})
                        </h3>
                        <button
                            onClick={() => setShowQuestionForm(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FaPlus className="inline mr-2" />
                            Ajouter une question
                        </button>
                    </div>

                    {/* Liste des questions */}
                    <div className="space-y-4 mb-6">
                        {formData.questions.map((q, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800">
                                        Question {index + 1} ({q.points} pts)
                                    </h4>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => editQuestion(index)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{q.questionText}</p>
                                <div className="text-xs text-gray-500">
                                    Réponse correcte: {q.correctAnswer.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Formulaire d'ajout de question */}
                    {showQuestionForm && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                            <h4 className="font-semibold text-gray-800 mb-4">
                                {editingQuestionIndex >= 0 ? 'Modifier la question' : 'Nouvelle question'}
                            </h4>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Question *
                                    </label>
                                    <textarea
                                        value={currentQuestion.questionText}
                                        onChange={(e) => handleQuestionChange('questionText', e.target.value)}
                                        placeholder="Tapez votre question ici..."
                                        rows="3"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Option A
                                        </label>
                                        <input
                                            type="text"
                                            value={currentQuestion.optionA}
                                            onChange={(e) => handleQuestionChange('optionA', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Option B
                                        </label>
                                        <input
                                            type="text"
                                            value={currentQuestion.optionB}
                                            onChange={(e) => handleQuestionChange('optionB', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Option C
                                        </label>
                                        <input
                                            type="text"
                                            value={currentQuestion.optionC}
                                            onChange={(e) => handleQuestionChange('optionC', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Option D
                                        </label>
                                        <input
                                            type="text"
                                            value={currentQuestion.optionD}
                                            onChange={(e) => handleQuestionChange('optionD', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bonne réponse
                                        </label>
                                        <select
                                            value={currentQuestion.correctAnswer}
                                            onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="a">Option A</option>
                                            <option value="b">Option B</option>
                                            <option value="c">Option C</option>
                                            <option value="d">Option D</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Points
                                        </label>
                                        <input
                                            type="number"
                                            value={currentQuestion.points}
                                            onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 1)}
                                            min="1"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Explication (optionnel)
                                    </label>
                                    <textarea
                                        value={currentQuestion.explanation}
                                        onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                                        placeholder="Explication de la bonne réponse..."
                                        rows="2"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={addQuestion}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <FaSave className="inline mr-2" />
                                        {editingQuestionIndex >= 0 ? 'Modifier' : 'Ajouter'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowQuestionForm(false);
                                            setEditingQuestionIndex(-1);
                                            setCurrentQuestion({
                                                questionText: '',
                                                optionA: '',
                                                optionB: '',
                                                optionC: '',
                                                optionD: '',
                                                correctAnswer: 'a',
                                                points: 1,
                                                explanation: ''
                                            });
                                        }}
                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <FaTimes className="inline mr-2" />
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Boutons de sauvegarde */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                        onClick={onCancel}
                        className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={saveTest}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaSave className="inline mr-2" />
                        {editingTest ? 'Modifier le test' : 'Créer le test'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Composant pour afficher les résultats
const TestResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/skills/admin/all-results');
            if (response.ok) {
                const data = await response.json();
                setResults(data.results);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading results:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Chargement des résultats...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Résultats des tests</h2>
            {results.length === 0 ? (
                <div className="text-center py-12">
                    <FaEye className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun résultat disponible</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Candidat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Test
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pourcentage
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((result, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {result.user_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {result.test_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {result.score}/{result.total_score}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                                            result.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                                            result.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {result.percentage}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(result.completed_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TestAdministration;
