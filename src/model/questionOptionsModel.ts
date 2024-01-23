import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/databaseSqlite'
import { v4 as uuidv4 } from 'uuid'

class questionOptions extends Model {
  static associate (models: any): void {
    // Define the many-to-many relationship with the Course model
    questionOptions.belongsTo(models.Question, {
      foreignKey: 'questionId',
      as: 'question'
    })
  }
}

questionOptions.init(
  {
    optionId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    optionA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionB: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionC: {
      type: DataTypes.STRING,
      allowNull: false
    },
    optionD: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correctOption: {
      type: DataTypes.STRING,
      allowNull: false
    }

  },
  {
    sequelize,
    modelName: 'questionOptions'
  }
)

export default questionOptions
