const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

// Connecting to a database (see https://sequelize.org/master/manual/getting-started.html)
module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: 0,
    logging: console.log,

    // Initialize pool to avoid having to open and close single connections
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});