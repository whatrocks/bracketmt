FROM node:5

COPY . /src

RUN npm install --silent -g bower

# Build src
RUN cd /src && npm install
RUN cd /src/client && bower --allow-root install

EXPOSE 7777

CMD ["node", "src/server/server.js"
