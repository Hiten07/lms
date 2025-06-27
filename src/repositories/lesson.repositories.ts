import { course } from "../models/course";
import { enrolled } from "../models/enrolled";
import { coursemodule } from "../models/coursemodule";
import { trackprogress } from "../models/trackprogress";
import { lessons } from "../models/lessons";

export const lessonRepositories = {
  async findLessonByID(lessonid: number) {
    return lessons.findByPk(lessonid);
  },

  async getTrackProgress(courseid: number) {
    return await course.findByPk(courseid, {
      include: {
        model: coursemodule,
        as: "coursemodules",
        include: [
          {
            model: lessons,
            as: "lessons",
            attributes: ["id", "moduleid", "title"],
          },
        ],
      },
    });
  },

  async getUsersCompletedLessons(userid: number,lessonIds: Array<number>) {
    return await trackprogress.count({
      where: {
        userid,
        lessonid: lessonIds,
        iscompleted: true,
      },
    });
  }
  ,

  async updateTrackCourseForStudent(
    userid: number,
    courseid: number,
    lessonid: number,
    completed: boolean
  ) {
    return trackprogress.update(
      {
        iscompleted: completed,
        completedAt: new Date(),
      },
      {
        where: { userid: userid, courseid: courseid, lessonid: lessonid },
      }
    );
  },

  async findOrCreateLesson(
    userid: number,
    courseid: number,
    lessonid: number,
    completed: boolean
  ) {
    return trackprogress.findOrCreate({
      where: {
        userid: userid,
        courseid: courseid,
        lessonid: lessonid,
      },
      defaults: {
        iscompleted: !!completed,
        completedAt: completed ? new Date() : null,
      },
    });
  },
};
