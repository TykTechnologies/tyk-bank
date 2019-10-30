## Run after docker-compose up to bootstrap Keycloak
## Bootstrap keycloak
docker-compose exec keycloak keycloak/bin/add-user-keycloak.sh -u admin -p pw
docker-compose restart keycloak
sleep 5s
docker-compose exec keycloak keycloak/bin/kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user admin --password pw
docker-compose exec keycloak keycloak/bin/kcadm.sh create partialImport -f keycloak-realm.json

# Add the "BANK" user to GraphQL
curl 'http://localhost:18080/query' -H 'Content-Type: application/json' --data-binary $'{"operationName":"createUser","variables":{"email":"BANK@tyk.io","name":"BANK","balance":9999999},"query":"mutation createUser($balance: Int!, $name: String!, $email: String!){createUser(input: { balance: $balance, name: $name, email: $email }) {id balance name}}"}' --compressed