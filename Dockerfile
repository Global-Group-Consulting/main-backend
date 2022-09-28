FROM node:12.22.1-alpine
RUN apk add --no-cache python3 g++ make
RUN apk add curl
RUN npm i -g @adonisjs/cli

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

CMD ["yarn", "watch"]

EXPOSE 3000
