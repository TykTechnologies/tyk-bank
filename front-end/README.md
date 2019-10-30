# Install Guide 

## From source
- Run `npm install` then `npm start` to run from source, or alternatively, use the included Dockerfile.

## From Docker
build the Dockerfile
`Dockerfile build -t tyk-bank-fe .`
Then run it
`Docker run -p 4200:4200 tyk-bank-fe`

## CORS
If running locally, remember to disable CORS in order to allow your Bank FE to communicate with the GraphQL Server

## Fork of:

https://github.com/tomastrajan/angular-ngrx-material-starter

This front-end is built off the nice UI starter provided above. Visit and star their repo!

## Useful Commands

- `npm start` - starts a dev server and opens browser with running app
- `npm run start:prod` - runs full prod build and serves prod bundle
- `npm run test` - runs lint and tests
- `npm run watch` - runs tests in watch mode
- `npm run prettier` - runs prettier to format whole code base (`.ts` and `.scss`)
- `npm run analyze` - runs full prod build and `webpack-bundle-analyzer` to visualize how much code is shipped (dependencies & application)

## Stack

- Angular
- ngrx (or try [ngx-model](https://github.com/tomastrajan/ngx-model) if you prefer less boilerplate)
- Angular Material
- Bootstrap 4 (only reset, utils and grids)

## Todos

- adjust colors in `/themes/default-theme.scss`
