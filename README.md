# Book Me, Personal Library

This is a Free Code Camp's information security and QA project.

## How to use

1. Create a .env file on the root of the project (or pass the variables directly to node) and define the following variables:
   - DB_USER, the user name of the MongoDB database,
   - DB_PASS, the password for the database,
   - DB_HOST, one or more hosts ([check mongoose connection](https://mongoosejs.com/docs/connections.html#replicaset_connections)),
   - DB_NAME, the name of the database to use,
   - PORT, the app listening port.
2. Run:

```
# For production
npm install
npm run build

# For development
npm install
npm run watch
```

For local development, You can [use the docker-compose.yml file](docker-compose.yml) to create a local mongodb instance. You'll need to install docker and docker-compose, of course.

## Tests

To run the tests, run:

```
# If not already executed
npm install
npm run unit-tests
```

## Thanks

- [Free Code Camp](https://freecodecamp.org/)
- [Mongoose](https://mongoosejs.com/)
- [Docker](https://docker.com/)
- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Mocha](https://mochajs.com/)
- [Chai](https://chaijs.com/)
