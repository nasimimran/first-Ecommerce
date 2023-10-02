const express = require('express');
const app = express();
// Routes import
const product = require('./routes/productRoute');
// Middleware for error import
const errorMiddleware = require('./middleware/error');



app.use(express.json());

app.use('/api/v1',product);

// Middleware for error
app.use(errorMiddleware);



module.exports = app;