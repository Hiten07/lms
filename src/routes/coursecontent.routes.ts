import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { CourseContentController } from '../controllers/coursecontent.controller';
import { validateparams } from '../utils/validateparams';

const router = Router();

router.get("/:courseid",verifyToken(['instructor']),validateparams([
    { name: "courseid",type: "number" }
]),CourseContentController.getModulesWithLessons);

export default router;