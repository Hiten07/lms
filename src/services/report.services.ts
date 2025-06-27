import { reportRepositories } from "../repositories/report.repositiories";

export const getInstructorReports = async () => {
  try {
    const result = await reportRepositories.findMonthlyDetailsForInstructor();
    if (result) {
      return result;
    }
  } catch (error) {
    console.log(error);
  }
};
