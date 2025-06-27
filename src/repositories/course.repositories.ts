import { course } from "../models/course";
import { Op } from "sequelize";
import { courseDetails, moduleDetails, assignmentObj, submissionObj } from "../types/customtypes";
import { paginationData } from "../types/interfaces";
import { coursemodule } from "../models/coursemodule";
import { enrolled } from "../models/enrolled";
import { lessonsObj } from "../types/customtypes";
import { user } from "../models/user";
import { addDays } from "date-fns";
import { lessons } from "../models/lessons";
import { submission } from "../models/submissions";

export const courseRepositories = {
  async findByUserId(id: number) {
    return user.findByPk(id);
  },

  async findCourseCreatedByInstructor(courseid: number, instructorid: number) {
    return await course.findOne({
      where: {
        courseid: courseid,
        instructorid: instructorid,
      },
    });
  },

  async findAllCoursesForStudent(
    userid: number,
    paginationData: paginationData
  ) {
    return await course.findAndCountAll({
      attributes: [
        "coursename",
        "courseprice",
        "description",
        "duration",
        "instructorid",
      ],

      include: [
        {
          model: enrolled,
          as: "courses",

          where: {
            userid: userid,
          },

          required: true,
          attributes: ["userid", "enrolleddate", "validuntildate"],
        },
      ],

      where: {
        [Op.or]: [
          {
            coursename: {
              [Op.like]: `%${paginationData.search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${paginationData.search}%`,
            },
          },
        ],
      },

      order: [[paginationData.sortBy, paginationData.sortType]],
      limit: paginationData.limit,
      offset: paginationData.offset,
    });
  },

  async create(courseCreationData: courseDetails) {
    return course.create(courseCreationData);
  },

  async findByUserAndCourse(userid: number, courseid: number) {
    return enrolled.findOne({
      where: {
        userid: userid,
        courseid: courseid,
      },
    });
  },

  async updateCourseById(courseUpdationData: course, courseid: number) {
    return course.update(courseUpdationData, {
      where: {
        courseid: courseid,
      },
    });
  },

  async deleteCourseById(courseid: number) {
    return course.destroy({
      where: {
        courseid: courseid,
      },
    });
  },

  async moduleDetailById(moduleid: number) {
    return coursemodule.findByPk(moduleid);
  },

  async findCourseDetailsById(courseid: number) {
    return course.findByPk(courseid);
  },

  async addModuleToCourse(coursemoduledata: moduleDetails) {
    return coursemodule.create(coursemoduledata);
  },

  async addLessonForModule(lessondata: lessonsObj) {
    return lessons.create(lessondata);
  },

  async updateSubmissionRemarks(
    remarks: boolean,
    submissionid: number,
    assignmentid: number,
    courseid: number
  ) {
    const remarkOBj = {
      isaccepted: remarks,
    };

    return submission.update(remarkOBj, {
      where: {
        id: submissionid,
        assignmentid: assignmentid,
        courseid: courseid,
      },
    });
  },

  async enrollNewUserInCourse(
    userId: number,
    courseid: number,
    course: course
  ) {
    const currentDate = new Date();
    const validUntilDate = addDays(currentDate, course.duration);

    console.log(validUntilDate);

    return enrolled.create({
      userid: userId,
      courseid: courseid,
      validuntildate: validUntilDate,
    });
  },

  async getAllCoursesOfInstructor(instructorid: number,paginationData: paginationData) {
    console.log(paginationData.search)
    return course.findAndCountAll({
      where: {
        instructorid: instructorid,
        [Op.or]: [
          {
            coursename: {
              [Op.like]: `%${paginationData.search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${paginationData.search}%`,
            },
          },
        ],
      },

      order: [[paginationData.sortBy, paginationData.sortType]],
      limit: paginationData.limit,
      offset: paginationData.offset,
    });
  },

  async findEnrolledStudentsByCourseId(courseid: number, instructorid: number) {
    return course.findOne({
      where: {
        courseid: courseid,
        instructorid: instructorid,
      },
      attributes: {
        exclude: ["courseid", "createdAt", "updatedAt", "deletedAt"],
      },
      include: [
        {
          model: user,
          as: "students",
          attributes: ["id", "firstname", "lastname", "email"],
          through: {},
        },
      ],
    });
  },
};

export { submissionObj, assignmentObj };
