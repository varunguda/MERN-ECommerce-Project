FROM node

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm install

COPY .. .

CMD [ "npm", "start" ]