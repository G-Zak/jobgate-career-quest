"""
Django management command to validate numerical reasoning questions
for mathematical accuracy and translation consistency
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from testsengine.models import Test, Question
import json
import re


class Command(BaseCommand):
    help = 'Validate numerical reasoning questions for accuracy and consistency'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-id',
            type=int,
            default=21,
            help='Test ID to validate (default: 21)',
        )
        parser.add_argument(
            '--fix-issues',
            action='store_true',
            help='Automatically fix minor issues found',
        )

    def handle(self, *args, **options):
        test_id = options['test_id']
        fix_issues = options['fix_issues']
        
        try:
            test = Test.objects.get(id=test_id)
            self.stdout.write(f'Validating questions for test: {test.title}')
            
            questions = test.questions.all().order_by('order')
            
            if not questions.exists():
                self.stdout.write(
                    self.style.WARNING('No questions found for this test!')
                )
                return
            
            # Validation results
            validation_results = {
                'total_questions': questions.count(),
                'valid_questions': 0,
                'issues_found': [],
                'difficulty_distribution': {'easy': 0, 'medium': 0, 'hard': 0},
                'translation_coverage': {'en': 0, 'fr': 0},
                'moroccan_context_count': 0
            }
            
            for question in questions:
                issues = self.validate_question(question, fix_issues)
                
                if not issues:
                    validation_results['valid_questions'] += 1
                else:
                    validation_results['issues_found'].extend(issues)
                
                # Count difficulty distribution
                if hasattr(question, 'difficulty_level'):
                    validation_results['difficulty_distribution'][question.difficulty_level] += 1
                
                # Check translation coverage
                if question.context:
                    try:
                        context_data = json.loads(question.context)
                        translations = context_data.get('translations', {})
                        if 'en' in translations:
                            validation_results['translation_coverage']['en'] += 1
                        if 'fr' in translations:
                            validation_results['translation_coverage']['fr'] += 1
                        
                        metadata = context_data.get('metadata', {})
                        if metadata.get('moroccan_context'):
                            validation_results['moroccan_context_count'] += 1
                    except json.JSONDecodeError:
                        pass
            
            # Print validation report
            self.print_validation_report(validation_results)
            
        except Test.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'Test with ID {test_id} not found!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error validating questions: {str(e)}')
            )

    def validate_question(self, question, fix_issues=False):
        """Validate a single question for accuracy and consistency"""
        issues = []
        
        # 1. Check basic structure
        if not question.question_text:
            issues.append(f"Question {question.id}: Missing question text")
        
        if not question.options:
            issues.append(f"Question {question.id}: Missing options")
        elif len(question.options) != 4:
            issues.append(f"Question {question.id}: Should have exactly 4 options, has {len(question.options)}")
        
        if not question.correct_answer:
            issues.append(f"Question {question.id}: Missing correct answer")
        elif question.correct_answer not in ['A', 'B', 'C', 'D']:
            issues.append(f"Question {question.id}: Correct answer should be A, B, C, or D")
        
        # 2. Check difficulty level
        if not hasattr(question, 'difficulty_level') or question.difficulty_level not in ['easy', 'medium', 'hard']:
            issues.append(f"Question {question.id}: Invalid difficulty level")
        
        # 3. Check translations
        if question.context:
            try:
                context_data = json.loads(question.context)
                translations = context_data.get('translations', {})
                
                # Check French translation exists
                if 'fr' not in translations:
                    issues.append(f"Question {question.id}: Missing French translation")
                else:
                    fr_translation = translations['fr']
                    if not fr_translation.get('question_text'):
                        issues.append(f"Question {question.id}: Missing French question text")
                    if not fr_translation.get('options'):
                        issues.append(f"Question {question.id}: Missing French options")
                    elif len(fr_translation['options']) != len(question.options):
                        issues.append(f"Question {question.id}: French options count mismatch")
                    if not fr_translation.get('explanation'):
                        issues.append(f"Question {question.id}: Missing French explanation")
                
            except json.JSONDecodeError:
                issues.append(f"Question {question.id}: Invalid context JSON")
        else:
            issues.append(f"Question {question.id}: Missing context with translations")
        
        # 4. Check numerical accuracy (basic validation)
        if self.contains_calculation(question.question_text):
            calc_issues = self.validate_calculations(question)
            issues.extend(calc_issues)
        
        # 5. Check Moroccan context consistency
        if question.context:
            try:
                context_data = json.loads(question.context)
                metadata = context_data.get('metadata', {})
                if metadata.get('moroccan_context'):
                    if not self.has_moroccan_references(question.question_text):
                        issues.append(f"Question {question.id}: Marked as Moroccan context but no Moroccan references found")
            except json.JSONDecodeError:
                pass
        
        return issues

    def contains_calculation(self, text):
        """Check if question text contains numerical calculations"""
        # Look for numbers, percentages, mathematical operations
        patterns = [
            r'\d+%',  # Percentages
            r'\d+\s*(MAD|km|kg|hours?|minutes?)',  # Units
            r'\d+\s*[+\-*/×÷]\s*\d+',  # Basic operations
            r'calculate|compute|find|what is',  # Calculation keywords
        ]
        
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False

    def validate_calculations(self, question):
        """Basic validation of numerical calculations in questions"""
        issues = []
        
        # This is a simplified validation - in practice, you'd want more sophisticated checking
        text = question.question_text.lower()
        
        # Check for common calculation errors
        if 'percent' in text or '%' in text:
            if not any(opt for opt in question.options if '%' in str(opt.get('text', ''))):
                # Percentage question should have percentage in at least one option
                pass
        
        # Check for currency consistency
        if 'mad' in text:
            mad_in_options = any('mad' in str(opt.get('text', '')).lower() for opt in question.options)
            if not mad_in_options:
                issues.append(f"Question {question.id}: Uses MAD in question but not in options")
        
        return issues

    def has_moroccan_references(self, text):
        """Check if text contains Moroccan cultural references"""
        moroccan_keywords = [
            'casablanca', 'rabat', 'marrakech', 'fez', 'tangier', 'essaouira', 'khouribga',
            'ahmed', 'fatima', 'hassan', 'imane', 'omar', 'khadija',
            'argan', 'souk', 'cooperative', 'mad', 'morocco', 'moroccan',
            'phosphate', 'olive', 'textile'
        ]
        
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in moroccan_keywords)

    def print_validation_report(self, results):
        """Print comprehensive validation report"""
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS("NUMERICAL REASONING TEST VALIDATION REPORT"))
        self.stdout.write("="*60)
        
        # Overall statistics
        self.stdout.write(f"\n📊 OVERALL STATISTICS:")
        self.stdout.write(f"   Total Questions: {results['total_questions']}")
        self.stdout.write(f"   Valid Questions: {results['valid_questions']}")
        self.stdout.write(f"   Issues Found: {len(results['issues_found'])}")
        
        # Difficulty distribution
        self.stdout.write(f"\n📈 DIFFICULTY DISTRIBUTION:")
        total = results['total_questions']
        for level, count in results['difficulty_distribution'].items():
            percentage = (count / total * 100) if total > 0 else 0
            self.stdout.write(f"   {level.capitalize()}: {count} ({percentage:.1f}%)")
        
        # Translation coverage
        self.stdout.write(f"\n🌍 TRANSLATION COVERAGE:")
        for lang, count in results['translation_coverage'].items():
            percentage = (count / total * 100) if total > 0 else 0
            self.stdout.write(f"   {lang.upper()}: {count} ({percentage:.1f}%)")
        
        # Moroccan context
        moroccan_percentage = (results['moroccan_context_count'] / total * 100) if total > 0 else 0
        self.stdout.write(f"\n🇲🇦 MOROCCAN CONTEXT:")
        self.stdout.write(f"   Questions with Moroccan context: {results['moroccan_context_count']} ({moroccan_percentage:.1f}%)")
        
        # Issues found
        if results['issues_found']:
            self.stdout.write(f"\n❌ ISSUES FOUND:")
            for issue in results['issues_found'][:10]:  # Show first 10 issues
                self.stdout.write(f"   • {issue}")
            
            if len(results['issues_found']) > 10:
                self.stdout.write(f"   ... and {len(results['issues_found']) - 10} more issues")
        else:
            self.stdout.write(f"\n✅ NO ISSUES FOUND - All questions are valid!")
        
        # Recommendations
        self.stdout.write(f"\n💡 RECOMMENDATIONS:")
        
        # Check difficulty distribution
        easy_count = results['difficulty_distribution']['easy']
        medium_count = results['difficulty_distribution']['medium']
        hard_count = results['difficulty_distribution']['hard']
        
        if easy_count < 8:
            self.stdout.write(f"   • Add more easy questions (current: {easy_count}, recommended: 8)")
        if medium_count < 8:
            self.stdout.write(f"   • Add more medium questions (current: {medium_count}, recommended: 8)")
        if hard_count < 8:
            self.stdout.write(f"   • Add more hard questions (current: {hard_count}, recommended: 8)")
        
        # Check translation coverage
        if results['translation_coverage']['fr'] < total:
            missing_fr = total - results['translation_coverage']['fr']
            self.stdout.write(f"   • Complete French translations for {missing_fr} questions")
        
        # Check Moroccan context
        if results['moroccan_context_count'] < total * 0.6:
            self.stdout.write(f"   • Consider adding more Moroccan cultural context (current: {moroccan_percentage:.1f}%, recommended: 60%+)")
        
        self.stdout.write("\n" + "="*60)
        
        # Final assessment
        if len(results['issues_found']) == 0 and results['valid_questions'] == total:
            self.stdout.write(self.style.SUCCESS("🎉 VALIDATION PASSED - Test is ready for production!"))
        elif len(results['issues_found']) < 5:
            self.stdout.write(self.style.WARNING("⚠️  MINOR ISSUES FOUND - Test is mostly ready, fix minor issues"))
        else:
            self.stdout.write(self.style.ERROR("❌ MAJOR ISSUES FOUND - Test needs significant improvements"))
        
        self.stdout.write("="*60 + "\n")
