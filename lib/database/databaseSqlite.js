"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
<<<<<<< HEAD
    storage: './database.sqlite',
=======
    storage: './mydatabase.sqlite',
>>>>>>> 2ea20dc66b78cf3c1775b9f152efad19840ab751
    logging: false,
});
exports.default = sequelize;
