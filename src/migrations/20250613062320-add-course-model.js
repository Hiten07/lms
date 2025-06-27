"use strict";

const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("courses", {
      courseid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER,
      },
      coursename: {
        type: DataType.STRING,
        allowNull: false,
      },
      courseprice: {
        type: DataType.INTEGER,
        allowNull: false
      },

      description: {
        type: DataType.STRING,
        allowNull: false
      },
      duration: {
        type: DataType.INTEGER, // in days
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataType.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataType.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("courses");
  },
};
