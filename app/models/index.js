const Sequelize = require("sequelize");
const dbConfig = require("../config/db-config.js");

const sequelize = new Sequelize(dbConfig.DB_DATABASE, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
  host: dbConfig.DB_HOST,
  port: dbConfig.options.port,
  define: {
    charset: dbConfig.dialectOptions.charset,
    collate: dbConfig.dialectOptions.collate
  },
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  // disable logging; default: console.log
  logging: true
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.words = require("./word-model.js")(sequelize, Sequelize);
db.tokens = require("./firebase-tokens-model.js")(sequelize, Sequelize);

module.exports = db;