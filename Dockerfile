FROM node
WORKDIR /home/node/app
COPY package*.json ./
RUN npm i -g nodemon @nestjs/cli
RUN npm i
COPY . .
EXPOSE $PORT
CMD [ "npm", "run", "start:dev" ]--