from django.apps import AppConfig


class AuthApiConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'auth_api'

	def ready(self):
		# Import signals to connect them when the app is ready
		import auth_api.signals