init_db:
	@echo "Démarrage du service PostgreSQL..."
	-@brew services start postgresql@14 2>/dev/null || brew services restart postgresql@14
	@echo "Attente de quelques secondes pour s'assurer que PostgreSQL est complètement démarré..."
	@sleep 5
	@echo "Tentative de création de la base de données..."
	-@PGPASSWORD=hajjar psql -U postgres -h localhost -c "CREATE DATABASE user1;"
	@echo "Tentative terminée."

create_postgres_role:
	@echo "Création du rôle postgres..."
	-@psql -U postgres -c "CREATE ROLE charles LOGIN SUPERUSER PASSWORD 'your_password';"

reinstall_pg:
	@echo "Réinstallation de PostgreSQL..."
	-@brew services stop postgresql@14
	@brew uninstall postgresql@14
	@brew install postgresql@14
	@echo "PostgreSQL a été réinstallé."

check_status:
	@brew services list | grep postgresql@14


.PHONY: drop_db
drop_db:
	PGPASSWORD=hajjar psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS user1;"
	PGPASSWORD=hajjar psql -U postgres -h localhost -c "DROP USER IF EXISTS charles;"