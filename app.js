const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerUi = require('swagger-ui-express');

// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerJsdoc = require('swagger-jsdoc');

const authRoute = require('./routes/authRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const projectRoute = require('./routes/projectRoute');
const teamRoute = require('./routes/teamRoute');
const userRoute = require('./routes/userRoute');

const { version } = require('./package.json');

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API Docs',
      version,
      description: 'A simple Express API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// swagger page
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// docs in json format
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// console.log(`Docs available at http://127.0.0.1:3000/docs`);

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  }),
);

// app route
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/project', projectRoute);
app.use('/api/v1/team', teamRoute);
app.use('/api/v1/user', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
