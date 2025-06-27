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
    await queryInterface.createTable("enrolled", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER,
      },
      userid: {
        type: DataType.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      },
      courseid: {
        type: DataType.INTEGER,
        references: {
          model: "courses",
          key: "courseid"
        }
      },
      enrolleddate: {
        type: DataType.DATE,
        defaultValue: Date.now()
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
    await queryInterface.dropTable('enrolled');
  },
};
