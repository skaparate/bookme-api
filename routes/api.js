const Router = require('express').Router;
const mongoose = require('mongoose');
const bookRoutes = require('./book-routes');

function dbConnect(req, res, next) {
  console.debug('Connecting to database');
  const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
  console.debug('DB URI:', uri);
  const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  console.debug('Connection options:', options);
  mongoose.connect(uri, options).then(
    _ => {
      console.info('Database connection stablished');
      next();
    },
    error => {
      console.error('Failed to connect to the database:', error);
      return res.json({
        error: 'Connection to database failed'
      });
    }
  );
}

function mainRoutes() {
  const router = Router();
  router.route('/').get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

  return router;
}

module.exports = app => {
  console.debug('Defining API Routes');
  const router = Router();
  router.all('/api/*', dbConnect);
  router.use(mainRoutes());
  router.use(bookRoutes());

  //404 Not Found Middleware
  router.use(function(req, res, next) {
    res
      .status(404)
      .type('text')
      .send('Not Found');
  });
  app.use(router);
};
