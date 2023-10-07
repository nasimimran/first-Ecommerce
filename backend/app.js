const express = require('express');
const app = express();
// Routes import
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
// Middleware for error import
const errorMiddleware = require('./middleware/error');



app.use(express.json());

app.use('/api/v1',product);
app.use('/api/v1',user);

// Middleware for error
app.use(errorMiddleware);



module.exports = app;