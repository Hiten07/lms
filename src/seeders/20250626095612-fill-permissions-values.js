'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("permissions", [
      {
        permissionname: "createCourse",
        description: "instructor/admin can create course",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionname: "viewCourse",
        description: "anyone can view course",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionname: "deleteUser",
        description: "only admin can delete user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionname: "createAssignment",
        description: "instructor can create assignment user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionname: "submitAssignment",
        description: "only student can submit assignment user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionname: "updateCourse",
        description: "instructor can update course",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        permissionname: "deleteCourse",
        description: "instructor can delete course",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("permissions")
  }
};
