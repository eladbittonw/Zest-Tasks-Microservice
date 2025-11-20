<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Home Assigment -
Zest tasks microservice - Elad Bitton
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

## Run Redis docker

redis docker - [redis](https://hub.docker.com/_/redis)

Pull the redis docker:

```bash
$ docker pull redis
```

Run redis docker:

```bash
$ docker run -d --name redis-server -p 6379:6379 redis
```

if you would like to change the redis docker port please make the changes in the .env file as well.

## Install Packages

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
