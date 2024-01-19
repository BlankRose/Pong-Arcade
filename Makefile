# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: chajjar <chajjar@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: Invalid date        by  Friday, Au       #+#    #+#              #
#    Updated: 2024/01/19 16:41:34 by flcollar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

s: start
start: .env
	-@docker-compose up --build -t 3

sd: start_detached
start_detached: .env
	-@docker-compose up --build -d -t 3

e: stop
stop:
	-@docker-compose down -t 3

c: clean
clean: stop
	-@docker-compose down -vt 3 --rmi all

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
