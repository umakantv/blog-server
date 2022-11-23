const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./auth');

function initiateMiddlewares(app) {
    app.use(cors())
    app.use(express.json())
    app.use(morgan('tiny'))
    app.use(auth)
}

module.exports = initiateMiddlewares;