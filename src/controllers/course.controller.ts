import { Request, Response } from "express";
import { courseService } from "../services/course.service";
import { customError } from "../errors/customError";
import { catchResponse, response } from "../errors/helperError";
import { assignmentService } from "../services/assignment.service";
import { paginationData } from "../types/interfaces";
import { paginationresponse } from "../utils/paginationData";

export const courseController = {
  async createCourse(req: Request, res: Response) {
    try {
      const result = await courseService.createCourse(req.body, req.user);
      if (result) {
        response(res, result, "Course created successfully");
      }
    } catch (error) {
      if (error instanceof customError) {
        if (error.name === "NOT_FOUND")
          res.status(400).json({
            message: error.error,
          });
        else {
          res.status(500).json({
            message: "Internal server error",
          });
        }
      }
    }
  },

  async updateCourseDetails(req: Request, res: Response) {
    try {
      const courseid = Number(req.params?.courseid);
      const result = await courseService.updateCourse(req.body, courseid);
      if (result) {
        response(res, result, "Course updated successfully");
      }
    } catch (error) {
      catchResponse(res, error as Error);
    }
  },

  async deleteCourseDetails(req: Request, res: Response) {
    try {
      const courseid = Number(req.params?.courseid);
      const result = await courseService.deleteCourse(courseid);
      if (result) {
        response(res, result, "Course updated successfully");
      }
    } catch (error) {
      catchResponse(res, error as Error);
    }
  },

  async addModuleToCourse(req: Request, res: Response) {
    try {
      const courseid = Number(req.params?.courseid);
      const result = await courseService.addModule(courseid, req.body);
      if (result) {
        response(res, result, "Course module added successfully");
      }
    } catch (error) {
      catchResponse(res, error as Error);
    }
  },

  async addModuleLesson(req: Request, res: Response) {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (!files || !files.videos || files.videos.length === 0) {
        res.status(400).json({ error: "video files are required uploaded" });
      }

      const moduleid = parseInt(req.params?.moduleid);

      const lessonData = {
        moduleid: moduleid,
        title: req.body.title,
        description: req.body.description,
        videoUrl: files.videos[0].path,
      };

      if (files.docs) {
        Object.assign(lessonData, { fileUrl: files.docs[0].path });
      }

      const result = await courseService.addLessonToModule(
        lessonData,
        moduleid
      );

      response(res, result, "lesson added successfully to the module");
    } catch (error: unknown) {
      console.error("Cloudinary upload error:", error);

      if (error instanceof customError) {
        if (error.name === "MODULE_NOT_FOUND")
          res.status(400).json({
            message: error.error,
          });
        else {
          res.status(500).json({
            message: "Internal server error",
          });
        }
      }
    }
  },

  async enrolledCourses(req: Request, res: Response) {
    try {
      const courseid = parseInt(req.params?.courseid);

      const result = await courseService.enrolledCourse(req.user?.id, courseid);
      res.status(200).json({
        message: "Successfully enrolled in the course",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof customError) {
        if (error.name === "ALREAD_ENROLLED")
          res.status(400).json({
            message: error.error,
          });
        else if (error.name == "COURSE_NOT_FOUND") {
          res.status(404).json({
            message: error.error,
          });
        }
      } else {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },

  async getAllAssignments(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);
    const user = req.user;
    try {
      const enrolled = await courseService.checkEnrolledStudent(
        user?.id,
        courseid
      );
      if (!enrolled && user!.role === "student") {
        res.status(403).json({ error: "You are not enrolled in this course" });
        return;
      }
      const assignments = await assignmentService.getCourseAssignments(
        courseid
      );
      if (assignments!.length > 0) {
        response(res, assignments, "Assignments retrieved successfully");
      } else {
        res.status(404).json({ error: "No assignments found for this course" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving assignments" });
    }
  },

  async getStudentCourses(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 0;

      const limit = Number(req.query.pageSize) || 5;

      const offset = page * limit;

      const sortBy = String(req.query.sortBy) || "title";

      const sortType = req.query.sortType === "asc" ? "ASC" : "DESC";

      const userid = req.user?.id;

      const search = (req.query.search as string) || "";

      const paginationData: paginationData = {
        limit: limit,
        offset: offset,
        sortBy: sortBy,
        sortType: sortType,
        search: search,
      };

      const enrollcourses = await courseService.getAllCoursesForStudent(
        userid,
        paginationData
      );

      const result = paginationresponse(enrollcourses, page, limit);

      response(res, result, "courses fetched successfully");
    } catch (error) {
      console.log(error);
    }
  },

  async getAllStudentsOfCourse(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);

    try {
      const instructorid = req.user?.id;
      const result = await courseService.getAllStudentsOfCourse(
        courseid,
        instructorid
      );
      response(res, result, "students enrolled in course fetched successfully");
    } catch (error) {
      if (error instanceof customError) {
        if (error.name === "COURSE_NOT_FOUND")
          res.status(400).json({
            message: error.error,
          });
      } else {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },

  async getAllInstructorCourses(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 0;

      const limit = Number(req.query.pageSize) || 5;

      const offset = page * limit;

      const sortBy = String(req.query.sortBy) || "duration";

      const sortType = req.query.sortType === "asc" ? "ASC" : "DESC";

      const userid = req.user?.id;

      const search = (req.query.search as string) || "";

      const paginationData: paginationData = {
        limit: limit,
        offset: offset,
        sortBy: sortBy,
        sortType: sortType,
        search: search,
      };

      const result = await courseService.getAllCoursesOfInstructor(
        userid,
        paginationData
      );

      const courses = paginationresponse(result, page, limit);
      response(res, courses, "courses fetched successfully");
    } catch (error) {
      if (error instanceof customError) {
        if (error.name === "NO_COURSE_FOUND")
          res.status(400).json({
            message: error.error,
          });
      } else {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },

  async getCourseDetailsById(req: Request, res: Response) {
    try {
      const courseid = parseInt(req.params?.courseid);
      const course = await courseService.getCourseDetailsById(
        req.user?.id,
        courseid
      );
      response(res, course, "course details fetched successfully");
    } catch (error) {
      if (error instanceof customError) {
        if (error.name === "COURSE_EXPIRED")
          res.status(400).json({
            message: error.error,
          });
      } else {
        console.log(error);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },
};
