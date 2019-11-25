const mongoose = require('mongoose');
const log = require('../logger').child({
  service: 'db'
});

function initDb(callback) {
  log.debug('Connecting to database');
  const uri = `mongodb://${process.env.DB_HOST}`;
  log.debug('DB URI: %s', uri);
  const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };
  log.debug('Connection options:', options);
  mongoose.connect(uri, options).then(
    _ => {
      log.info('Database connection stablished');
      callback();
    },
    error => {
      log.error('Failed to connect to the database:', error);
      callback('Connection to database failed');
    }
  );
}

function closeDb(callback) {
  mongoose.connection.close().then(
    _ => {
      log.debug('Database connection closed');
      callback();
    },
    err => {
      log.error('Failed to close database connection:', err);
      callback('An error ocurred when closing the connection');
    }
  );
}

process.on('SIGINT', _ => {
  log.info('Closing database connection');
  closeDb(function(err) {
    if (err) {
      log.error('Failed to close database connection:', err);
      process.exit(-1);
    } else {
      process.exit(0);
    }
  });
});

module.exports = {
  initDb,
  closeDb
};
