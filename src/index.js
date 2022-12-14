
const { PORT, CAPTURE_PROMETHEUS_METRIC } = require('./config');

const path = require('path')
const tracer = require("./utils/tracing")("blog-service");
const express = require('express');

const { connectDatabase } = require('./database/connectDB');
const initiateRoutes = require('./routes');
const initiateMiddlewares = require('./middlewares');

const app = express();

// Standard Middlewares
initiateMiddlewares(app, {
    captureMetrics: CAPTURE_PROMETHEUS_METRIC
});

// Custom Middlewares
initiateRoutes(app);

app.use(express.static('public'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

connectDatabase()
.then(() => {
    app.listen(PORT, () => {
        console.log('Listening on http://localhost:3050')
    })
})