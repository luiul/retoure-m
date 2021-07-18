'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transport.init({
    transport_status: DataTypes.STRING,
    paket_id: DataTypes.INTEGER,
    paket_bez: DataTypes.STRING,
    fach_bez: DataTypes.STRING,
    fach_status: DataTypes.STRING,
    zbs_bez: DataTypes.STRING,
    tour_bez: DataTypes.STRING,
    tour: DataTypes.ARRAY(DataTypes.STRING),
    tour_zeit: DataTypes.ARRAY(DataTypes.STRING),
    emp_name: DataTypes.STRING,
    emp_plz: DataTypes.STRING,
    abd_name: DataTypes.STRING,
    abd_plz: DataTypes.STRING,
    versuch: DataTypes.INTEGER,
    alter: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transport',
  });
  return Transport;
};