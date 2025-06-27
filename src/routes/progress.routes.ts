import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { lessonController } from "../controllers/lesson.controller";
import { validateparams } from "../utils/validateparams";
const router = Router();

router.use(verifyToken(["student"]));

router.post(
  "/:courseid/lessons/start",
  validateparams([{ name: "courseid", type: "number" }]),
  lessonController.trackCourseProgress
);

router.post(
  "/:courseid/lessons/completed",
  validateparams([{ name: "courseid", type: "number" }]),
  lessonController.trackCourseProgress
);

router.post(
  "/:courseid/trackprogress",
  validateparams([{ name: "courseid", type: "number" }]),
  lessonController.getCourseProgress
);

export default router;
