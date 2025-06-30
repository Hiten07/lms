"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonController = void 0;
const lesson_services_1 = require("../services/lesson.services");
const customError_1 = require("../errors/customError");
const helperError_1 = require("../errors/helperError");
exports.lessonController = {
    async getCourseProgress(req, res) {
        try {
            const courseid = parseInt(req.params?.courseid);
            const result = await lesson_services_1.lessonService.updateTrackProgress(req.user?.id, courseid);
            if (result) {
                (0, helperError_1.response)(res, result, "Track progress fetched successfully");
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof customError_1.customError) {
                if (error.name == "NO_LESSONS") {
                    res.status(401).json({
                        message: error.error,
                    });
                }
                else {
                    res.status(500).json({
                        message: "Internal server error",
                    });
                }
            }
        }
    },
    async trackCourseProgress(req, res) {
        try {
            const { lessonid, completed } = req.body;
            const courseid = parseInt(req.params.courseid);
            const result = await lesson_services_1.lessonService.trackCourseProgressForStudent(req.user?.id, courseid, lessonid, completed);
            if (!Array.isArray(result)) {
                res.status(500).json({ message: "Unexpected result from service" });
            }
            const [trackprogress1, created] = result;
            if (!created) {
                if (completed && !trackprogress1.iscompleted) {
                    const result = await lesson_services_1.lessonService.updateCourseProgress(req.user?.id, courseid, lessonid, completed);
                    if (result) {
                        (0, helperError_1.response)(res, result, "Lesson marked as completed");
                    }
                }
                else if (!completed && !trackprogress1.iscompleted) {
                    (0, helperError_1.response)(res, result, "Lesson already added");
                }
                else {
                    (0, helperError_1.response)(res, result, "Lesson already completed");
                }
            }
            else {
                (0, helperError_1.response)(res, result, "Lesson added successfully");
            }
        }
        catch (error) {
            if (error instanceof customError_1.customError) {
                if (error.name == "LESSON_NOT_FOUND") {
                    res.status(401).json({
                        message: error.name,
                    });
                }
            }
            else {
                (0, helperError_1.catchResponse)(res, error);
            }
        }
    },
};
