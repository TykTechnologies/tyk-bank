## Tyk-Bank
This repository contains a PoC demonstrating a full stack application powered by :
- Angular
- GraphQL
- GO

and secured by: 
- Tyk API Gateway
- Keycloak
- OIDC

### Dependencies
This entire PoC can be run locally using Docker.  Though development will require `npm`.
- Docker
- Docker Compose

## IMPORTANT

#### disabling CORS
You will need to run your browser without CORS in order for the front-end to talk to the API. 

If Chrome is downloaded on OSX, you can copy paste the following into a terminal:
`open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`

#### MAC OS
This PoC will only work turn-key on Mac OS.  That's basically because the Docker networking takes advantage of a special hostname `docker.for.mac.localhost` to wire up a few things together.  It's definitely possible to get this running outside OSX, you'll just need to make minor modifications.

## What Is The Stack?

The following are the included services needed to run this PoC
### Front end
- Angular Front End ---> Runs on Port 4200
### Back end
- Go GraphQL Server (Run from source) ---> Port 18080
- PostgreSQL (Go Server DB) ---> Port 15432
- Adminer (DB management for PostgreSQL) ---> Port 7777
- Loans Microservice (Node / Express) ---> Port 3001
### Keycloak
- Keycloak - (Authentication (OIDC) Provider) ---> Runs on port 8081
### Tyk API Gateway
- Tyk API Gateway Stack ---> Gateway and DashBoard on 8080 / 3000 Respectively
- Mongo ---> Port 27017
- Redis ---> Port 6379
- Pump

## Running The Stack

### 1) Docker-Compose up
Inside the tyk-bank folder, run `docker-compose up` to run all services

### 2) Bootstrap
Run both `setup_*.sh` files, order does not matter.  Note that the `setup_tyk.sh` setup will generate a Tyk user/pw that you will log into the Dashboard with.

## Setup Instructions
Once we've run the stack above, follow the instructions below to get everything running:

####  1. Create keycloak admin user/pw
The `setup_bank.sh` script will create an admin account with creds `admin:pw` and automatically import the file at `tyk-bank/keycloak/keycloak-realm.json`.

Log into Keycloak via `http://localhost:8081`.

#### 2. Create bank users with balances
We need to create Users via mutation.  Create our main user to log into.
You can copy and paste this cURL:
```
$ curl 'http://localhost:18080/query' -H 'Content-Type: application/json' --data-binary $'{"operationName":"createUser","variables":{"email":"hello@world.com","name":"Hello World","balance":1000},"query":"mutation createUser($balance: Int!, $name: String!, $email: String!){createUser(input: { balance: $balance, name: $name, email: $email }) {id balance name}}"}' --compressed

{"data":{"createUser":{"id":"405551da-f756-11e9-8980-0242c0a81006","balance":1000,"name":"Hello World"}}}
```

We will need the `id` in order to hook it up via KeyCloak and OIDC. 

#### 3. Create keycloak users with graphql_tag
We need to create Keycloak Users to match our generated back end users.

Create a user via Keycloak GUI, then head over to the `Attributes` page for the user and create a key called `graphql_id` with the value of `id` in step #2.

#### 4. Setup Tyk
1. Import the `graphql-backend/tyk_api_definition.json` file as an API definition.
2. Create a policy that gives access to the API you created above. Take the generated policy ID and stick it in the API definition here created in step #1:

```Javascript
"openid_options": {
    "providers": [
        {
        "issuer": "http://docker.for.mac.localhost:8081/auth/realms/master",
        "client_ids": {
            "dHlrLWJhbms=": "<REPLACE_ME_WITH_POLICY_ID>"
        }
        }
    ],
}
```
3. Do the same for `loan service/tyk_api_definition.json` but don't create a new policy, simply use the same policy created in step 2.

Done!  Now you can log into the application on `http://localhost:4200` and log in via the the keycloak user.

##### Custom IdP?
If you are using everything included in this guide, you can skip to next section.
You will need to inject the generated GraphQL User ID into the OIDC claims (`ID_TOKEN`) so this app can inject it into the Header to Tyk.  Also set up the issuer with your provider when creating the API definition within Tyk.

## Todos
Hello Open Source World, can you help ?
- Make work without CORS special browser
- Make work with Windows + Linux
- Replace 'implicit flow' OIDC with something more secure IE OAuth Access Code Flow
