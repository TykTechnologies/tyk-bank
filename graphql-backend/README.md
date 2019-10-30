# Graphql Backend

Fully implement graphql backend for the fintec demo.
Uses Postgres as database.

## prerequisites

- go 1.12.x
- docker
- docker compose

## running the demo

1. start the database

```shell script
cd ./graphql-workshop/fintech-example/graphql-backend
docker-compose up
```

2. migrate the database

<s>use your IDE/cli of choice and apply database.sql to create the schema and tables</s>

no longer needed, database gets migrated automatically

3. run the graphql server

```shell script
cd ./graphql-workshop/fintech-example/graphql-backend
go run ./server/server.go
```

4. run some sample queries

4.1 create a user

```graphql
mutation {
  createUser(input: { balance: 100, name: "Jens", email: "jens@tyk.io" }) {
    id
    balance
    name
  }
}
```

4.2 query users

```graphql
{
  users {
    id
    balance
    name
    address {
      city
      country
    }
  }
}
```

4.3 query a specific user

replace id with an existing id, postgres generates random uuid's when you create a new user

```graphql
{
  user(id: "44c92d14-c960-11e9-b4b7-0242ac130003") {
    id
    balance
    name
    address {
      city
      country
    }
    transactions(first: 10) {
      id
      amount
      sender {
        name
        balance
      }
      recipient {
        name
        balance
      }
    }
  }
}
```

4.4 update user details

replace id with an existing id, postgres generates random uuid's when you create a new user

```graphql
mutation {
  updateUserDetails(
    userID: "44c92d14-c960-11e9-b4b7-0242ac130003"
    input: {
      address: {
        country: "Germany"
        city: "Frankfurt"
        postalCode: ""
        street: ""
      }
    }
  ) {
    id
    address {
      city
      country
    }
  }
}
```

4.5 create some transactions

replace sender and recipient with valid ID's

```graphql
mutation {
  makeTransaction(
    input: {
      recipient: "ad4c562c-c974-11e9-9428-0242ac130003"
      sender: "29aec35c-c96c-11e9-b10d-0242ac130003"
      amount: 10
    }
  ) {
    id
    date
    amount
    sender {
      ...userFragment
    }
    recipient {
      ...userFragment
    }
  }
}

fragment userFragment on User {
  id
  name
  balance
}
```

4.6 query transactions

you can omit afterID if you want, it's optional
you can use a combination of 'first: x + afterID: someID' to get the first x transactions after a specific ID ordered by date desc
=> pagination

```graphql
{
  transactions(first: 5, afterID: "ab96fd45-c8ba-4b54-be65-a1bf67d1119b") {
    id
    date
    amount
    sender {
      ...userFragment
    }
    recipient {
      ...userFragment
    }
  }
}

fragment userFragment on User {
  id
  name
  balance
  address {
    country
  }
}
```
