import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {checkPermission} from "../middlewares/checkPersmission";

import { courseController } from "../controllers/course.controller";
import { upload } from "../utils/cloudinary";
import { validateparams } from "../utils/validateparams";
import { assignmentController } from "../controllers/assignment.controller";
const router = Router();

/**
 * @swagger
 * /courses/{courseid}/students:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all students enrolled in a course
 *     description: Fetches a list of students enrolled in a specific course by course ID
 *     parameters:
 *       - in: path
 *         name: courseid
 *         required: true
 *         description: The ID of the course
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: cookie
 *         name: token
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Successfully fetched students enrolled in the course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "students enrolled in course fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentId:
 *                         type: integer
 *                         example: 123
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *       400:
 *         description: Bad request - Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: INVALID_CREDENTIALS
 *                 message:
 *                   type: string
 *                   example: "unauthorized"
 * 
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  error:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 *                  message:
 *                   type: string
 *                   example: "internal server error"
 *                  
 */

router.get(
  "/:courseid/students",
  verifyToken(["instructor"]),
  validateparams([
    {
      name: "courseid",
      type: "number",
    },
  ]),
  courseController.getAllStudentsOfCourse
);

/**
 * @swagger
 * /courses/mycourses:
 *   get:
 *     tags:
 *       - Course
 *     summary: Get all courses of the instructor
 *     description: Fetches a paginated list of courses created by the instructor
 *     parameters:
 *       - in: cookie
 *         name: token
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: pageSize
 *         description: The number of courses to return per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: sortBy
 *         description: The field to sort by (e.g., duration)
 *         required: false
 *         schema:
 *           type: string
 *           example: "duration"
 *       - in: query
 *         name: sortType
 *         description: The type of sorting (asc or desc)
 *         required: false
 *         schema:
 *           type: string
 *           example: "asc"
 *       - in: query
 *         name: search
 *         description: Search term to filter courses
 *         required: false
 *         schema:
 *           type: string
 *           example: "math"
 *     responses:
 *       200:
 *         description: Successfully fetched courses of the instructor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "courses fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           courseId:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Introduction to Mathematics"
 *                           duration:
 *                             type: string
 *                             example: "4 weeks"
 *                     total:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: Bad request - No courses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "NO_COURSE_FOUND"
 *                 message:
 *                   type: string
 *                   example: "No courses found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "UNAUTHORIZED"
 *                 message:
 *                   type: string
 *                   example: "Invalid or missing token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get(
  "/mycourses",
  verifyToken(["instructor"]),
  courseController.getAllInstructorCourses
);

/**
 * @swagger
 * /courses/create:
 *   post:
 *     tags:
 *       - Course
 *     summary: Create a new course
 *     description: Allows an instructor to create a new course
 *     parameters:
 *       - in: cookie
 *         name: token
 *         description: JWT token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     requestBody:
 *       required: true
 *       description: Course details to be created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coursename:
 *                 type: string
 *                 description: The name of the course
 *                 example: "Advanced Mathematics"
 *               courseprice:
 *                 type: number
 *                 description: price of the course
 *                 example: 5000
 *               description:
 *                 type: string
 *                 description: Duration of the course
 *                 example: "advanced finance mastery"
 *               duration:
 *                 type: number
 *                 description: 
 *                 example: 90
 *             required:
 *               - title
 *               - description
 *               - duration
 *               - level
 *     responses:
 *       200:
 *         description: Successfully created the course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Course created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad request - Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Course data is invalid or not found"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "UNAUTHORIZED"
 *                 message:
 *                   type: string
 *                   example: "Invalid or missing token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post(
  "/create",
  verifyToken(["instructor"]),
  checkPermission("createCourse"),
  courseController.createCourse
);

router.post(
  "/:courseid/module",
  verifyToken(["instructor"]),
  validateparams([
    {
      name: "courseid",
      type: "number",
    },
  ]),
  courseController.addModuleToCourse
);


router.post(
  "/module/:moduleid/lessons",
  verifyToken(["instructor"]),
  upload.fields([
    { name: "videos", maxCount: 1 },
    { name: "docs", maxCount: 1 },
  ]),
  checkPermission('createLessons'),
  courseController.addModuleLesson
);

router.put(
  "/update/:courseid",
  verifyToken(["instruct  or"]),
  validateparams([
    {
      name: "courseid",
      type: "number",
    },
  ]),
  courseController.updateCourseDetails
);


router.delete(
  "/delete/:courseid",
  verifyToken(["instructor"]),
  validateparams([{
    name: "courseid",type: "number"
  }]),
  courseController.deleteCourseDetails
);

export default router;
