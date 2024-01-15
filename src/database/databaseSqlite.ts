import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './mydatabase.sqlite',
  logging: false,
});

export default sequelize;
