import { assignmentObj } from "../types/customtypes";
import { submissionObj } from "../types/customtypes";
import { assignmentRepositories } from "../repositories/assignment.repositories";
import { paginationData } from "../types/interfaces";

export const assignmentService = {
  async checkEnrolledStudent(userid: number, courseid: number) {
    const isEnrolled = await assignmentRepositories.findByUserAndCourse(
      userid,
      courseid
    );

    return isEnrolled;
  },

  async createCourseAssignment(assignmentdata: assignmentObj) {
    try {
      return await assignmentRepositories.createCourseForAsssignment(
        assignmentdata
      );
    } catch (error) {
      console.log(error);
    }
  },
  async getSubmissionsByAssignment(courseid: number, assignmentid: number) {
    try {
      return await assignmentRepositories.getSubmissionsForAssignments(
        courseid,
        assignmentid
      );
    } catch (error) {
      console.log(error);
    }
  },

  async updateSubmissionRemarks(
    remarks: boolean,
    submissionid: number,
    assignmentid: number,
    courseid: number
  ) {
    try {
      return await assignmentRepositories.updateSubmissionRemarks(
        remarks,
        submissionid,
        assignmentid,
        courseid
      );
    } catch (error) {
      console.log(error);
    }
  },

  async submitAssignment(submissiondata: submissionObj) {
    try {
      return await assignmentRepositories.submitAssignmentForStudent(
        submissiondata
      );
    } catch (error) {
      console.log(error);
    }
  },

  async updateCourseAssignment(
    assignmentid: number,
    assignmentdata: assignmentObj
  ) {
    try {
      return await assignmentRepositories.updateAssignmentForAssignment(
        assignmentid,
        assignmentdata
      );
    } catch (error) {
      console.log(error);
    }
  },

  async getCourseAssignments(courseid: number) {
    try {
      return await assignmentRepositories.getCourseAssignmentsByCourseId(courseid);
    } catch (error) {
      console.log(error);
    }
  },

  async getCourseAssignmentsWithPagination(courseid: number,paginationData: paginationData) {
    try {
      return await assignmentRepositories.findAssignmentsByCourseId(courseid,paginationData);
    } catch (error) {
      console.log(error);
    }
  },

  async deleteAssignmentForCourse(assignmentid: number) {
    try {
      return await assignmentRepositories.deleteAssignmentForCourse(
        assignmentid
      );
    } catch (error) {
      console.log(error);
    }
  },
};

export { assignmentObj,submissionObj }
