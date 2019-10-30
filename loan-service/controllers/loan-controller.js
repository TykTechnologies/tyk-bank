var atob = require('atob');
var path = require('path');
const fetch = require('node-fetch');
var constants = require('../constants')
var loanQueries = require('../queries/loans')

exports.loanRequest = function (req, res) {
    var user = getUserFromAuth(req.headers.authorization);
    if (!req.headers.authorization || !user) {
        res.status('401').send('how did you get here')
        return;
    }

    if (!req.query.loanAmount) {
        res.status('403').send('Missing loan amount')
        return;
    }

    // 50:50 chance of Loan Rejection / Acceptance
    if (Math.random() >= 0.5) {
        res.status('200').send({
            loanAccepted: false,
            message: "Loan application denied!"
        });
        return;
    }

    console.log('Posting transaction to DB')
    try {
        fetch(constants.GRAPHQL_API_URI, {
            method: 'POST',
            body: JSON.stringify({
                query: loanQueries.makeTransaction(),
                variables: {
                    sender: BANK_GRAPHQL_ID,
                    recipient: user.graphql_id,
                    amount: req.query.loanAmount
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.text())
        .catch(error => console.error(error));
    } catch (e) {
        console.log(e)
        return;
    }

    res.status('200').send({
        loanAccepted: true,
        message: "Loan granted!"
    });
}

function getUserFromAuth(token) {
    if (!token) {
        console.log("No auth header found")
        return;
    }
    var base64Url = token.split('.')[1];
    try {
        return decodedValue = JSON.parse(atob(base64Url));
    } catch (e) {
        console.log(e)
    }
}