const path = require('path');
const express = require('express');
const compression = require('compression');

const CONTEXT = `/${process.env.CONTEXT || 'tyk-bank'}`;
const PORT = process.env.PORT || 4200;

// We use this to serve the front-end part of the app
const app = express();

app.use(compression());
app.use(
  CONTEXT,
  express.static(path.resolve(__dirname, '../../dist/tyk-bank'))
);
app.use('/', express.static(path.resolve(__dirname, '../../dist/tyk-bank')));
app.listen(PORT, () =>
  console.log(`App running on http://localhost:${PORT}${CONTEXT}`)
);
