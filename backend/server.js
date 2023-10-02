const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const ErrorHandler = require('./utils/errorHandler');
//comfig
dotenv.config({path:'backend/config/config.env'});

// Handling Uncaught Exceptions
process.on("uncaughtException", (err)=> {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exceptions`);
    process.exit(1);
});

// connecting database
 connectDatabase();


// App listening
const server = app.listen(process.env.PORT,  () => {
    console.log(`server listening on http://localhost:${process.env.PORT}`);
});


// Unhandled Promise Resolution
process.on("unhandledRejection", (err)=> {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejection`);

    server.close(() => {
        process.exit(1);
    });
});