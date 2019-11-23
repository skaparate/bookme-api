'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const { initDb } = require('./models/index').db;
const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes
fccTestingRoutes(app);

apiRoutes(app);

const port = process.env.PORT || 3000;

initDb(function(err) {
  if (err) {
    throw new Error(err);
  }

  //Start our server and tests!
  app.listen(port, function() {
    console.log('Listening on port ' + port);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function() {
        try {
          runner.run();
          runner.on('done', _ => {
            process.exit(0);
          });
        } catch (e) {
          var error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 1500);
    }
  });
});

module.exports = app; //for unit/functional testing
