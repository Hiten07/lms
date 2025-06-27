import { assignmentObj } from "../types/customtypes";
import { assignment } from "../models/assignment";
import { enrolled } from "../models/enrolled";
import { submissionObj } from "../types/customtypes";
import { submission } from "../models/submissions";
import { user } from "../models/user";
import { paginationData } from "../types/interfaces";
import { Op } from "sequelize";

export const assignmentRepositories = {
  async findByUserAndCourse(userid: number, courseid: number) {
    return enrolled.findOne({
      where: {
        userid: userid,
        courseid: courseid,
      },
    });
  },

  async createCourseForAsssignment(assignmentdata: assignmentObj) {
    return assignment.create(assignmentdata);
  },

  async updateAssignmentForAssignment(
    assignmentid: number,
    assignmentdata: assignmentObj
  ) {
    return assignment.update(assignmentdata, {
      where: {
        id: assignmentid,
      },
    });
  },

  async submitAssignmentForStudent(submissiondata: submissionObj) {
    return submission.create(submissiondata);
  },

  async getCourseAssignmentsByCourseId(courseid: number) {
    return assignment.findAll({
      where: {
        courseid: courseid,
      },
    });
  },

  async findAssignmentsByCourseId(
    courseid: number,
    paginationData: paginationData
  ) {
    return assignment.findAndCountAll({
      attributes: [
        "id",
        "courseid",
        "title",
        "description",
        "duedate",
        "assignmentUrl",
      ],
      where: {
        courseid: courseid,

        [Op.or]: [
          {
            title: {
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

  async getSubmissionsForAssignments(courseid: number, assignmentid: number) {
    return submission.findAll({
      where: {
        courseid: courseid,
        assignmentid: assignmentid,
      },
      include: {
        model: user,
        as: "students",
      },
    });
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

  async deleteAssignmentForCourse(assignmentid: number) {
    return assignment.destroy({
      where: {
        id: assignmentid,
      },
    });
  },
};

export { assignmentObj, submissionObj };
