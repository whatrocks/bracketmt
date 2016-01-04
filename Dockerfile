FROM node

RUN mkdir app

WORKDIR app

ADD . /app/

RUN npm install --silent -g bower

RUN npm install

WORKDIR client

RUN bower --allow-root install

WORKDIR ..

EXPOSE 7777

CMD ["node", "server/server.js"]
