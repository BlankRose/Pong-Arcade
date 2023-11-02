#!/bin/bash
# ############################################################################ #
#          .-.                                                                 #
#    __   /   \   __                                                           #
#   (  `'.\   /.'`  )   Pong-Arcade - envgen.sh                                #
#    '-._.(;;;)._.-'                                                           #
#    .-'  ,`"`,  '-.                                                           #
#   (__.-'/   \'-.__)   By: Rosie (https://github.com/BlankRose)               #
#       //\   /         Last Updated: Tuesday, August 15, 2023 4:35 PM         #
#      ||  '-'                                                                 #
# ############################################################################ #

# This script generates a file with the environment variables for the docker
# containers. It is primarily used by the docker-compose.yml file.

if [ ! "$BASH_VERSION" ]; then
	exec bash "$0" "$@"
	exit $?
fi

set -e
if [ -f .env ]; then
	echo "An .env file already exists!"
	echo "Do you want to regenerate a new .env file? (y/n)"
	read -r answer

	if [[ ! $answer =~ ^[YyOo]$ ]]; then
		echo "Aborting..."
		exit 1
	fi
	echo ""
fi

printf "\033[31;4mRequired fields:\033[0m\n"
echo -n "42 API Identifier: "
while [ -z "$api_id" ]; do
	read -r api_id
done

echo -n "42 API Secret: "
while [ -z "$api_secret" ]; do
	read -r api_secret
done

printf "\n\033[33;4mOptional fields:\033[0m\n"
echo -n "PostgreSQL Username (default: root): "
read -r postgres_user
if [ -z "$postgres_user" ]; then
	postgres_user="root"
fi

echo -n "PostgreSQL Password (default: root): "
read -r postgres_password
if [ -z "$postgres_password" ]; then
	postgres_password="root"
fi

echo -n "PostgreSQL Database (default: pongarcade): "
read -r postgres_db
if [ -z "$postgres_db" ]; then
	postgres_db="pongarcade"
fi

echo -n "JWT Secret Key (default: random): "
read -r jwt_secret
if [ -z "$jwt_secret" ]; then
	charset='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	for i in {1..64}; do
		jwt_secret="$jwt_secret${charset:RANDOM%${#charset}:1}"
	done
fi

echo -n "Web Access Port (default: 5500): "
read -r web_port
if [ -z "$web_port" ]; then
	web_port="5500"
fi

echo -n "API Access Port (default: 5501): "
read -r api_port
if [ -z "$api_port" ]; then
	api_port="5501"
fi

echo "\
# This file contains the environment variables for the docker containers.
# It is primarily used by the docker-compose.yml file.

# Web Access Details
# (http://127.0.0.1:\$ACCESS_PORT/)
WEB_ACCESS_PORT=$web_port
API_ACCESS_PORT=$api_port

# PostgreSQL Information
POSTGRES_USER=$postgres_user
POSTGRES_PASSWORD=$postgres_password
POSTGRES_DB=$postgres_db

# 42 API Credentials
API_UID=$api_id
API_SECRET=$api_secret

# Critical Informations
JWT_SECRET=$jwt_secret" > .env
printf "\n\033[32;1mEnvironement file generated!\033[0m\n"
