const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const auth = require('./auth');
const { updateMetrics } = require('./metrics');

function initiateMiddlewares(app, {
    captureMetrics = true
} = {}) {
    app.use(cors())
    app.use(express.json())
    app.use(morgan('tiny'))
    app.use(auth)
    if (captureMetrics) {
        app.use(updateMetrics)
    }
}

module.exports = initiateMiddlewares;