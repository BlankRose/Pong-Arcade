# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: chajjar <chajjar@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: Invalid date        by  Friday, Au       #+#    #+#              #
#    Updated: 2023/09/13 22:29:30 by chajjar          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #


s: start
start: .env
	-@docker-compose up --build

sd: start_detached
start_detached: .env
	-@docker-compose up --build -d

.env:
	@sh envgen.sh

e: stop
stop:
	-@docker-compose down -t $(TIMEOUT)

c: clean
clean: stop
	-@docker-compose down -vt $(TIMEOUT) --rmi all

fc: fclean
fclean: stop
	-@docker rm -f $(shell docker ps -aq)
	-@docker rmi -f $(shell docker images -aq)
	-@docker volume rm $(shell docker volume ls -q)
	-@docker system prune -af --volumes

r: restart
restart: stop start

re: rebuild
rebuild: clean start

ip:
	@ifconfig | grep "inet "

.PHONY: s start sd start_detached \
        e stop c clean fc fclean \
        r restart re rebuild ip
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

start_front:
	cd frontend; set -a; source .env; set +a; npm start

start_back: init_db
	cd backend; set -a; source ../.env; set +a; npm run start:debug

start_backm: init_db
	cd backend_irc/src; set -a; source ../../.env; set +a; npm run start --inspect=9230

.PHONY: drop_db

endif
