import type { Course } from "./trainings.type";


export interface SubCoursesInterface {
  id?: number;
  course_id?: number;
  sib?: number;
  title: string;
  content: string;
  image?: string;
  order: number;
  status: "pending" | "completed";
}

export interface CategoryType {
  title: string;
  value: string;
  color: string;
}


export interface CategoriesResponse {
  message: string;
  data: CategoryType[];
}

export interface CourseResponse {
  message: string;
  data: Course;
}

export interface CoursesResponse {
  message: string;
  data: Course[];
}


export interface SubCoursesResponse {
  message: string;
  data: SubCoursesInterface[];
}

export interface SubCourseResponse {
  message: string;
  data: SubCoursesInterface;
}