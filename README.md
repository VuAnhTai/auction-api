## auction Backend

- Online Auction App

## Description

- Purpose: This project is to build an online auction system.
- Overview: This project is built with NestJS, PostgreSQL, Redis, Docker, and deployed on EC2.
- Key Feature:
  - User can register, login, logout, and update profile.
    - Using JWT to handle author and authen
    - Create AuthGuard to handle authentication
  - Create a new item.
  - Get the list of completed/ongoing bid items.
  - Publish Item
    - Handle the timeout for the auction to automatically process when it's done
  - Bid on an item.
    - Using Event to handle after bid: Add history
    - Using Redis to check race condition, increase performance
  - Can bid in each 5s and for published items (each user).
    - Using BidGuard to handle this case
  - After bid time. fail auction user’s money need to be payback.
    - Using Event to handle this case

## Prerequisites

- Node >= 16
- Docker >= 20.10.7
- PostgreSQL >= 13
- Redis >= 6.0.9

We use framework NESTJS
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Run With Docker Compose

```bash
docker-compose up -d
```

## Run Manually

### Install postgres

**docker**:

```bash
docker run -d  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=auction -p 5432:5432 --name docker-postgres postgres
```

**homebrew**:

```bash
brew install postgresql
```

Docker makes things easy because you can always tear down the container or stop it easily. Usually you will run into less issues than running postgres locally with brew.

once you have postgres running locally you need to make sure that you have a database created for the app to use. You can do this by running the following command:

```bash
createdb auction
```

### Install redis

**docker**:

```bash
docker run -d -p 6379:6379 --name docker-redis redis
```

**homebrew**:

```bash
brew install redis
```

### Setup .env

`.env` file with the following properties.

To generate file .env, you can run script
`./scripts/generate-env.ts`
or
`npm run generate-env`

## Installation

```bash
$ npm install
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Url: http://localhost:4000

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Process github

```bash
#1. Checkout branch develop and pull latest
`git checkout develop`
`git pull origin develop`
#2. Create new branch
`git checkout -b "<name>[<numberticket>]<title>"`
#3. Commit
`git commit -m "<type>[#<numberticket>] <Message>"`
type     | Mean
-------- | --------
feat     | Introduces a new feature to the codebase.
fix      | Patches a bug in your codebase.
docs     | Introduces changes to the documentation.
chore    | Introduces a small change of the tools, script no production code change.
test     | Usually adding missing tests, refactoring tests; no production code change.
style    | Usually using for format code no production code change.
refactor | Refactoring production code, eg. renaming a variable name of meet.
release  | Release the changes to production.
#4. Create PR + add teamate reivew (Michael, doanlecong, tina or tai)
```
