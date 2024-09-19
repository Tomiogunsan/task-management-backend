const express = require('express');
const authRoute = require('./routes/authRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.use('/api/v1/auth', authRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
