'use strict';
const DataType = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER
      },
      firstname: {
        type: DataType.STRING,
        allowNull: false 
      },
      lastname: {
        type: DataType.STRING,
        allowNull: false
      },
      email: {
        type: DataType.STRING,
        unique: true,
        allowNull: false
      },
      phonenumber: {
        type: DataType.BIGINT,
        allowNull: false
      },
      password: {
        type: DataType.STRING,
        allowNull: false
      },
      role: {
        type: DataType.ENUM('student','instructor'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataType.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE
      }

    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
