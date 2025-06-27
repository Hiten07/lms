import { JwtPayload } from "jsonwebtoken";
import { customError } from "../errors/customError";
import { CourseContentController } from "../controllers/coursecontent.controller";
import { course } from "../models/course";
import { coursemodule } from "../models/coursemodule";
import { courseContentRepositories } from "../repositories/coursecontent.repositories"

export const courseContentService = {
    async getModulesByCourseId(courseid: number) {
        try {
            return await courseContentRepositories.getModuleByCourseId(courseid);
        } catch (error) {
            console.log(error);
        }
    },

    async getLessonsByModuleId(moduleid: number) {
        try {
            return await courseContentRepositories.getLessonByModule(moduleid);
        } catch (error) {
            console.log(error);
        }
    }
}
