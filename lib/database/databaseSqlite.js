"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const BACKEND_URL = process.env.BACKEND_URL;
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    host: BACKEND_URL, // Update this to the URL of your hosted server
    port: 10000, // Update this to the appropriate port if necessary
    logging: false // Optionally, set to false to disable logging SQL queries
});
exports.default = sequelize;
