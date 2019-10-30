var indexRouter = require('./index');
var loanRouter = require('./loan');

function setRoutes(app) {
    console.log('setting the routes with: ' + app);
    app.use('/', indexRouter);
    app.use('/loan', loanRouter);
}

module.exports = setRoutes;