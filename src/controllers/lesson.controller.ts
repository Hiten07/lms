import { Request, Response } from "express";
import { lessonService } from "../services/lesson.services";
import { customError } from "../errors/customError";
import { response, catchResponse } from "../errors/helperError";
import { Error } from "sequelize";

export const lessonController = {
  async getCourseProgress(req: Request, res: Response) {
    try {
      const courseid = parseInt(req.params?.courseid);
      const result = await lessonService.updateTrackProgress(
        req.user?.id,
        courseid
      );

      if (result) {
        response(res, result, "Track progress fetched successfully");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof customError) {
        if (error.name == "NO_LESSONS") {
          res.status(401).json({
            message: error.error,
          });
        } else {
          res.status(500).json({
            message: "Internal server error",
          });
        }
      }
    }
  },

  async trackCourseProgress(req: Request, res: Response) {
    try {
      const { lessonid, completed } = req.body;
      const courseid = parseInt(req.params.courseid);

      const result = await lessonService.trackCourseProgressForStudent(
        req.user?.id,
        courseid,
        lessonid,
        completed
      );

      if (!Array.isArray(result)) {
        res.status(500).json({ message: "Unexpected result from service" });
      }

      const [trackprogress1, created] = result!;

      if (!created) {
        if (completed && !trackprogress1.iscompleted) {
          const result = await lessonService.updateCourseProgress(
            req.user?.id,
            courseid,
            lessonid,
            completed
          );

          if (result) {
            response(res, result, "Lesson marked as completed");
          }
        } 
        
        else if (!completed && !trackprogress1.iscompleted) {
          response(res, result, "Lesson already added");
        }
        
        else {
          response(res, result, "Lesson already completed");
        }
        
      } else {
        response(res, result, "Lesson added successfully");
      }
    } catch (error) {
      if (error instanceof customError) {
        if (error.name == "LESSON_NOT_FOUND") {
          res.status(401).json({
            message: error.name,
          });
        }
      } else {
        catchResponse(res, error as Error);
      }
    }
  },
};
