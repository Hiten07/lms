import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { courseController } from '../controllers/course.controller';

const router = Router();

router.use(verifyToken(['student']));

router.get('/courses',courseController.getStudentCourses);

router.get('/courses/:courseid',courseController.getCourseDetailsById);

router.get('/:courseid/assignments',courseController.getAllAssignments);

router.post('/enroll/:courseid',courseController.enrolledCourses);


export default router;