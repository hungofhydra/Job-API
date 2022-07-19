require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
//Security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
//Swagger
const swaggerUI =  require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')
//Connect DB
const connectDB = require('./db/connect')
//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const authenticationUser = require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Middleware
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs : 15*60*1000, //15 minutes
  max : 100
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.use('/',swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationUser, jobsRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(` Connected to DB and server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
