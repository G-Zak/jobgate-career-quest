"""Minimal admin for testsengine app.

This file registers a small set of admin model classes. The original
admin module in the repository was corrupted with duplicated and
malformed content which prevented Django from importing admin modules
during manage.py commands. Keep this minimal to allow migrations and
server startup.
"""

from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered


try:
	# Import only core models; if imports fail during early migrations,
	# fall back to no-ops to prevent import-time crashes.
	from .models import Test, Question, TestSession, TestAnswer
except Exception:
	Test = Question = TestSession = TestAnswer = None


if Test is not None:
	try:
		admin.site.register(Test)
	except AlreadyRegistered:
		pass


if Question is not None:
	try:
		admin.site.register(Question)
	except AlreadyRegistered:
		pass


if TestSession is not None:
	try:
		admin.site.register(TestSession)
	except AlreadyRegistered:
		pass


"""Minimal admin for testsengine app.

This file registers a small set of admin model classes. The original
admin module in the repository was corrupted with duplicated and
malformed content which prevented Django from importing admin modules
during manage.py commands. Keep this minimal to allow migrations and
server startup.
"""

from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered


try:
	from .models import Test, Question, TestSession, TestAnswer
except Exception:
	Test = Question = TestSession = TestAnswer = None


def _safe_register(model):
	if model is None:
		return
	try:
		admin.site.register(model)
	except AlreadyRegistered:
		pass


_safe_register(Test)
_safe_register(Question)
_safe_register(TestSession)
_safe_register(TestAnswer)