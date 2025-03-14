FROM node:14.17.1-alpine

COPY dist /www
COPY node_modules /www/node_modules

WORKDIR /www

EXPOSE 3000

CMD node app/server.js