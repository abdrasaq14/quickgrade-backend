import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  host: 'https://quickgrade-backend-kg24.onrender.com/', // Update this to the URL of your hosted server
  port: 10000, // Update this to the appropriate port if necessary
  logging: false // Optionally, set to false to disable logging SQL queries
})

export default sequelize
