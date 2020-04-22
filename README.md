## Tyk-Bank

This repository contains a PoC demonstrating a full stack SPA powered by:

- Angular
- GraphQL
- GO
- NodeJS & Express

and secured by:

- Tyk API Gateway & Management Platform
- Keycloak via OIDC

### Prerequisites

- Docker,
- a Tyk Pro Dashboard license key
- Some time on your hands.

If you don't have a license key, please head on over to www.tyk.io to get a trial key.

_When you have your license, please add it to "license_key" field in "confs/tyk_analytics.conf"._

## What Is The Stack?

The following are the included services needed to run this PoC

| Title     | Description                                                    | Port  |
| --------- | -------------------------------------------------------------- | ----- |
| Front end | Angular SPA                                                    | 4200  |
| Backend   | GraphQL Server. visit `http://localhost:18080` for playground. | 18080 |
|           | PostgreSQL - Go Server DB                                      | 15432 |
|           | Adminer - DB Management for PostgreSQL                         | 7777  |
|           | Loans Microservice - Node/Express                              | 3001  |
| IDP       | Keycloak                                                       | 8081  |
| Tyk       | Dashboard                                                      | 3000  |
|           | Gateway                                                        | 8080  |
|           | Pump                                                           | N/A   |
|           | Redis - GW dependency                                          | 6379  |
|           | Mongo - DB Depedendency                                        | 27017 |

## IMPORTANT

#### disabling CORS

If you run into CORS issues, You will need to run your browser without CORS in order for the front-end to talk to the API.

If Chrome is downloaded on OSX, you can copy paste the following into a terminal to get a CORS compliant browser - this is _not safe_ for regular web browsing:
`open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`

#### MAC OS

This PoC will only work turn-key on Mac OS. That's basically because the Docker networking takes advantage of a special hostname `docker.for.mac.localhost` to wire up a few things together. It's definitely possible to get this running outside OSX, you'll just need to make minor modifications.

## Running The Stack

### 1) Docker-Compose up

Inside the tyk-bank folder, run `docker-compose up -d` to run all services

### 2) Bootstrap

Run `setup.sh`

```
$ ./setup.sh
```

Note that the `setup.sh` setup will generate a Tyk user/pw that you will log into the Dashboard with.

### 3. Create bank users with balances

We need to create a user via the GraphQL mutation.
You can copy and paste this cURL:

```
$ curl 'http://localhost:18080/query' -H 'Content-Type: application/json' --data-binary $'{"operationName":"createUser","variables":{"email":"hello@world.com","name":"Hello World","balance":1000},"query":"mutation createUser($balance: Int!, $name: String!, $email: String!){createUser(input: { balance: $balance, name: $name, email: $email }) {id balance name}}"}' --compressed

{"data":{"createUser":{"id":"405551da-f756-11e9-8980-0242c0a81006","balance":1000,"name":"Hello World"}}}
```

Copy the `id` in the response payload for next step.

#### 4. Create Keycloak user with graphql_tag

Log into Keycloak via `http://localhost:8081`. The default user and PW are located in the docker-compose env variables.

Create a user, then head over to the `Attributes` page for that user and create a key called `graphql_id` with the value of `id` in step #3.

#### 5. Setup Tyk

Log onto the dashboard at http://localhost:3000. The username and password were generated by the "setup.sh" script.

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

3. Do the same for `loan-service/tyk_api_definition.json` but don't create a new policy, simply use the same policy id created in step 2. Modify the policy to give access to both APIs.

Done! Now you can log into the application as a Banking customer on `http://localhost:4200`. Hit sign in and log in using the credentials you created for the keycloak user.

### Custom IdP?

If you are using everything included in this guide, you can skip to next section.
You will need to inject the generated GraphQL User ID into the OIDC claims (`ID_TOKEN`) so this app can inject it into the Header to Tyk. Also set up the issuer with your provider when creating the API definition within Tyk.

### Todos

Hello Open Source World, can you help ?

- Make work with Windows + Linux
- Replace 'implicit flow' OIDC with something more secure IE OAuth Access Code Flow
- Add ElasticSearch to stack
