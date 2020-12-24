const Sequelize = require('sequelize');
require('dotenv').config();

console.log(process.env.APP_NAME);

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;