# ############################################################################ #
#          .-.                                                                 #
#    __   /   \   __                                                           #
#   (  `'.\   /.'`  )   Pong-Arcade - Makefile                                 #
#    '-._.(;;;)._.-'                                                           #
#    .-'  ,`"`,  '-.                                                           #
#   (__.-'/   \'-.__)   By: Rosie (https://github.com/BlankRose)               #
#       //\   /         Last Updated: Wednesday, August 16, 2023 6:26 PM       #
#      ||  '-'                                                                 #
# ############################################################################ #

TIMEOUT := 5

s: start
start:
	-@docker-compose up --build

sd: start_detached
start_detached:
	-@docker-compose up --build -d

e: stop
stop:
	-@docker-compose down -t $(TIMEOUT)

c: clean
clean: stop
	-@docker-compose down -t $(TIMEOUT) --rmi all

fc: fclean
fclean: stop
	-@docker system prune -af

clean2: stop
	@docker rm -f $(shell docker ps -aq) $(IDC)
	@docker rmi -f $(shell docker images -aq) $(IDC)
	@docker volume rm $(shell docker volume ls -q) $(IDC)

clean3:
	docker-compose down --remove-orphans
	docker system prune -a
	docker system prune -a -f --volumes

r: restart
restart: stop start

re: rebuild
rebuild: clean start

.PHONY: s start sd start_detached \
        e stop c clean fc fclean \
        r restart re rebuild
.DEFAULT_GOAL := start


# ############################################################################ #
#                               macOS Specific                                 #
# ############################################################################ #

# Enable following rules ONLY on macOS
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)

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

drop_db:
	PGPASSWORD=hajjar psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS user1;"
	PGPASSWORD=hajjar psql -U postgres -h localhost -c "DROP USER IF EXISTS charles;"

.PHONY: drop_db

endif
