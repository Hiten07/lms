import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { validateparams } from "../utils/validateparams";
import { assignmentController } from "../controllers/assignment.controller";
import { upload } from "../utils/cloudinary";
const router = Router();

router.get(
  "/:courseid/assignments",
  verifyToken(["instructor"]),
  validateparams([{ name: "courseid", type: "number" }]),
  assignmentController.getAssignments
);

router.post(
  "/:courseid/assignments",
  verifyToken(["instructor"]),
  upload.single("docs"),
  validateparams([{ name: "courseid", type: "number" }]),
  assignmentController.createAssignment
);

router.put(
  "/:courseid/assignments/:assignmentid",
  verifyToken(["instructor"]),
  upload.single("docs"),
  validateparams([
    { name: "courseid", type: "number" },
    { name: "assignmentid", type: "number" },
  ]),
  assignmentController.updateAssignment
);

router.post(
  "/:courseid/assignments/:assignmentid",
  upload.single("submissionpdf"),
  assignmentController.submitAssignment
);

router.post(
  "/:courseid/assignments/:assignmentid/submissions",
  verifyToken(["instructor"]),
  validateparams([
    { name: "courseid", type: "number" },
    { name: "assignmentid", type: "number" },
  ]),
  assignmentController.getSubmissionsForAssignment
);

router.put(
  "/:courseid/assignments/:assignmentid/submissions/:submissionid",
  verifyToken(["instructor"]),
  validateparams([
    { name: "courseid", type: "number" },
    { name: "assignmentid", type: "number" },
    { name: "submissionid", type: "number" },
  ]),
  assignmentController.updateSubmissionsStatus
);

router.delete(
  "/:courseid/assignments/:assignmentid",
  verifyToken(["instructor"]),
  validateparams([{ name: "assignmentid", type: "number" }]),
  assignmentController.deleteAssignment
);

export default router;
