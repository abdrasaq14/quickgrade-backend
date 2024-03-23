import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()
const BACKEND_URL = process.env.BACKEND_URL
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  host: BACKEND_URL, // Update this to the URL of your hosted server
  port: 10000, // Update this to the appropriate port if necessary
  logging: false // Optionally, set to false to disable logging SQL queries
})

export default sequelize
