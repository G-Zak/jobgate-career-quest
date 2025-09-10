#!/usr/bin/env python
"""
Script pour créer des défis de programmation de test
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerquest.settings')
django.setup()

from testsengine.models import CodingChallenge
from django.utils.text import slugify

def create_coding_challenges():
    """Créer des défis de programmation de démonstration"""
    
    challenges = [
        {
            'title': 'Two Sum',
            'description': 'Trouvez deux nombres dans un tableau qui s\'additionnent pour donner une cible.',
            'difficulty': 'beginner',
            'category': 'algorithms',
            'language': 'python',
            'problem_statement': '''
Étant donné un tableau de nombres entiers nums et un entier target, retournez les indices des deux nombres tels que leur somme soit égale à target.

Vous pouvez supposer que chaque entrée aurait exactement une solution, et vous ne pouvez pas utiliser le même élément deux fois.

Vous pouvez retourner la réponse dans n'importe quel ordre.

Exemple 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explication: Parce que nums[0] + nums[1] == 9, nous retournons [0, 1].

Exemple 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Exemple 3:
Input: nums = [3,3], target = 6
Output: [0,1]
            ''',
            'input_format': 'Un tableau nums et un entier target',
            'output_format': 'Un tableau de deux indices',
            'constraints': '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
            'starter_code': '''def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Votre code ici
    pass

# Test
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(f"Résultat: {result}")
''',
            'solution_code': '''def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
''',
            'test_cases': [
                {
                    'input': 'nums = [2,7,11,15], target = 9',
                    'expected_output': '[0,1]',
                    'is_hidden': False
                },
                {
                    'input': 'nums = [3,2,4], target = 6',
                    'expected_output': '[1,2]',
                    'is_hidden': False
                },
                {
                    'input': 'nums = [3,3], target = 6',
                    'expected_output': '[0,1]',
                    'is_hidden': True
                },
                {
                    'input': 'nums = [1,2,3,4,5], target = 8',
                    'expected_output': '[2,4]',
                    'is_hidden': True
                }
            ],
            'max_points': 100,
            'time_limit_seconds': 1,
            'tags': ['array', 'hash-table', 'easy'],
            'estimated_time_minutes': 20
        },
        {
            'title': 'Palindrome Check',
            'description': 'Vérifiez si une chaîne est un palindrome.',
            'difficulty': 'beginner',
            'category': 'string_manipulation',
            'language': 'python',
            'problem_statement': '''
Un palindrome est un mot, une phrase, un nombre ou une autre séquence de caractères qui se lit de la même manière vers l'avant et vers l'arrière.

Écrivez une fonction qui prend une chaîne en entrée et retourne True si c'est un palindrome, False sinon.

Ignorez les espaces, la ponctuation et la casse.

Exemple 1:
Input: "A man a plan a canal Panama"
Output: True

Exemple 2:
Input: "race a car"
Output: False

Exemple 3:
Input: "hello"
Output: False
            ''',
            'input_format': 'Une chaîne de caractères',
            'output_format': 'Boolean (True ou False)',
            'constraints': '1 <= s.length <= 2 * 10^5',
            'starter_code': '''def is_palindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Votre code ici
    pass

# Test
if __name__ == "__main__":
    test_string = "A man a plan a canal Panama"
    result = is_palindrome(test_string)
    print(f"'{test_string}' est un palindrome: {result}")
''',
            'solution_code': '''def is_palindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Nettoyer la chaîne: garder seulement alphanumériques en minuscules
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    
    # Vérifier si elle est égale à son inverse
    return cleaned == cleaned[::-1]
''',
            'test_cases': [
                {
                    'input': 's = "A man a plan a canal Panama"',
                    'expected_output': 'True',
                    'is_hidden': False
                },
                {
                    'input': 's = "race a car"',
                    'expected_output': 'False',
                    'is_hidden': False
                },
                {
                    'input': 's = "hello"',
                    'expected_output': 'False',
                    'is_hidden': True
                },
                {
                    'input': 's = "Madam"',
                    'expected_output': 'True',
                    'is_hidden': True
                }
            ],
            'max_points': 80,
            'time_limit_seconds': 1,
            'tags': ['string', 'two-pointers'],
            'estimated_time_minutes': 15
        },
        {
            'title': 'Fibonacci Sequence',
            'description': 'Calculez le n-ième nombre de Fibonacci.',
            'difficulty': 'intermediate',
            'category': 'dynamic_programming',
            'language': 'python',
            'problem_statement': '''
La séquence de Fibonacci est une série de nombres où un nombre est la somme des deux précédents, en commençant par 0 et 1.

Séquence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

Écrivez une fonction efficace pour calculer le n-ième nombre de Fibonacci.

Exemple 1:
Input: n = 0
Output: 0

Exemple 2:
Input: n = 1
Output: 1

Exemple 3:
Input: n = 10
Output: 55
            ''',
            'input_format': 'Un entier n (position dans la séquence)',
            'output_format': 'Le n-ième nombre de Fibonacci',
            'constraints': '0 <= n <= 50',
            'starter_code': '''def fibonacci(n):
    """
    :type n: int
    :rtype: int
    """
    # Votre code ici
    pass

# Test
if __name__ == "__main__":
    n = 10
    result = fibonacci(n)
    print(f"Le {n}ème nombre de Fibonacci est: {result}")
''',
            'solution_code': '''def fibonacci(n):
    """
    Version optimisée avec programmation dynamique
    :type n: int
    :rtype: int
    """
    if n <= 1:
        return n
    
    # Utilisation de deux variables au lieu d'un tableau
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    
    return b
''',
            'test_cases': [
                {
                    'input': 'n = 0',
                    'expected_output': '0',
                    'is_hidden': False
                },
                {
                    'input': 'n = 1',
                    'expected_output': '1',
                    'is_hidden': False
                },
                {
                    'input': 'n = 10',
                    'expected_output': '55',
                    'is_hidden': False
                },
                {
                    'input': 'n = 20',
                    'expected_output': '6765',
                    'is_hidden': True
                },
                {
                    'input': 'n = 30',
                    'expected_output': '832040',
                    'is_hidden': True
                }
            ],
            'max_points': 120,
            'time_limit_seconds': 1,
            'tags': ['dynamic-programming', 'recursion', 'math'],
            'estimated_time_minutes': 25
        },
        {
            'title': 'Array Rotation',
            'description': 'Faire pivoter un tableau vers la droite de k positions.',
            'difficulty': 'intermediate',
            'category': 'data_structures',
            'language': 'python',
            'problem_statement': '''
Étant donné un tableau, faites-le pivoter vers la droite de k étapes, où k est non-négatif.

Exemple 1:
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explication:
Pivoter 1 étapes vers la droite: [7,1,2,3,4,5,6]
Pivoter 2 étapes vers la droite: [6,7,1,2,3,4,5]
Pivoter 3 étapes vers la droite: [5,6,7,1,2,3,4]

Exemple 2:
Input: nums = [-1,-100,3,99], k = 2
Output: [3,99,-1,-100]
Explication: 
Pivoter 1 étapes vers la droite: [99,-1,-100,3]
Pivoter 2 étapes vers la droite: [3,99,-1,-100]
            ''',
            'input_format': 'Un tableau nums et un entier k',
            'output_format': 'Le tableau pivoté',
            'constraints': '1 <= nums.length <= 10^5\n-2^31 <= nums[i] <= 2^31 - 1\n0 <= k <= 10^5',
            'starter_code': '''def rotate(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: List[int]
    """
    # Votre code ici
    pass

# Test
if __name__ == "__main__":
    nums = [1, 2, 3, 4, 5, 6, 7]
    k = 3
    result = rotate(nums, k)
    print(f"Tableau original: {nums}")
    print(f"Après rotation de {k}: {result}")
''',
            'solution_code': '''def rotate(nums, k):
    """
    Solution optimisée avec inversion
    :type nums: List[int]
    :type k: int
    :rtype: List[int]
    """
    n = len(nums)
    k = k % n  # Gérer les cas où k > n
    
    # Créer une copie pour ne pas modifier l'original
    result = nums[:]
    
    # Méthode d'inversion: inverse tout, puis inverse les deux parties
    def reverse(arr, start, end):
        while start < end:
            arr[start], arr[end] = arr[end], arr[start]
            start += 1
            end -= 1
    
    # Inverser tout le tableau
    reverse(result, 0, n - 1)
    # Inverser les k premiers éléments
    reverse(result, 0, k - 1)
    # Inverser les éléments restants
    reverse(result, k, n - 1)
    
    return result
''',
            'test_cases': [
                {
                    'input': 'nums = [1,2,3,4,5,6,7], k = 3',
                    'expected_output': '[5,6,7,1,2,3,4]',
                    'is_hidden': False
                },
                {
                    'input': 'nums = [-1,-100,3,99], k = 2',
                    'expected_output': '[3,99,-1,-100]',
                    'is_hidden': False
                },
                {
                    'input': 'nums = [1,2], k = 1',
                    'expected_output': '[2,1]',
                    'is_hidden': True
                },
                {
                    'input': 'nums = [1,2,3,4,5], k = 7',
                    'expected_output': '[4,5,1,2,3]',
                    'is_hidden': True
                }
            ],
            'max_points': 150,
            'time_limit_seconds': 2,
            'tags': ['array', 'rotation', 'algorithm'],
            'estimated_time_minutes': 30
        }
    ]
    
    # Créer les défis
    created_count = 0
    for challenge_data in challenges:
        slug = slugify(challenge_data['title'])
        
        # Vérifier si le défi existe déjà
        if not CodingChallenge.objects.filter(slug=slug).exists():
            challenge = CodingChallenge.objects.create(
                title=challenge_data['title'],
                slug=slug,
                description=challenge_data['description'],
                difficulty=challenge_data['difficulty'],
                category=challenge_data['category'],
                language=challenge_data['language'],
                problem_statement=challenge_data['problem_statement'],
                input_format=challenge_data['input_format'],
                output_format=challenge_data['output_format'],
                constraints=challenge_data['constraints'],
                starter_code=challenge_data['starter_code'],
                solution_code=challenge_data['solution_code'],
                test_cases=challenge_data['test_cases'],
                max_points=challenge_data['max_points'],
                time_limit_seconds=challenge_data['time_limit_seconds'],
                tags=challenge_data['tags'],
                estimated_time_minutes=challenge_data['estimated_time_minutes']
            )
            created_count += 1
            print(f"✅ Créé: {challenge.title}")
        else:
            print(f"⚠️  Existe déjà: {challenge_data['title']}")
    
    print(f"\n🎉 {created_count} nouveau(x) défi(s) de programmation créé(s)!")
    print(f"📊 Total des défis dans la base: {CodingChallenge.objects.count()}")

if __name__ == '__main__':
    create_coding_challenges()
