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
    "dialect": "postgresql"
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
