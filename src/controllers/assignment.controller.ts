import { Request, Response } from "express";
import { response } from "../errors/helperError";
import { customError } from "../errors/customError";
import { assignmentService } from "../services/assignment.service";
import { paginationData } from "../types/interfaces";
import { paginationresponse } from "../utils/paginationData";


export const assignmentController = {
  async createAssignment(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);

    try {
      const files = req.file;
      if (!files) {
        res.status(400).json({ error: "pdf file is required" });
      }

      console.log(files);

      const assignmentdata = {
        courseid: courseid,
        title: req.body.title,
        description: req.body.description,
        assignmentUrl: files?.path,
        duedate: req.body.duedate,
      };

      const result = await assignmentService.createCourseAssignment(
        assignmentdata
      );

      if (result) {
        response(res, result, "Asssignement added successfully");
      }
    } catch (error) {
      console.log(error);
    }
  },

  async updateAssignment(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);
    const assignmentid = parseInt(req.params?.assignmentid);
    try {
      const files = req.file;
      const assignmentdata = {
        courseid: courseid,
        title: req.body.title,
        description: req.body.description,
        assignmentUrl: files?.path, // Only update if a new file is uploaded
        duedate: req.body.duedate,
      };
      const result = await assignmentService.updateCourseAssignment(
        assignmentid,
        assignmentdata
      );
      response(res, result, "Assignment updated successfully");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the assignment" });
    }
  },

  async getAssignments(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);

    try {
      const page = Number(req.query.page) || 0;

      const limit = Number(req.query.pageSize) || 5;

      const offset = page * limit;

      const sortBy = String(req.query.sortBy) || "duration";

      const sortType = req.query.sortType === "asc" ? "ASC" : "DESC";

      const userid = req.user?.id;

      const search = (req.query.search as string) || "";

      const paginationData: paginationData = {
        limit: limit,
        offset: offset,
        sortBy: sortBy,
        sortType: sortType,
        search: search,
      };

      const assignments = await assignmentService.getCourseAssignmentsWithPagination(courseid,paginationData);

      if (assignments) {
        const result = paginationresponse(assignments,page,limit);
        response(res, result, "Assignments retrieved successfully");
      } else {
        res.status(404).json({ error: "No assignments found for this course" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving assignments" });
    }
  },

  async deleteAssignment(req: Request, res: Response) {
    const assignmentid = parseInt(req.params?.assignmentid);

    try {
      const result = await assignmentService.deleteAssignmentForCourse(
        assignmentid
      );

      if (result) {
        response(res, result, "Assignment deleted successfully");
      } else {
        res.status(404).json({ error: "Assignment not found" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the assignment" });
    }
  },

  async submitAssignment(req: Request, res: Response) {
    try {

      const courseid = parseInt(req.params?.courseid);
      const assignmentid = parseInt(req.params?.assignmentid);
      const user = req.user;

      const file = req.file;

      if (!file) {
        res.status(400).json({ error: "Submission file is required" });
        return;
      }
   

      const enrolled = await assignmentService.checkEnrolledStudent(user?.id,courseid);

      if (!enrolled || user?.role !== "student") {
        res
          .status(403)
          .json({ error: "You are not authorized to submit this assignment" });
        return;
      }

      const submission = {
        userid: user.id,
        courseid: courseid,
        assignmentid: assignmentid,
        submissionUrl: file.path,
      };
  
      const result2 = await assignmentService.submitAssignment(submission);
      response(res, result2, "Assignment submitted successfully");

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to submit assignment" });
    }
  },

  async getSubmissionsForAssignment(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);
    const assignmentid = parseInt(req.params?.assignmentid);

    const user = req.user;
    try {
      // Only instructor or admin can see submissions

      if (user?.role != "instructor") {
        res.status(403).json({
          error: "Access denied: only instructor can view submissions",
        });
      }
      // Fetch submissions from service
      const submissions = await assignmentService.getSubmissionsByAssignment(
        courseid,
        assignmentid
      );

      if (submissions!.length === 0) {
        res
          .status(404)
          .json({ error: "No submissions found for this assignment" });
      }

      response(res, submissions, "Submissions retrieved successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve submissions" });
    }
  },

  async updateSubmissionsStatus(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);
    const assignmentid = parseInt(req.params?.assignmentid);
    const submissionid = parseInt(req.params?.submissionid);
    const user = req.user;

    try {
      // Access control: instructor/admin only

      if (user?.role != "instructor") {
        res
          .status(403)
          .json({ error: "Access denied: only instructor can update remarks" });
      }

      const { remark } = req.body;
      if (typeof remark !== "boolean") {
        res.status(400).json({ error: "Remark must be a boolean value" });
      }

      const updateResult = await assignmentService.updateSubmissionRemarks(
        remark,
        submissionid,
        assignmentid,
        courseid
      );

      if (updateResult!.length >= 1) {
        response(res, updateResult, "Remark updated successfully");
      } else {
        res
          .status(404)
          .json({ error: "Submission not found or update failed" });
      }
    } catch (error) {
      console.error(error);
      if (error instanceof customError) {
        if (error.name === "INSTRUCTOR_ACCESS_DENIED") {
          res.status(403).json({
            message: error.message,
          });
        }
      }
      res.status(500).json({ error: "Failed to update remark" });
    }
  },
};
