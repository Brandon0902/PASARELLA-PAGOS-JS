require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.POSTGRESQL_USERNAME,
    "password": process.env.POSTGRESQL_PASSWORD,
    "database": process.env.POSTGRESQL_DATABASE,
    "host": "127.0.0.1",
    "dialect": "postgresql"
  },
  "staging": {
    "username": process.env.POSTGRESQL_USERNAME,
    "password": process.env.POSTGRESQL_PASSWORD,
    "database": process.env.POSTGRESQL_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "postgresql",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": true,
        "ca": fs.readFileSync('./src/certs/us-east-1-bundle.pem').toString(),
      }
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
