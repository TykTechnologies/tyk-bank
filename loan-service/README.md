## Running
Runs with the included Docker-Compose in root or via `npm start`

Import into Tyk via the `tyk-api-definition.json` file included in this directory

## What is this?
A microservice that will accept a JWT (OIDC) from a Tyk API Gateway, and decode it then inject it into the MakeTransaction GRAPHQL Mutation to the GraphQL Backend

It has a 50/50 chance of accepting or denying the loan.

## Running alone
You may need to run alone to pass the optional parameters in case you need to override the graphql server API or the PORT
docker run -e "GRAPHQLAPI=http://host.docker.internal:18080/query" -e "PORT=3001" -p 3001:3001 --name="loanservice" loan-service