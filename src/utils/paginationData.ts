import { course } from "../models/course";
import { FindAndCountAllType } from "../types/interfaces";

export const paginationresponse = (data: FindAndCountAllType, page: number, limit: number) : { totalItems: number; totalPages: number; currentPage: number; courses: Array<any> } => {
    const { count: totalItems, rows: courses } = data;
    const currentPage = page > 0 ? page : 1; 
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages, currentPage, courses };
}
