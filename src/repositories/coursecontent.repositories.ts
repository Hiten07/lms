import { lessons } from "../models/lessons";
import { coursemodule } from "../models/coursemodule";
import { course } from "../models/course";
import { enrolled } from "../models/enrolled";
import { lessonsObj } from "../services/course.service";
import { user } from "../models/user";
import { assignment } from "../models/assignment";
import { submission } from "../models/submissions";

export const courseContentRepositories = { 
        async getModuleByCourseId(courseid: number) {
            return coursemodule.findAll({
                where: {
                    courseid: courseid
                }
            })
        },

        async getLessonByModule(moduleid: number) {
            return lessons.findAll({
                where: {
                    moduleid: moduleid
                }
            })
        }
}