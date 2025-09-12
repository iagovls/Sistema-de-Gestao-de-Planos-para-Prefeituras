FROM node:latest

WORKDIR /front-sistema-de-gestao-prefeituras

COPY package*.json ./
RUN rm -rf node_modules
RUN npm i

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]