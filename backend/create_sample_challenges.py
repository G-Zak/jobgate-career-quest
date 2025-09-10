#!/usr/bin/env python3
"""
Script pour créer des défis de codage de test
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import CodingChallenge

def create_sample_challenges():
    """Créer des défis de codage de test"""
    
    challenges = [
        {
            'title': 'Vérifier un palindrome',
            'slug': 'palindrome-check',
            'description': 'Vérifiez si une chaîne est un palindrome.',
            'difficulty': 'beginner',
            'category': 'string_manipulation',
            'language': 'python',
            'problem_statement': '''Écrivez une fonction qui vérifie si une chaîne de caractères est un palindrome.

Un palindrome est un mot, une phrase, ou une séquence qui se lit de la même manière de gauche à droite et de droite à gauche.

**Exemple :**
- "radar" → True
- "hello" → False
- "A man a plan a canal Panama" → True (en ignorant les espaces et la casse)

**Instructions :**
- Ignorez les espaces et la casse
- Retournez True si c'est un palindrome, False sinon''',
            'input_format': 'Une chaîne de caractères',
            'output_format': 'True ou False',
            'constraints': 'La chaîne peut contenir des lettres, des chiffres et des espaces',
            'starter_code': '''def is_palindrome(s):
    """
    Vérifie si une chaîne est un palindrome
    
    Args:
        s (str): La chaîne à vérifier
    
    Returns:
        bool: True si c'est un palindrome, False sinon
    """
    # Votre code ici
    pass

# Tests
print(is_palindrome("radar"))  # True
print(is_palindrome("hello"))  # False
print(is_palindrome("A man a plan a canal Panama"))  # True''',
            'solution_code': '''def is_palindrome(s):
    # Nettoyer la chaîne : enlever les espaces et convertir en minuscules
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    
    # Vérifier si la chaîne nettoyée est égale à son inverse
    return cleaned == cleaned[::-1]''',
            'test_cases': [
                {'input': '"radar"', 'expected_output': 'True', 'is_hidden': False},
                {'input': '"hello"', 'expected_output': 'False', 'is_hidden': False},
                {'input': '"A man a plan a canal Panama"', 'expected_output': 'True', 'is_hidden': True},
                {'input': '"race a car"', 'expected_output': 'False', 'is_hidden': True},
            ],
            'tags': ['string', 'palindrome', 'beginner'],
            'estimated_time_minutes': 15,
        },
        {
            'title': 'Somme de deux nombres',
            'slug': 'two-sum',
            'description': 'Trouvez deux nombres dans un tableau qui additionnent à une cible donnée.',
            'difficulty': 'beginner',
            'category': 'algorithms',
            'language': 'python',
            'problem_statement': '''Étant donné un tableau d'entiers et une valeur cible, trouvez les indices de deux nombres qui additionnent à la cible.

Vous pouvez supposer qu'il y a exactement une solution, et vous ne pouvez pas utiliser le même élément deux fois.

**Exemple :**
```
nums = [2, 7, 11, 15], target = 9
Résultat : [0, 1]
Explication : nums[0] + nums[1] = 2 + 7 = 9
```

**Instructions :**
- Retournez les indices sous forme de liste
- L'ordre des indices n'est pas important''',
            'input_format': 'Un tableau d\'entiers et un entier cible',
            'output_format': 'Une liste de deux indices',
            'constraints': '2 ≤ nums.length ≤ 1000, -10^9 ≤ nums[i] ≤ 10^9',
            'starter_code': '''def two_sum(nums, target):
    """
    Trouve les indices de deux nombres qui additionnent à la cible
    
    Args:
        nums (List[int]): Liste d'entiers
        target (int): Valeur cible
    
    Returns:
        List[int]: Indices des deux nombres
    """
    # Votre code ici
    pass

# Tests
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]''',
            'solution_code': '''def two_sum(nums, target):
    # Utiliser un dictionnaire pour stocker les valeurs et leurs indices
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []  # Aucune solution trouvée''',
            'test_cases': [
                {'input': '[2, 7, 11, 15], 9', 'expected_output': '[0, 1]', 'is_hidden': False},
                {'input': '[3, 2, 4], 6', 'expected_output': '[1, 2]', 'is_hidden': False},
                {'input': '[3, 3], 6', 'expected_output': '[0, 1]', 'is_hidden': True},
            ],
            'tags': ['array', 'hash-table', 'beginner'],
            'estimated_time_minutes': 20,
        },
        {
            'title': 'FizzBuzz',
            'slug': 'fizzbuzz',
            'description': 'Implémentez le classique problème FizzBuzz.',
            'difficulty': 'beginner',
            'category': 'algorithms',
            'language': 'python',
            'problem_statement': '''Écrivez un programme qui affiche les nombres de 1 à n. Mais :
- Pour les multiples de 3, affichez "Fizz" au lieu du nombre
- Pour les multiples de 5, affichez "Buzz" au lieu du nombre  
- Pour les multiples de 3 ET 5, affichez "FizzBuzz" au lieu du nombre

**Exemple pour n=15 :**
```
1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
```

**Instructions :**
- Retournez une liste de chaînes de caractères
- Les nombres normaux doivent être convertis en chaînes''',
            'input_format': 'Un entier n',
            'output_format': 'Une liste de chaînes',
            'constraints': '1 ≤ n ≤ 1000',
            'starter_code': '''def fizzbuzz(n):
    """
    Génère la séquence FizzBuzz pour les nombres de 1 à n
    
    Args:
        n (int): Nombre limite
    
    Returns:
        List[str]: Séquence FizzBuzz
    """
    # Votre code ici
    pass

# Tests
print(fizzbuzz(15))  # ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']''',
            'solution_code': '''def fizzbuzz(n):
    result = []
    
    for i in range(1, n + 1):
        if i % 15 == 0:  # Multiple de 3 ET 5
            result.append("FizzBuzz")
        elif i % 3 == 0:  # Multiple de 3
            result.append("Fizz")
        elif i % 5 == 0:  # Multiple de 5
            result.append("Buzz")
        else:
            result.append(str(i))
    
    return result''',
            'test_cases': [
                {'input': '15', 'expected_output': "['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']", 'is_hidden': False},
                {'input': '5', 'expected_output': "['1', '2', 'Fizz', '4', 'Buzz']", 'is_hidden': False},
                {'input': '3', 'expected_output': "['1', '2', 'Fizz']", 'is_hidden': True},
            ],
            'tags': ['math', 'string', 'beginner'],
            'estimated_time_minutes': 10,
        }
    ]
    
    created_count = 0
    for challenge_data in challenges:
        challenge, created = CodingChallenge.objects.get_or_create(
            slug=challenge_data['slug'],
            defaults=challenge_data
        )
        
        if created:
            created_count += 1
            print(f"✅ Créé: {challenge.title}")
        else:
            print(f"⚠️  Existe déjà: {challenge.title}")
    
    print(f"\n🎉 {created_count} nouveau(x) défi(s) créé(s) !")
    return created_count

if __name__ == '__main__':
    create_sample_challenges()
