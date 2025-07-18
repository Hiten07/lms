"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("roles", [
      {
        id: 1,
        rolename: "admin",
        description: "admin of system",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        rolename: "instructor",
        description: "mentors of lms",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        rolename: "student",
        description: "students of lms",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("roles");
  },
};
