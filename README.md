## Deprecated

This repo is no longer supported, please look to [tyk-demo](https://github.com/TykTechnologies/tyk-demo)

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

| Title     | Description                                                           | Port                   |
| --------- | --------------------------------------------------------------------- | ---------------------- |
| Front end | Angular SPA                                                           | 4200                   |
| Backend   | GraphQL Server. visit `http://localhost:18080` for playground.        | 18080                  |
|           | PostgreSQL - Go Server DB                                             | 15432                  |
|           | Adminer - DB Management for PostgreSQL                                | 7777                   |
|           | Loans Microservice - Node/Express                                     | 3001                   |
| IDP       | Keycloak                                                              | 8081                   |
| Tyk       | Dashboard                                                             | 3000                   |
|           | Gateway                                                               | 8080                   |
|           | Pump                                                                  | N/A                    |
|           | Redis - GW dependency                                                 | 6379                   |
|           | Mongo - DB Depedendency                                               | 27017                  |
| Analytics | (Optional) Splunk - Head to splunk directory for install instructions | 8000, 8088             |
|           | (Optional) ELK - Head to ELK direcotry for install instructions       | 9200, 9300, 5001, 5601 |
|           | - Elastic Search                                                      | 9200, 9300             |
|           | - Logstash                                                            | 5001                   |
|           | - Kibana                                                              | 5601                   |

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

=======
Note that the `setup.sh` setup will generate some usernames & passwords which we will need for the remainder of the setup.

#### 3. Create Keycloak user with graphql_tag

Log into Keycloak via `http://localhost:8081`. The default user and PW are located in the docker-compose env variables.

Create a user, then head over to the `Attributes` page for that user and create a key called `graphql_id` with the value of `graphid` generated by the setup script.

#### 4. Setup Tyk

Log onto the Tyk Dashboard at http://localhost:3000. The username and password were generated by the "setup.sh" script.

1. Create a policy that gives access to both "loan-service-api" & "graphql". Add this policies' ID to the API definitions by going to:
   APIs -> Select API -> RAW API DESIGNER

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

Done! Now you can log into the application as a Banking customer on `http://localhost:4200`. Hit sign in and log in using the credentials you created for the keycloak user.

### Custom IdP?

If you are using everything included in this guide, you can skip to next section.
You will need to inject the generated GraphQL User ID into the OIDC claims (`ID_TOKEN`) so this app can inject it into the Header to Tyk. Also set up the issuer with your provider when creating the API definition within Tyk.

### Todos

Hello Open Source World, can you help ?

- Make work with Windows + Linux
- Replace 'implicit flow' OIDC with something more secure IE OAuth Access Code Flow
