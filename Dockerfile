FROM boopathi/nodejs:latest
MAINTAINER Boopathi Rajaa <me@boopathi.in>

RUN npm install -g grunt-cli

ADD . /docker-remote
WORKDIR /docker-remote
RUN npm install

ENV PORT 4205
ENV SECRET SET_YOUR_SECRET
ENV DOCKER_HOST 172.17.42.1
ENV DOCKER_PORT 4242

EXPOSE 4205

ENTRYPOINT ["npm", "start"]
