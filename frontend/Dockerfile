# ############################################################################ #
#          .-.                                                                 #
#    __   /   \   __                                                           #
#   (  `'.\   /.'`  )   Pong-Arcade - Dockerfile                               #
#    '-._.(;;;)._.-'                                                           #
#    .-'  ,`"`,  '-.                                                           #
#   (__.-'/   \'-.__)   By: Rosie (https://github.com/BlankRose)               #
#       //\   /         Last Updated: Tuesday, August 15, 2023 3:30 PM         #
#      ||  '-'                                                                 #
# ############################################################################ #

# STEP 1: Pull base image and defines variables
FROM node:lts-alpine
ARG APP_DIR=/app

# STEP 2: Install dependencies
RUN mkdir -p ${APP_DIR}
COPY ./package.json ${APP_DIR}
WORKDIR ${APP_DIR}
RUN npm install

# STEP 3: Build app
COPY ./public ${APP_DIR}/public
COPY ./src ${APP_DIR}/src
RUN npm run build

# STEP 4: Start the application
EXPOSE 3000
CMD ["npm", "start"]
