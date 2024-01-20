# ############################################################################ #
#          .-.                                                                 #
#    __   /   \   __                                                           #
#   (  `'.\   /.'`  )  Dockerfile                                              #
#    '-._.(;;;)._.-'                                                           #
#    .-'  ,`"`,  '-.                                                           #
#   (__.-'/   \'-.__)   By: Rosie (https://github.com/BlankRose)               #
#       //\   /        Last Updated: January 20, 2024 [12:20 pm]               #
#      ||  '-'                                                                 #
# ############################################################################ #

# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}
COPY ./package.json .
RUN npm install
RUN npm install -g serve

# STEP 3: Start the application
COPY ./start.sh .
ENTRYPOINT ["sh", "start.sh"]
