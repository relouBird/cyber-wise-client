import type { Course } from "./trainings.type";

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

