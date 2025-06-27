import { course } from "../models/course";
import { enrolled } from "../models/enrolled";
import { user } from "../models/user";

export const reportRepositories = {
  async findMonthlyDetailsForInstructor() {
    

    const instructors = await user.findAll({
      where: { role: "instructor" },
      attributes: ["id", "firstname", "lastname", "email"],
      include: [
        {
          model: course,
          as: "instructor",
          attributes: ["courseid", "coursename", "description", "duration"],
          include: [
            {
              model: enrolled,
              as: "courses",
              attributes: ["createdAt"],
              include: [
                {
                  model: user,
                  as: "users",
                  attributes: ["id", "firstname", "email"],
                },
              ],
            },
          ],
        },
      ],
    });

    function getMonthName(monthNumber: number) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthNames[monthNumber - 1];
    }

    const currentMonth = getMonthName(new Date().getMonth() + 1);

    return instructors.map((instructor) => ({
      instructor: {
        id: instructor.id,
        name: `${instructor.firstname} - ${instructor.lastname}`,
        email: instructor.email,
      },
      month: currentMonth,
      courses: instructor.instructor.map((course) => ({
        id: course.courseid,
        title: course.coursename,
        description: course.description,

        enrolleds: course.courses.map((enrolled) => ({
          student: enrolled.users,
        })),
      })),
    }));
  },
};
