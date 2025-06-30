"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseContentService = void 0;
const coursecontent_repositories_1 = require("../repositories/coursecontent.repositories");
exports.courseContentService = {
    async getModulesByCourseId(courseid) {
        try {
            return await coursecontent_repositories_1.courseContentRepositories.getModuleByCourseId(courseid);
        }
        catch (error) {
            console.log(error);
        }
    },
    async getLessonsByModuleId(moduleid) {
        try {
            return await coursecontent_repositories_1.courseContentRepositories.getLessonByModule(moduleid);
        }
        catch (error) {
            console.log(error);
        }
    }
};
