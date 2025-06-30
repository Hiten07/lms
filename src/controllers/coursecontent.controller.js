"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseContentController = void 0;
const course_service_1 = require("../services/course.service");
const coursecontent_services_1 = require("../services/coursecontent.services");
exports.CourseContentController = {
    async getModulesWithLessons(req, res) {
        const courseid = parseInt(req.params?.courseid);
        const user = req.user;
        try {
            if (user?.role === "student") {
                const enrolled = await course_service_1.courseService.checkEnrolledStudent(user?.id, courseid);
                if (!enrolled) {
                    res.status(403).json({ error: "You are not enrolled in this course" });
                    return;
                }
            }
            // Fetch modules ordered by 'order'
            const modules = await coursecontent_services_1.courseContentService.getModulesByCourseId(courseid);
            if (!modules || modules.length === 0) {
                res.status(404).json({ error: "No modules found for this course" });
                return;
            }
            console.log(modules);
            // For each module fetch lessons ordered by 'order'
            const modulesWithLessons = await Promise.all(modules.map(async (module) => {
                const lessons = await coursecontent_services_1.courseContentService.getLessonsByModuleId(module.id);
                return {
                    id: module.id,
                    title: module.title,
                    description: module.description,
                    order: module.order,
                    lessons: lessons || []
                };
            }));
            res.status(200).json(modulesWithLessons);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to retrieve course content" });
        }
    }
};
