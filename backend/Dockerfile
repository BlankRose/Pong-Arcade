# ############################################################################ #
#          .-.                                                                 #
#    __   /   \   __                                                           #
#   (  `'.\   /.'`  )   Pong-Arcade - Dockerfile                               #
#    '-._.(;;;)._.-'                                                           #
#    .-'  ,`"`,  '-.                                                           #
#   (__.-'/   \'-.__)   By: Rosie (https://github.com/BlankRose)               #
#       //\   /         Last Updated: Tuesday, August 15, 2023 4:06 PM         #
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

# STEP 3: Retrieve source code and configurations
# COPY src ./src
COPY ./.eslintrc.js .
COPY ./*.json ./

# STEP 4: Start the application
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
