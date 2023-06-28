const express = require('express')
const cors = require('cors')
const auth = require('./auth')
const { updateMetrics } = require('./metrics')
const requestEntry = require('./requestEntry')
const handleRequestException = require('./handleRequestException')
const logRequestErrorResponse = require('./logRequestErrorResponse')
const logger = require('./logger')

function initiatePreResponseMiddlewares(app, {
    captureMetrics = true
} = {}) {
    app.use(cors())
    app.use(express.json())
    app.use(requestEntry)
    app.use(logger)
    app.use(auth)
    if (captureMetrics) {
        app.use(updateMetrics)
    }
}

function initiatePostResponseMiddlewares(app) {
    app.use(logRequestErrorResponse)
    app.use(handleRequestException)
}

module.exports = {
    initiatePreResponseMiddlewares,
    initiatePostResponseMiddlewares,
}