import { customError } from "../errors/customError";
import { response } from "../errors/helperError";
import { course } from "../models/course";
import { lessonRepositories } from "../repositories/lesson.repositories";

export const lessonService = {
  async updateTrackProgress(userid: number,courseid: number) {
    try {
      const course = await lessonRepositories.getTrackProgress(courseid);
      console.log(course);
      if (!course) {
        throw new customError("COURSE_NOT_FOUND","course not found");
      }

      const lessons = course.coursemodules.flatMap((mod) => mod.lessons);
      console.log(lessons);
      const lessonIds = lessons.map((l) => l.id);
      const totalLessons = lessonIds.length;

      if (totalLessons === 0) {
        throw new customError("NO_LESSONS","no lessons found in course");
      }

      const completedLessons = await lessonRepositories.getUsersCompletedLessons(userid,lessonIds)
      const percentage = Math.round((completedLessons / totalLessons) * 100);

      const responseObj = {
        courseid,
        totallessons: totalLessons,
        completedLessons: completedLessons,
        percentagenumber: percentage,
      }

      return responseObj;
    } catch (error) {
      console.log(error);
    }
  },

  async updateCourseProgress(
    userid: number,
    courseid: number,
    lessonid: number,
    completed: boolean
  ) {
    try {
      return await lessonRepositories.updateTrackCourseForStudent(
        userid,
        courseid,
        lessonid,
        completed
      );
    } catch (error) {
      console.log(error);
    }
  },

  async trackCourseProgressForStudent(
    userid: number,
    courseid: number,
    lessonid: number,
    completed: boolean
  ) {
    try {
      const lesson = await lessonRepositories.findLessonByID(lessonid);

      if (!lesson) {
        throw new customError(
          "LESSON_NOT_FOUND",
          "lesson not found in this module"
        );
      }
      return await lessonRepositories.findOrCreateLesson(
        userid,
        courseid,
        lessonid,
        completed
      );
    } catch (error) {
      console.log(error);
    }
  },
};
