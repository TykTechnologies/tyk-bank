FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production
RUN npm install @angular/cli \
                express \
                compression

# Bundle app source
COPY . .

# Generate the prod files
RUN npm run build:prod

EXPOSE 4200
CMD [ "node", "./projects/server/server.js" ]