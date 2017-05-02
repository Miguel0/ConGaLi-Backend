FROM node:7

MAINTAINER Miguel Isasmendi <miguelisasmendi@gmail.com>

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir /usr/src/app/log

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY config /usr/src/app/config
COPY src /usr/src/app/src
COPY app.js /usr/src/app/

EXPOSE 1996
CMD [ "npm", "run", "app" ]
