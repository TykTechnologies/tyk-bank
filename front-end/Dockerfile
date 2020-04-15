########## BUILDER STAGE
FROM node:10.20-alpine3.11 as builder

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install --production
RUN npm install @angular/cli \
                express \
                compression

# Generate the prod files
RUN npm run build:prod

########## FINAL STAGE
FROM node:10.20-alpine3.11

# Create app directory
WORKDIR /usr/src/app

## Copy the html + js files
COPY --from=builder /usr/src/app/dist/tyk-bank ./dist/tyk-bank
## copy the projects server over
COPY ./projects/server/server.js ./projects/server/server.js

RUN npm install path express compression

EXPOSE 4200
CMD [ "node", "./projects/server/server.js" ]