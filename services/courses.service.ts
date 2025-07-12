import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";
import type { Course, Domain } from "~/types/trainings.type";

export default function useCoursesService(): ServiceProps {
  /**
   * Fetch all les Categories...
   */
  const fetchAllCategories = async (): Promise<AxiosResponse> => {
    return await request(`/categories`, {
      method: "get",
    });
  };

  /**
   * Recuperer toutes les souscriptions cours...
   */
  const fetchAllCoursesSub = async (id: string): Promise<AxiosResponse> => {
    return await request(`/trainings/${id}/courses`, {
      method: "get",
    });
  };

  /**
   * Creer un cours...
   */
  const createCourse = async (payload: Course): Promise<AxiosResponse> => {
    return await request(`/admin/courses`, {
      method: "post",
      data: payload,
    });
  };

  /**
   * Mettre a jour un cours...
   */
  const updateCourse = async (
    id: string,
    payload: Course
  ): Promise<AxiosResponse> => {
    return await request(`/admin/courses/${id}`, {
      method: "put",
      data: payload,
    });
  };

  /**
   * Delete un cours...
   */
  const deleteCourse = async (id: string): Promise<AxiosResponse> => {
    return await request(`/admin/courses/${id}`, {
      method: "delete",
    });
  };

  /**
   * Ceci permet de recuperer tout les cours d'une formation precise
   */
  const getFormationCourses = async (id: string) => {
    return await request(`/admin/courses/training/${id}`, {
      method: "get",
    });
  };

  return {
    fetchAllCategories,
    createCourse,
    deleteCourse,
    fetchAllCoursesSub,
    updateCourse,
    getFormationCourses,
  };
}
