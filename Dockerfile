FROM node:5

COPY . /src

RUN cd /src; npm install
RUN cd
RUN cd /src/client; bower install
RUN cd
RUN cd /src

EXPOSE 7777

CMD ["node", "src/server/server.js"
