require("dotenv").config();
const Sequelize = require("sequelize");
const config = require("./environment")[process.env.NODE_ENV];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: 'mysql',

    retry: {
        match: [
          /SQLITE_BUSY/,
        ],
        name: 'query',
        max: 5
      },
  pool: {
        maxactive: 1,
        max: 5,
        min: 0,
        idle: 20000
      },
    // timezone: '+01:00',
    // raw: true,
    // pool: {
    //   max: 1,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000
    // }
  }
);


sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to database establised");
  })
  .catch(err => {
    console.error(`Unable to connect to database: ${err}`);
  });
module.exports = sequelize;
