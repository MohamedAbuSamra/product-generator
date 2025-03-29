const Sequelize = require("sequelize");

class Model extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        // column:n DataTypes.STRING,
      },
      {
        tableName: "tableName",
        timestamps: false,
        sequelize,
      }
    );
  }

  static associate(models) {}
}

module.exports = Model;
