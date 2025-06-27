import { Request, Response } from "express";
import { courseService } from "../services/course.service";
import { courseContentService } from "../services/coursecontent.services";

export const CourseContentController = {

  async getModulesWithLessons(req: Request, res: Response) {
    const courseid = parseInt(req.params?.courseid);
    const user = req.user;

    try {
      
      if (user?.role === "student") {
        const enrolled = await courseService.checkEnrolledStudent(user?.id, courseid);
        if (!enrolled) {
          res.status(403).json({ error: "You are not enrolled in this course" });
          return;
        }
      }

      // Fetch modules ordered by 'order'
      const modules = await courseContentService.getModulesByCourseId(courseid);

      if (!modules || modules.length === 0) {
        res.status(404).json({ error: "No modules found for this course" });
        return;
      }

      console.log(modules);

      // For each module fetch lessons ordered by 'order'
      const modulesWithLessons = await Promise.all(
        modules.map(async (module: any) => {
          const lessons = await courseContentService.getLessonsByModuleId(module.id);
          return {
            id: module.id,
            title: module.title,
            description: module.description,
            order: module.order,
            lessons: lessons || []
          };
        })
      );

      res.status(200).json(modulesWithLessons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve course content" });
    }
  }
}


