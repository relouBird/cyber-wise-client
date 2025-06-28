import type { AxiosResponse } from "axios";
import { request } from "~/helpers/request_axios";
import type { ServiceProps } from "~/types/common.type";
import type { Domain } from "~/types/trainings.type";

export default function useTrainingService(): ServiceProps {
  /**
   * Fetch all les Domains...
   */
  const fetchAllDomains = async (): Promise<AxiosResponse> => {
    return await request(`/admin/domains`, {
      method: "get",
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const createDomain = async (payload: Domain) => {
    return await request(`/admin/domains`, {
      method: "post",
      data: payload,
    });
  };
  /**
   * Cette fonction permet de créer un service...
   */
  const deleteDomain = async (id: string) => {
    return await request(`/admin/domains/${id}`, {
      method: "delete",
    });
  };

  /**
   * Fetch all les Formations...
   */
  const fetchAllTrainings = async (): Promise<AxiosResponse> => {
    return await request(`/admin/trainings`, {
      method: "get",
    });
  };

  /**
   * Cette fonction permet de créer un service...
   */
  const createTraining = async (payload: Domain) => {
    return await request(`/admin/trainings`, {
      method: "post",
      data: payload,
    });
  };

  return {
    fetchAllDomains,
    fetchAllTrainings,
    createDomain,
    createTraining,
    deleteDomain,
  };
}
