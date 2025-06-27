import { JwtPayload } from "jsonwebtoken";
import { customError } from "../errors/customError";
import { courseRepositories } from "../repositories/course.repositories";
import { course } from "../models/course";
import { coursemodule } from "../models/coursemodule";
import { courseDetails2,lessonsObj } from "../types/customtypes";
import { paginationData } from "../types/interfaces";


export const courseService = {
  async courseCreatedByInstructor(courseid: number, instructorid: number) {
    const result = await courseRepositories.findCourseCreatedByInstructor(
      courseid,
      instructorid
    );
    if (!result) {
      throw new customError(
        "INSTRUCTOR_ACCESS_DENIED",
        "You can only update the submission status for courses created by you."
      );
    }
  },

  async createCourse(data: courseDetails2, user: JwtPayload | undefined) {
      const details = await courseRepositories.findByUserId(user?.id);

      if(!details) {
        throw new customError("NOT_FOUND","something went worong");
      }

      const coursedata = {
        coursename: data.coursename,
        courseprice: data.courseprice,
        description: data.description,
        duration: data.duration,
        instructorid: details?.dataValues.id as number,
      };
      return await courseRepositories.create(coursedata);

  },

  async updateCourse(data: course, courseid: number) {
    try {
      return await courseRepositories.updateCourseById(data, courseid);
    } catch (error) {
      console.log(error);
    }
  },

  async deleteCourse(courseid: number) {
    try {
      return await courseRepositories.deleteCourseById(courseid);
    } catch (error) {
      console.log(error);
    }
  },

  async addModule(courseid: number, data: coursemodule) {
    const course = await courseRepositories.findCourseDetailsById(courseid);

    if (!course) {
      throw new customError(
        "COURSE_NOT_FOUND",
        "course not found, select another course"
      );
    }
    try {
      const coursedata = {
        courseid: courseid,
        title: data.title,
        description: data.description,
        order: data.order,
      };

      return await courseRepositories.addModuleToCourse(coursedata);
    } catch (error) {
      console.log(error);
    }
  },


  async getAllCoursesOfInstructor(instructorid: number,paginationData: paginationData) {
    const allCourses = await courseRepositories.getAllCoursesOfInstructor(
      instructorid,
      paginationData
    );

    if (!allCourses) {
      throw new customError(
        "NO_COURSE_FOUND",
        "no course found with this instructor"
      );
    }
    return allCourses;
  },

  async updateSubmissionRemarks(
    remarks: boolean,
    submissionid: number,
    assignmentid: number,
    courseid: number
  ) {
    try {
      return await courseRepositories.updateSubmissionRemarks(
        remarks,
        submissionid,
        assignmentid,
        courseid
      );
    } catch (error) {
      console.log(error);
    }
  },

  async addLessonToModule(data: lessonsObj, moduleid: number) {
    const course = await courseRepositories.moduleDetailById(moduleid);

    if (!course) {
      throw new customError("MODULE_NOT_FOUND", "module not found");
    }
    return await courseRepositories.addLessonForModule(data);
  },

  async getAllCoursesForStudent(userid: number,paginationData: paginationData) {
    return await courseRepositories.findAllCoursesForStudent(userid,paginationData);
  },

  async getAllStudentsOfCourse(courseid: number, instructorid: number) {
    const result = await courseRepositories.findCourseDetailsById(courseid);

    if (!result) {
      throw new customError(
        "COURSE_NOT_FOUND",
        "course not found, select another course"
      );
    }

    return await courseRepositories.findEnrolledStudentsByCourseId(
      courseid,
      instructorid
    );
  },

  // async getAllCoursesOfStudent(studentid: number) {
  // console.log(studentid)
  // const courses = await courseRepositories.findEnrolledCoursesOfStudents(studentid);

  // if(!courses) {
  //   throw new customError(
  //     "COURSE_NOT_FOUND",
  //     "no course found"
  //   );
  // }
  // return courses;
  // },

  async checkEnrolledStudent(userid: number, courseid: number) {
    const isEnrolled = await courseRepositories.findByUserAndCourse(
      userid,
      courseid
    );

    return isEnrolled;
  },
  
  async enrolledCourse(userid: number, courseid: number) {
    const course = await courseRepositories.findCourseDetailsById(courseid);

    if (!course) {
      throw new customError(
        "COURSE_NOT_FOUND",
        "course not found, select another course"
      );
    }

    const isEnrolled = await courseRepositories.findByUserAndCourse(
      userid,
      courseid
    );

    if (isEnrolled != null) {
      throw new customError(
        "ALREAD_ENROLLED",
        "user already enrolled this course"
      );
    }

    return await courseRepositories.enrollNewUserInCourse(
      userid,
      courseid,
      course
    );
  },

  async getCourseDetailsById(userid: number, courseid: number) {
    const user = await courseRepositories.findByUserAndCourse(userid, courseid);

    const currentDate = new Date();
    const courseExpiryDate = user?.validuntildate;

    if (currentDate > courseExpiryDate!) {
      throw new customError(
        "COURSE_EXPIRED",
        "Course validity has been expired!"
      );
    }

    return await courseRepositories.findCourseDetailsById(courseid);
  },
};

export {lessonsObj}