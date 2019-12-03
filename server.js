'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const log = require('./logger');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const { initDb } = require('./models/index').db;
const app = express();

app.use(
  helmet({
    noCache: true
  })
);
app.use(
  helmet.hidePoweredBy({
    setTo: 'PHP 4.2.0'
  })
);

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes
fccTestingRoutes(app);

apiRoutes(app);

app.use(function(err, req, res, next) {
  if (err) {
  }
});

const port = process.env.PORT || 3000;

initDb(function(err) {
  if (err) {
    throw new Error(err);
  }

  //Start our server and tests!
  app.listen(port, function() {
    log.info('Listening on port ' + port);
    if (process.env.NODE_ENV === 'test') {
      log.debug('Running Tests...');
      setTimeout(function() {
        try {
          runner.run();
          runner.on('done', _ => {
            process.exit(0);
          });
        } catch (e) {
          var error = e;
          log.debug('Tests are not valid:');
          log.error(error);
        }
      }, 1500);
    }
  });
});

module.exports = app; //for unit/functional testing
