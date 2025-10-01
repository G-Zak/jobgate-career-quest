import subprocess
import tempfile
import os
import json
import time
from typing import Dict, List, Tuple, Any
from django.conf import settings

class CodeExecutionResult:
 """Container for code execution results"""

 def __init__(self):
 self.status = 'pending'
 self.output = ''
 self.error = ''
 self.execution_time_ms = 0
 self.memory_used_mb = 0.0
 self.test_results = []
 self.compilation_output = ''

class CodeExecutor:
 """Simple code execution service for Python"""

 # Timeout settings (in seconds)
 EXECUTE_TIMEOUT = 5

 def __init__(self):
 pass

 def execute_code(self, code: str, language: str, test_cases: List[Dict]) -> CodeExecutionResult:
 """
 Execute code against test cases - simplified version for Python only
 """
 result = CodeExecutionResult()

 if language != 'python':
 result.status = 'compilation_error'
 result.error = f"Seul Python est supporté pour le moment. Language demandé: {language}"
 return result

 # Create temporary directory for execution
 with tempfile.TemporaryDirectory() as temp_dir:
 try:
 # Write code to file
 file_path = os.path.join(temp_dir, 'solution.py')
 with open(file_path, 'w', encoding='utf-8') as f:
 f.write(code)

 # Run test cases
 result.test_results = []
 total_time = 0

 for i, test_case in enumerate(test_cases):
 test_result = self._run_single_test(file_path, test_case, temp_dir)
 result.test_results.append(test_result)
 total_time += test_result.get('execution_time_ms', 0)

 # Calculate overall results
 passed_tests = sum(1 for t in result.test_results if t['passed'])
 total_tests = len(result.test_results)

 if passed_tests == total_tests:
 result.status = 'accepted'
 else:
 result.status = 'wrong_answer'

 result.execution_time_ms = total_time
 result.memory_used_mb = 10.0 # Default estimate

 except Exception as e:
 result.status = 'runtime_error'
 result.error = str(e)

 return result

 def _run_single_test(self, file_path: str, test_case: Dict, temp_dir: str) -> Dict:
 """Run a single test case - simplified version for specific problems"""

 test_result = {
 'input': test_case['input'],
 'expected_output': str(test_case['expected_output']).strip(),
 'actual_output': '',
 'passed': False,
 'execution_time_ms': 0,
 'memory_used_mb': 5.0,
 'error': ''
 }

 try:
 start_time = time.time()

 # Parse input based on the format
 input_data = test_case['input']

 if 'nums = [' in input_data and 'target = ' in input_data:
 # Two Sum problem
 test_script = f'''
import sys
sys.path.insert(0, "{temp_dir}")

try:
 import solution

 # Parse Two Sum input
 input_line = """{input_data}"""

 # Extract nums and target
 if ", target = " in input_line:
 nums_part = input_line.split(", target = ")[0].replace("nums = ", "")
 target_part = input_line.split(", target = ")[1]

 nums = eval(nums_part)
 target = int(target_part)

 result = solution.two_sum(nums, target)
 print(result)
 else:
 print("Erreur de format")

except Exception as e:
 print(f"Erreur: {{e}}")
'''
 elif 's = "' in input_data:
 # Palindrome problem
 test_script = f'''
import sys
sys.path.insert(0, "{temp_dir}")

try:
 import solution

 # Parse Palindrome input
 input_line = """{input_data}"""
 s = input_line.split('s = "')[1].split('"')[0]

 result = solution.is_palindrome(s)
 print(result)

except Exception as e:
 print(f"Erreur: {{e}}")
'''
 elif 'n = ' in input_data:
 # Fibonacci problem
 test_script = f'''
import sys
sys.path.insert(0, "{temp_dir}")

try:
 import solution

 # Parse Fibonacci input
 input_line = """{input_data}"""
 n = int(input_line.split('n = ')[1])

 result = solution.fibonacci(n)
 print(result)

except Exception as e:
 print(f"Erreur: {{e}}")
'''
 elif 'nums = [' in input_data and 'k = ' in input_data:
 # Array rotation problem
 test_script = f'''
import sys
sys.path.insert(0, "{temp_dir}")

try:
 import solution

 # Parse Array Rotation input
 input_line = """{input_data}"""

 nums_part = input_line.split(", k = ")[0].replace("nums = ", "")
 k_part = input_line.split(", k = ")[1]

 nums = eval(nums_part)
 k = int(k_part)

 result = solution.rotate(nums, k)
 print(result)

except Exception as e:
 print(f"Erreur: {{e}}")
'''
 else:
 test_script = f'''
print("Format d'entrée non supporté: {input_data}")
'''

 # Write and execute test script
 test_file = os.path.join(temp_dir, 'test_runner.py')
 with open(test_file, 'w', encoding='utf-8') as f:
 f.write(test_script)

 # Execute test
 process = subprocess.run(
 ['python', test_file],
 cwd=temp_dir,
 capture_output=True,
 text=True,
 timeout=self.EXECUTE_TIMEOUT
 )

 end_time = time.time()
 execution_time = int((end_time - start_time) * 1000)

 if process.returncode != 0:
 test_result['error'] = process.stderr
 return test_result

 # Clean and compare output
 actual_output = process.stdout.strip()
 expected_output = test_result['expected_output']

 test_result.update({
 'actual_output': actual_output,
 'passed': actual_output == expected_output,
 'execution_time_ms': execution_time
 })

 except subprocess.TimeoutExpired:
 test_result['error'] = 'Time limit exceeded'
 except Exception as e:
 test_result['error'] = f"Execution error: {str(e)}"

 return test_result
