"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const course_service_1 = require("../services/course.service");
const customError_1 = require("../errors/customError");
const helperError_1 = require("../errors/helperError");
const assignment_service_1 = require("../services/assignment.service");
const paginationData_1 = require("../utils/paginationData");
exports.courseController = {
    async createCourse(req, res) {
        try {
            const result = await course_service_1.courseService.createCourse(req.body, req.user);
            if (result) {
                (0, helperError_1.response)(res, result, "Course created successfully");
            }
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
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
    async updateCourseDetails(req, res) {
        try {
            const courseid = Number(req.params?.courseid);
            const result = await course_service_1.courseService.updateCourse(req.body, courseid);
            if (result) {
                (0, helperError_1.response)(res, result, "Course updated successfully");
            }
        }
        catch (error) {
            (0, helperError_1.catchResponse)(res, error);
        }
    },
    async deleteCourseDetails(req, res) {
        try {
            const courseid = Number(req.params?.courseid);
            const result = await course_service_1.courseService.deleteCourse(courseid);
            if (result) {
                (0, helperError_1.response)(res, result, "Course updated successfully");
            }
        }
        catch (error) {
            (0, helperError_1.catchResponse)(res, error);
        }
    },
    async addModuleToCourse(req, res) {
        try {
            const courseid = Number(req.params?.courseid);
            const result = await course_service_1.courseService.addModule(courseid, req.body);
            if (result) {
                (0, helperError_1.response)(res, result, "Course module added successfully");
            }
        }
        catch (error) {
            (0, helperError_1.catchResponse)(res, error);
        }
    },
    async addModuleLesson(req, res) {
        try {
            const files = req.files;
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
            const result = await course_service_1.courseService.addLessonToModule(lessonData, moduleid);
            (0, helperError_1.response)(res, result, "lesson added successfully to the module");
        }
        catch (error) {
            console.error("Cloudinary upload error:", error);
            if (error instanceof customError_1.customError) {
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
    async enrolledCourses(req, res) {
        try {
            const courseid = parseInt(req.params?.courseid);
            const result = await course_service_1.courseService.enrolledCourse(req.user?.id, courseid);
            res.status(200).json({
                message: "Successfully enrolled in the course",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name === "ALREAD_ENROLLED")
                    res.status(400).json({
                        message: error.error,
                    });
                else if (error.name == "COURSE_NOT_FOUND") {
                    res.status(404).json({
                        message: error.error,
                    });
                }
            }
            else {
                console.log(error);
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async getAllAssignments(req, res) {
        const courseid = parseInt(req.params?.courseid);
        const user = req.user;
        try {
            const enrolled = await course_service_1.courseService.checkEnrolledStudent(user?.id, courseid);
            if (!enrolled && user.role === "student") {
                res.status(403).json({ error: "You are not enrolled in this course" });
                return;
            }
            const assignments = await assignment_service_1.assignmentService.getCourseAssignments(courseid);
            if (assignments.length > 0) {
                (0, helperError_1.response)(res, assignments, "Assignments retrieved successfully");
            }
            else {
                res.status(404).json({ error: "No assignments found for this course" });
            }
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ error: "An error occurred while retrieving assignments" });
        }
    },
    async getStudentCourses(req, res) {
        try {
            const page = Number(req.query.page) || 0;
            const limit = Number(req.query.pageSize) || 5;
            const offset = page * limit;
            const sortBy = String(req.query.sortBy) || "title";
            const sortType = req.query.sortType === "asc" ? "ASC" : "DESC";
            const userid = req.user?.id;
            const search = req.query.search || "";
            const paginationData = {
                limit: limit,
                offset: offset,
                sortBy: sortBy,
                sortType: sortType,
                search: search,
            };
            const enrollcourses = await course_service_1.courseService.getAllCoursesForStudent(userid, paginationData);
            const result = (0, paginationData_1.paginationresponse)(enrollcourses, page, limit);
            (0, helperError_1.response)(res, result, "courses fetched successfully");
        }
        catch (error) {
            console.log(error);
        }
    },
    async getAllStudentsOfCourse(req, res) {
        const courseid = parseInt(req.params?.courseid);
        try {
            const instructorid = req.user?.id;
            const result = await course_service_1.courseService.getAllStudentsOfCourse(courseid, instructorid);
            (0, helperError_1.response)(res, result, "students enrolled in course fetched successfully");
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name === "COURSE_NOT_FOUND")
                    res.status(400).json({
                        message: error.error,
                    });
            }
            else {
                console.log(error);
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async getAllInstructorCourses(req, res) {
        try {
            const page = Number(req.query.page) || 0;
            const limit = Number(req.query.pageSize) || 5;
            const offset = page * limit;
            const sortBy = String(req.query.sortBy) || "duration";
            const sortType = req.query.sortType === "asc" ? "ASC" : "DESC";
            const userid = req.user?.id;
            const search = req.query.search || "";
            const paginationData = {
                limit: limit,
                offset: offset,
                sortBy: sortBy,
                sortType: sortType,
                search: search,
            };
            const result = await course_service_1.courseService.getAllCoursesOfInstructor(userid, paginationData);
            const courses = (0, paginationData_1.paginationresponse)(result, page, limit);
            (0, helperError_1.response)(res, courses, "courses fetched successfully");
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name === "NO_COURSE_FOUND")
                    res.status(400).json({
                        message: error.error,
                    });
            }
            else {
                console.log(error);
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async getCourseDetailsById(req, res) {
        try {
            const courseid = parseInt(req.params?.courseid);
            const course = await course_service_1.courseService.getCourseDetailsById(req.user?.id, courseid);
            (0, helperError_1.response)(res, course, "course details fetched successfully");
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name === "COURSE_EXPIRED")
                    res.status(400).json({
                        message: error.error,
                    });
            }
            else {
                console.log(error);
                res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
};
