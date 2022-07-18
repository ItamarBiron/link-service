# RESTful API Node Server:  Link - Service
Link-service is a service that save all your favorits links and there metadata.

## Manual Installation

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```


## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

## Usage
1. Run the dockers with ```yarn docker:dev``` or locally with  ```yarn dev```
2. Open the swagger/other client  and use the register route for creating new user
3. Copy the bearer token from the response and use inside header in all request from now.

   for example :
    ```
    curl -X 'GET' \
      'http://localhost:3000/v1/links' \
      -H 'accept: application/json' \
      -H 'Authorization: Bearer token'
    ```
   Or you can also put that token inside Authorize input in swagger
4. Now you can use all  routes including Links, each action with associate with your connected user.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user

**Links routes**:\
`POST /v1/links` - create a link\
`GET /v1/links` - get all links\
`PATCH /v1/links/:linkId` - update link\
`DELETE /v1/links/:linkId` - delete link



