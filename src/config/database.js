require('dotenv').config();
const { Sequelize } = require('sequelize');

let extra_params = {};

if (process.env.DB_REQUIRE_SSL === 'true') {
  extra_params = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync('./src/certs/us-east-1-bundle.pem').toString(),
    }
  }
}

const sequelize = new Sequelize(
  process.env.POSTGRESQL_DATABASE,
  process.env.POSTGRESQL_USERNAME,
  process.env.POSTGRESQL_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    timezone: '+00:00',
    dialectOptions: {
      useUTC: true,
      ...extra_params
    }
  }
);

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a PostgreSQL con Sequelize');
    return true;
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  connect,
};
