from django.core.management.base import BaseCommand
from testsengine.models import TestSubmission

class Command(BaseCommand):
    help = 'Clear all test submissions to allow retaking tests'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-id',
            type=int,
            help='Clear submissions for a specific test ID only',
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm the deletion without prompting',
        )

    def handle(self, *args, **options):
        test_id = options.get('test_id')
        confirm = options.get('confirm', False)
        
        if test_id:
            submissions = TestSubmission.objects.filter(test_id=test_id)
            test_name = submissions.first().test.title if submissions.exists() else f"Test {test_id}"
        else:
            submissions = TestSubmission.objects.all()
            test_name = "all tests"
        
        count = submissions.count()
        
        if count == 0:
            self.stdout.write(
                self.style.WARNING(f'No submissions found for {test_name}')
            )
            return
        
        if not confirm:
            self.stdout.write(
                self.style.WARNING(f'This will delete {count} submission(s) for {test_name}')
            )
            confirm_input = input('Are you sure? (yes/no): ')
            if confirm_input.lower() != 'yes':
                self.stdout.write(self.style.ERROR('Operation cancelled'))
                return
        
        # Delete submissions
        deleted_count, _ = submissions.delete()
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {deleted_count} submission(s) for {test_name}')
        )



