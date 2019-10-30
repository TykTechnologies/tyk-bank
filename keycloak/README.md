# Setup
You will need to setup with Keycloak or use your own Auth service.

The important thing regardless of which IdP you use is to modify the `id_token`, inject into it a key `graphql_id` with the value of the GraphQL generated User ID.

### Bootstrap
Run the bootstrap file in root to bootstrap Keycloak with an admin user and import the `tyk-bank` settings.

### Create User
Then we need to create a User with access to `tyk-bank`.  Finally, head over to `Attributes` for the User and create a key called `graphql_id` with the value of the generated User ID in the GraphQL step.
