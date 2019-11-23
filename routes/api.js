const Router = require('express').Router;
const bookRoutes = require('./book-routes');

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
