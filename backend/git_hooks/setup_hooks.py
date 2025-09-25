#!/usr/bin/env python3
"""
Setup Git hooks for automatic test data management
"""

import os
import stat
from pathlib import Path

def setup_git_hooks():
    """Setup Git hooks for test data management"""
    
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    git_hooks_dir = project_root / '.git' / 'hooks'
    
    if not git_hooks_dir.exists():
        print("❌ Git repository not found!")
        return False
    
    print("🔧 Setting up Git hooks for test data management...")
    
    # Pre-merge hook
    pre_merge_hook = git_hooks_dir / 'pre-merge'
    with open(pre_merge_hook, 'w') as f:
        f.write('''#!/bin/bash
echo "🔄 Pre-merge: Backing up test data..."
cd backend
python manage.py sync_tests_with_git --action pre-merge
''')
    os.chmod(pre_merge_hook, stat.S_IRWXU)
    
    # Post-merge hook
    post_merge_hook = git_hooks_dir / 'post-merge'
    with open(post_merge_hook, 'w') as f:
        f.write('''#!/bin/bash
echo "🔄 Post-merge: Restoring test data..."
cd backend
python post_merge_restore.py
''')
    os.chmod(post_merge_hook, stat.S_IRWXU)
    
    # Pre-push hook
    pre_push_hook = git_hooks_dir / 'pre-push'
    with open(pre_push_hook, 'w') as f:
        f.write('''#!/bin/bash
echo "🔄 Pre-push: Backing up test data..."
cd backend
python manage.py sync_tests_with_git --action pre-push
''')
    os.chmod(pre_push_hook, stat.S_IRWXU)
    
    print("✅ Git hooks setup completed!")
    print("📋 Hooks installed:")
    print("   - pre-merge: Backs up test data before merging")
    print("   - post-merge: Restores test data after merging")
    print("   - pre-push: Backs up test data before pushing")
    
    return True

if __name__ == '__main__':
    setup_git_hooks()
