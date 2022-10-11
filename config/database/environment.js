require("dotenv").config();

module.exports = {
  development: {
    host: process.env.DEVELOPMENT_HOSTNAME,
    database: process.env.DEVELOPMENT_DB_NAME,
    username: process.env.DEVELOPMENT_USERNAME,
    password: process.env.DEVELOPMENT_PASSWORD,
    dialect: process.env.DIALECT
  },
  production: {
    host: process.env.PRODUCTION_HOSTNAME,
    database: process.env.PRODUCTION_DB_NAME,
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD,
    dialect: process.env.DIALECT
  }
};
